import { HELP } from './help.js';
import { DIRS, RESUME_LINES, VERSION } from './fs.js';

function askLogin( session ) {
  session.clear();
  session.prompt( 'login', ( name ) => {
    session.user = name;
    session.output( `Hi ${ name }!` );
    session.output(
      `Type ${ session.format.u( 'help' ) } to see a list of commands.`,
    );
  } );
}

function isResume( session, file ) {
  return (
    ( session.directory === '' && file === 'Documents/resume.txt' )
    || ( session.directory === 'Documents' && file === 'resume.txt' )
  );
}

export const COMMANDS = {
  clear: ( session ) => session.clear(),

  help: ( session, [ command ] ) => {
    if ( command ) {
      session.output(
        `help: ${ HELP[ command ] || `no help topics match ${ session.format.u( command ) }` }`,
      );
    } else {
      session.output(
        `Type ${ session.format.u( 'help name' ) } to find out more about the function ${ session.format.u( 'name' ) }.`,
      );
      session.output( Object.keys( HELP ).join( ', ' ) );
    }
  },

  version: ( session ) => session.output( `wllnr.nl terminal v${ VERSION }` ),

  wipe: ( session ) => {
    session.prompt( 'Are you sure remove all your commands history? Y/N', ( value ) => {
      if ( value.trim().toUpperCase() === 'Y' ) {
        session.wipeHistory();
        session.output( 'History of commands wiped.' );
      }
    } );
  },

  contact: ( session ) => {
    session.output(
      `You can mail me at ${ session.format.a( 'jeroen@wllnr.nl', 'mailto:jeroen@wllnr.nl' ) }.`,
    );
  },

  ps: ( session ) => {
    session.output( 'PID    TTY    TIME     CMD' );
    session.output( '  1    ?       0:00    /bin/bash' );
    session.output( '  2    ?       0:00    /bin/terminal' );
    if ( session.party ) {
      session.output( '  3    ?       0:00    party.sh' );
    }
  },

  kill: ( session, [ pid ] ) => {
    if ( !pid ) {
      session.output( 'kill: missing operand' );
      return;
    }

    if ( pid === '1' ) {
      session.output( 'kill: cannot kill process 1: Operation not permitted' );
      return;
    }

    if ( pid === '2' ) {
      session.idle();
      session.scheduler.setTimeout( () => {
        session.output( `kill: sending KILL signal to process ${ pid }` );
        session.effects.reboot?.();
      }, 1000 );
      return;
    }

    if ( pid === '3' && session.party ) {
      session.scheduler.clearInterval( session.party );
      session.party = false;
      session.effects.party?.( false );
      session.output( 'kill: party.sh stopped' );
      return;
    }

    session.output( 'kill: No such process' );
  },

  ping: ( session, [ host ] ) => {
    if ( !host ) {
      session.output( 'ping: missing operand' );
      return;
    }

    session.idle();
    for ( let i = 0; i < 4; i += 1 ) {
      session.scheduler.setTimeout( () => {
        session.output(
          `64 bytes from ${ host }: icmp_seq=${ i + 1 } ttl=64 time=0.3 ms`,
        );
      }, i * 500 );
    }

    session.scheduler.setTimeout( () => {
      session.setPrompt();
    }, 2000 );
  },

  logout: ( session ) => {
    if ( session.exitMode === 'disconnect' ) {
      session.output( 'Connection closed.' );
      session.disconnect();
      return;
    }
    askLogin( session );
  },

  exit: ( session ) => {
    if ( session.exitMode === 'disconnect' ) {
      session.output( 'Connection closed.' );
      session.disconnect();
      return;
    }
    askLogin( session );
  },

  ls: ( session ) => {
    if ( session.directory === '' ) {
      session.output( Object.keys( DIRS ).join( ' ' ) );
    } else if ( DIRS[ session.directory ] ) {
      session.output( DIRS[ session.directory ].join( ' ' ) );
    }
  },

  cd: ( session, [ dir ] ) => {
    if ( !dir ) {
      session.output( 'cd: missing operand' );
      return;
    }

    if ( session.directory === '' && DIRS[ dir ] ) {
      session.directory = dir;
      session.setPrompt( `~/${ dir }` );
      return;
    }

    if ( dir === '..' || dir === '~' ) {
      session.directory = '';
      session.setPrompt( '~/' );
      return;
    }

    session.output( `cd: ${ dir }: No such file or directory` );
  },

  cat: ( session, [ file ] ) => {
    if ( !file ) {
      session.output( 'cat: missing operand' );
      return;
    }

    if ( isResume( session, file ) ) {
      for ( const line of RESUME_LINES ) {
        session.output( line );
      }
      return;
    }

    session.output( `cat: ${ file }: No such file or directory` );
  },

  whoami: ( session ) => {
    session.output( session.user );
  },

  who: ( session ) => {
    session.output( `${ session.user }   tty1     ${ new Date().toUTCString() }` );
  },

  pwd: ( session ) => {
    session.output( `~/${ session.directory }` );
  },

  sudo: ( session ) => {
    session.output(
      `${ session.user } is not in the sudoers file. This incident will be reported`,
    );
  },

  'party.sh': ( session ) => {
    if ( session.directory !== 'tools' ) {
      session.output( 'command not found: party.sh' );
      return;
    }

    if ( !session.party ) {
      session.party = session.scheduler.setInterval( () => {
        session.effects.party?.( true, { tick: true } );
      }, 100 );
      session.effects.party?.( true, { tick: false } );
      session.output( "Let's get this party started! 🎉🎉🎉" );
    }
  },

  history: ( session ) => {
    session.history.forEach( ( command, index ) => {
      session.output( `${ index + 1 }  ${ command }` );
    } );
  },
};

export { askLogin };
