import {
  createSession,
  plainFormat,
  memoryStorage,
  globalScheduler,
} from '@wllnr/term-core';

/**
 * Wire an ssh2 shell stream to a term-core session.
 */
export function attachShellSession( stream, { username, onClose, idleTimeoutMs = 0 } ) {
  const scheduler = globalScheduler();
  let closed = false;
  let lineBuffer = '';
  let idleTimer = null;
  let lastPrompt = '~/ $';
  let isIdle = false;
  let skipNextNewline = false;
  let runtime;

  const writeLine = ( text = '' ) => {
    if ( closed ) return;
    const line = String( text ).replace( /\r?\n/g, '\r\n' );
    stream.write( `${ line }\r\n` );
  };

  const writePrompt = () => {
    if ( closed || isIdle ) return;
    stream.write( String( lastPrompt ) );
  };

  const bumpIdle = () => {
    if ( idleTimer ) clearTimeout( idleTimer );
    if ( !idleTimeoutMs || closed ) return;
    idleTimer = setTimeout( () => {
      writeLine( 'Idle timeout. Bye!' );
      runtime.session.disconnect();
    }, idleTimeoutMs );
  };

  const io = {
    write: writeLine,
    clear: () => {
      if ( closed ) return;
      stream.write( '\x1b[2J\x1b[H' );
    },
    setStatus: ( { prompt, idle, asking } = {} ) => {
      if ( closed ) return;

      if ( idle ) {
        isIdle = true;
        return;
      }

      const wasIdle = isIdle;
      isIdle = false;

      if ( prompt !== undefined ) {
        lastPrompt = String( prompt );
      }

      // Show immediately for ask-prompts and when leaving idle (e.g. ping done).
      if ( asking || wasIdle ) {
        writePrompt();
      }
    },
  };

  runtime = createSession( {
    io,
    format: plainFormat,
    storage: memoryStorage(),
    scheduler,
    exitMode: 'disconnect',
    onDisconnect: () => {
      if ( closed ) return;
      closed = true;
      if ( idleTimer ) clearTimeout( idleTimer );
      try {
        stream.exit( 0 );
        stream.close();
      } catch {
        // ignore
      }
      onClose?.();
    },
    effects: {
      party( active, { tick } = {} ) {
        if ( !active || tick ) return;
        writeLine( '* party mode engaged (best experienced in the browser)' );
      },
      reboot() {
        scheduler.setTimeout( () => {
          runtime.session.clear();
          runtime.session.output( 'Terminal rebooted.' );
          runtime.session.setPrompt();
          writePrompt();
        }, 2000 );
      },
    },
  } );

  const banner = [
    '',
    '  wllnr.nl fake shell',
    '  Same playground as https://www.wllnr.nl — not a real login.',
    '  Type help for commands. exit disconnects.',
    '',
  ].join( '\n' );

  runtime.start( {
    welcome: banner,
    user: username || 'guest',
    skipLogin: true,
  } );
  writePrompt();
  bumpIdle();

  stream.on( 'data', ( data ) => {
    bumpIdle();
    const chunk = data.toString( 'utf8' );

    for ( const char of chunk ) {
      if ( char === '\u0003' ) { // Ctrl+C
        lineBuffer = '';
        writeLine( '^C' );
        runtime.session.setPrompt();
        writePrompt();
        continue;
      }

      if ( char === '\u0004' ) { // Ctrl+D
        if ( !lineBuffer ) {
          runtime.session.output( 'Connection closed.' );
          runtime.session.disconnect();
        }
        continue;
      }

      if ( char === '\r' ) {
        skipNextNewline = true;
        const line = lineBuffer;
        lineBuffer = '';
        stream.write( '\r\n' );
        runtime.handleLine( line );
        if ( !runtime.isAsking() && !isIdle ) {
          writePrompt();
        }
        continue;
      }

      if ( char === '\n' ) {
        if ( skipNextNewline ) {
          skipNextNewline = false;
          continue;
        }
        const line = lineBuffer;
        lineBuffer = '';
        stream.write( '\r\n' );
        runtime.handleLine( line );
        if ( !runtime.isAsking() && !isIdle ) {
          writePrompt();
        }
        continue;
      }

      if ( char === '\u007f' || char === '\b' ) {
        if ( lineBuffer.length ) {
          lineBuffer = lineBuffer.slice( 0, -1 );
          stream.write( '\b \b' );
        }
        continue;
      }

      if ( char < ' ' ) continue;

      lineBuffer += char;
      stream.write( char );
    }
  } );

  stream.on( 'close', () => {
    if ( closed ) return;
    closed = true;
    if ( idleTimer ) clearTimeout( idleTimer );
    onClose?.();
  } );

  return { runtime };
}
