import {
  createSession,
  htmlFormat,
  globalScheduler,
} from '@wllnr/term-core';
import cloneCommandNode from './modules/cloneCommandNode.js';
import markup from './modules/markup.js';

const KEY = 'VanillaTerm';

const { addEventListener, localStorage } = window;

function localStorageHistory() {
  return {
    getHistory: () => {
      try {
        return localStorage[ KEY ] ? JSON.parse( localStorage[ KEY ] ) : [];
      } catch {
        return [];
      }
    },
    setHistory: ( history ) => {
      localStorage[ KEY ] = JSON.stringify( history );
    },
  };
}

class Terminal {
  constructor( props = {} ) {
    const {
      container = 'vanilla-terminal',
      welcome = 'Hello welcome to <a href="">wllnr.nl</a>.\n',
      prompt = '~/',
      separator = '$',
    } = props;

    this.shell = { prompt, separator };
    this.welcome = welcome;

    const el = document.getElementById( container );
    if ( !el ) {
      throw Error( `Container #${ container } doesn't exists.` );
    }

    this.cacheDOM( el );
    this.addListeners();

    const scheduler = globalScheduler();
    const self = this;

    this.runtime = createSession( {
      format: htmlFormat,
      storage: localStorageHistory(),
      scheduler,
      exitMode: 'relogin',
      io: {
        write: ( text ) => {
          self.DOM.output.insertAdjacentHTML(
            'beforeEnd',
            `<span>${ text ?? htmlFormat.empty() }</span>`,
          );
          self.resetCommand();
        },
        clear: () => {
          self.DOM.output.innerHTML = '';
          self.resetCommand();
        },
        setStatus: ( { prompt: nextPrompt, idle, asking } = {} ) => {
          if ( idle ) {
            self.DOM.command.classList.add( 'idle' );
            self.DOM.prompt.innerHTML = '<div class="spinner"></div>';
            return;
          }

          self.DOM.command.classList.remove( 'idle' );
          if ( nextPrompt !== undefined ) {
            self.DOM.prompt.innerHTML = nextPrompt;
          }
          if ( asking ) {
            self.DOM.command.classList.add( 'input' );
          } else {
            self.DOM.command.classList.remove( 'input' );
          }
          self.resetCommand();
          self.DOM.input.focus();
        },
      },
      effects: {
        party( active, { tick } = {} ) {
          if ( !active ) {
            document.body.style.backgroundColor = '';
            return;
          }
          if ( tick ) {
            const colors = [ 'black', 'red', 'orange', 'green', 'blue', 'white', 'yellow' ];
            document.body.style.backgroundColor = colors[
              Math.floor( Math.random() * colors.length )
            ];
          }
        },
        reboot() {
          scheduler.setTimeout( () => {
            self.DOM.container.style.opacity = 0;
          }, 1000 );
          scheduler.setTimeout( () => {
            self.runtime.session.clear();
            self.DOM.container.style.opacity = 1;
            self.runtime.session.output( 'Terminal rebooted.' );
            self.runtime.session.setPrompt();
          }, 2000 );
        },
      },
    } );

    this.runtime.start( { welcome } );
  }

  cacheDOM = ( el ) => {
    el.classList.add( KEY );
    el.insertAdjacentHTML( 'beforeEnd', markup( this ) );

    const container = el.querySelector( '.container' );
    this.DOM = {
      container,
      output: container.querySelector( 'output' ),
      command: container.querySelector( '.command' ),
      input: container.querySelector( '.command .input' ),
      prompt: container.querySelector( '.command .prompt' ),
    };
  };

  addListeners = () => {
    const { DOM } = this;

    const observer = new MutationObserver( () => {
      setTimeout( () => DOM.input.scrollIntoView(), 10 );
    } );
    observer.observe( DOM.output, { childList: true } );

    addEventListener( 'click', () => DOM.input.focus(), false );
    DOM.output.addEventListener(
      'click',
      ( event ) => event.stopPropagation(),
      false,
    );
    DOM.input.addEventListener( 'keyup', this.onKeyUp, false );
    DOM.input.addEventListener( 'keydown', this.onKeyDown, false );
    DOM.command.addEventListener( 'click', () => DOM.input.focus(), false );

    addEventListener(
      'keyup',
      ( event ) => {
        DOM.input.focus();
        event.stopPropagation();
        event.preventDefault();
      },
      false,
    );
  };

  onKeyUp = ( event ) => {
    const { keyCode } = event;
    const history = this.runtime.getHistory();
    let historyCursor = this.runtime.getHistoryCursor();

    if ( keyCode === 27 ) {
      this.DOM.input.value = '';
      event.stopPropagation();
      event.preventDefault();
    } else if ( [ 38, 40 ].includes( keyCode ) ) {
      if ( keyCode === 38 && historyCursor > 0 ) {
        historyCursor -= 1;
      }
      if ( keyCode === 40 && historyCursor < history.length - 1 ) {
        historyCursor += 1;
      }
      this.runtime.setHistoryCursor( historyCursor );
      if ( history[ historyCursor ] ) {
        this.DOM.input.value = history[ historyCursor ];
      }
    }
  };

  onKeyDown = ( { keyCode } ) => {
    const { DOM } = this;
    const commandLine = DOM.input.value.trim();
    if ( keyCode !== 13 || !commandLine ) return;

    const asking = this.runtime.isAsking();

    if ( !asking ) {
      DOM.output.appendChild( cloneCommandNode( DOM.command ) );
    }

    DOM.command.classList.add( 'hidden' );
    DOM.input.value = '';

    this.runtime.handleLine( commandLine );
  };

  resetCommand = () => {
    const { DOM } = this;
    DOM.input.value = '';
    DOM.command.classList.remove( 'hidden' );
    if ( DOM.input.scrollIntoView ) DOM.input.scrollIntoView();
  };

  prompt( question, callback ) {
    this.runtime.session.prompt( question, callback );
  }

  output( html ) {
    this.runtime.session.output( html );
  }
}

if ( window ) window.VanillaTerminal = Terminal;

export default Terminal;
