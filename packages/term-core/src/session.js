import { COMMANDS, askLogin } from './commands.js';
import {
  globalScheduler,
  memoryStorage,
  plainFormat,
} from './format.js';

/**
 * @typedef {object} TermIO
 * @property {(text?: string) => void} write
 * @property {() => void} clear
 * @property {(status: { prompt?: string, idle?: boolean, asking?: boolean }) => void} [setStatus]
 */

/**
 * Create a DOM-free terminal session.
 *
 * @param {object} options
 * @param {TermIO} options.io
 * @param {{ party?: Function, reboot?: Function }} [options.effects]
 * @param {{ getHistory: Function, setHistory: Function }} [options.storage]
 * @param {{ setTimeout: Function, clearTimeout: Function, setInterval: Function, clearInterval: Function }} [options.scheduler]
 * @param {{ u: Function, a: Function, empty: Function }} [options.format]
 * @param {'relogin'|'disconnect'} [options.exitMode]
 * @param {() => void} [options.onDisconnect]
 * @param {Record<string, Function>} [options.commands]
 */
export function createSession( options = {} ) {
  const {
    io,
    effects = {},
    storage = memoryStorage(),
    scheduler = globalScheduler(),
    format = plainFormat,
    exitMode = 'relogin',
    onDisconnect = () => {},
    commands: extraCommands = {},
  } = options;

  if ( !io || typeof io.write !== 'function' || typeof io.clear !== 'function' ) {
    throw new Error( 'createSession requires io.write and io.clear' );
  }

  const state = {
    user: '',
    directory: '',
    party: false,
    shell: { prompt: '~/', separator: '$' },
    asking: null,
    history: storage.getHistory() || [],
    historyCursor: 0,
  };

  state.historyCursor = state.history.length;

  const commands = { ...COMMANDS, ...extraCommands };

  const session = {
    get user() {
      return state.user;
    },
    set user( value ) {
      state.user = value;
    },
    get directory() {
      return state.directory;
    },
    set directory( value ) {
      state.directory = value;
    },
    get party() {
      return state.party;
    },
    set party( value ) {
      state.party = value;
    },
    get history() {
      return state.history;
    },
    get format() {
      return format;
    },
    get effects() {
      return effects;
    },
    get scheduler() {
      return scheduler;
    },
    get exitMode() {
      return exitMode;
    },
    get shell() {
      return state.shell;
    },

    output( text ) {
      if ( text === undefined || text === null ) {
        io.write( format.empty() );
        return;
      }
      io.write( String( text ) );
    },

    clear() {
      io.clear();
    },

    idle() {
      io.setStatus?.( { idle: true } );
    },

    setPrompt( prompt = state.shell.prompt ) {
      state.shell.prompt = prompt;
      io.setStatus?.( {
        idle: false,
        asking: false,
        prompt: `${ prompt }${ state.shell.separator }`,
      } );
    },

    prompt( question, callback = () => {} ) {
      state.asking = callback;
      io.setStatus?.( {
        idle: false,
        asking: true,
        prompt: `${ question }:`,
      } );
    },

    wipeHistory() {
      state.history = [];
      state.historyCursor = 0;
      storage.setHistory( [] );
    },

    disconnect() {
      if ( state.party ) {
        scheduler.clearInterval( state.party );
        state.party = false;
        effects.party?.( false );
      }
      onDisconnect();
    },

    askLogin() {
      askLogin( session );
    },
  };

  function handleLine( line ) {
    const trimmed = String( line ?? '' ).trim();
    if ( !trimmed ) {
      return { kind: 'empty' };
    }

    if ( state.asking ) {
      const callback = state.asking;
      state.asking = null;
      callback( trimmed );
      if ( !state.asking ) {
        session.setPrompt();
      }
      return { kind: 'answer' };
    }

    state.history.push( trimmed );
    storage.setHistory( state.history );
    state.historyCursor = state.history.length;

    const [ command, ...parameters ] = trimmed.split( /\s+/ );

    if ( Object.prototype.hasOwnProperty.call( commands, command ) ) {
      commands[ command ]( session, parameters );
      return { kind: 'command', command, parameters };
    }

    session.output( `${ format.u( command ) }: command not found.` );
    return { kind: 'unknown', command };
  }

  function start( {
    welcome,
    user,
    skipLogin = false,
  } = {} ) {
    if ( welcome ) {
      for ( const line of String( welcome ).split( '\n' ) ) {
        session.output( line );
      }
      session.output( format.empty() );
    }

    if ( skipLogin && user ) {
      state.user = user;
      session.output( `Hi ${ user }!` );
      session.output(
        `Type ${ format.u( 'help' ) } to see a list of commands.`,
      );
      session.setPrompt();
      return;
    }

    askLogin( session );
  }

  return {
    handleLine,
    start,
    session,
    getHistory: () => state.history,
    getHistoryCursor: () => state.historyCursor,
    setHistoryCursor: ( value ) => {
      state.historyCursor = value;
    },
    isAsking: () => Boolean( state.asking ),
  };
}
