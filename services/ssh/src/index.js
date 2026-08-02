import ssh2 from 'ssh2';
import { loadHostKey } from './hostKey.js';
import { createLimiter } from './limits.js';
import { attachShellSession } from './sessionBridge.js';

const { Server } = ssh2;

const PORT = Number( process.env.PORT || 22 );
const hostKey = loadHostKey();
const limiter = createLimiter();

const server = new Server( {
  hostKeys: [ hostKey ],
  banner: 'wllnr.nl terminal — simulated shell only\r\n',
}, ( client, info ) => {
  const ip = info.ip || client._sock?.remoteAddress || 'unknown';
  let username = 'guest';
  let acquired = false;
  let shellAttached = false;

  const release = () => {
    if ( acquired ) {
      limiter.release( ip );
      acquired = false;
    }
  };

  client.on( 'authentication', ( ctx ) => {
    username = ctx.username || 'guest';

    // Theatrical auth: accept any password / keyboard-interactive / none.
    if ( [ 'password', 'keyboard-interactive', 'none' ].includes( ctx.method ) ) {
      if ( !limiter.tryAcquire( ip ) ) {
        ctx.reject( [ 'password', 'keyboard-interactive' ], false );
        client.end();
        return;
      }
      acquired = true;
      ctx.accept();
      return;
    }

    ctx.reject( [ 'password', 'keyboard-interactive', 'none' ] );
  } );

  client.on( 'ready', () => {
    client.on( 'session', ( accept ) => {
      const session = accept();

      session.on( 'pty', ( acceptPty ) => {
        acceptPty?.();
      } );

      session.on( 'shell', ( acceptShell ) => {
        if ( shellAttached ) {
          acceptShell?.().close();
          return;
        }
        shellAttached = true;
        const stream = acceptShell();

        attachShellSession( stream, {
          username,
          idleTimeoutMs: limiter.idleTimeoutMs,
          onClose: () => {
            release();
            client.end();
          },
        } );
      } );

      session.on( 'exec', ( acceptExec, rejectExec ) => {
        // No remote command execution — shell only.
        rejectExec?.();
      } );
    } );
  } );

  client.on( 'close', release );
  client.on( 'error', ( err ) => {
    console.error( `[ssh] client error from ${ ip }:`, err.message );
    release();
  } );
} );

server.on( 'error', ( err ) => {
  console.error( '[ssh] server error:', err );
  process.exit( 1 );
} );

server.listen( PORT, '0.0.0.0', () => {
  console.log( `[ssh] listening on 0.0.0.0:${ PORT }`, limiter.stats() );
} );
