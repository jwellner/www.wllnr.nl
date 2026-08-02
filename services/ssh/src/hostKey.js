import fs from 'node:fs';
import path from 'node:path';
import { generateKeyPairSync } from 'node:crypto';

/**
 * Load a host private key from HOST_KEY_PATH, or generate an ephemeral RSA key.
 */
export function loadHostKey() {
  const keyPath = process.env.HOST_KEY_PATH;

  if ( keyPath ) {
    const resolved = path.resolve( keyPath );
    if ( !fs.existsSync( resolved ) ) {
      throw new Error( `HOST_KEY_PATH not found: ${ resolved }` );
    }
    return fs.readFileSync( resolved );
  }

  console.warn( '[ssh] HOST_KEY_PATH unset; generating ephemeral host key (dev only)' );
  const { privateKey } = generateKeyPairSync( 'rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  } );
  return privateKey;
}
