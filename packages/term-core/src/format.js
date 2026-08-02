/** Plain-text format helpers (SSH / defaults). */
export const plainFormat = {
  u: ( text ) => text,
  a: ( text, href ) => ( href ? `${ text } <${ href }>` : text ),
  empty: () => '',
};

/** HTML format helpers for the website terminal. */
export const htmlFormat = {
  u: ( text ) => `<u>${ text }</u>`,
  a: ( text, href = '' ) => `<a href="${ href }">${ text }</a>`,
  empty: () => '&nbsp;',
};

export function memoryStorage() {
  let history = [];
  return {
    getHistory: () => [ ...history ],
    setHistory: ( next ) => {
      history = [ ...next ];
    },
  };
}

export function globalScheduler() {
  return {
    setTimeout: ( ...args ) => setTimeout( ...args ),
    clearTimeout: ( ...args ) => clearTimeout( ...args ),
    setInterval: ( ...args ) => setInterval( ...args ),
    clearInterval: ( ...args ) => clearInterval( ...args ),
  };
}
