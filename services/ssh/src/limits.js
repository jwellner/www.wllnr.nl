export function createLimiter( {
  maxSessions = Number( process.env.MAX_SESSIONS || 32 ),
  maxPerIp = Number( process.env.MAX_SESSIONS_PER_IP || 4 ),
  idleTimeoutMs = Number( process.env.IDLE_TIMEOUT_MS || 15 * 60 * 1000 ),
} = {} ) {
  let active = 0;
  const perIp = new Map();

  return {
    maxSessions,
    maxPerIp,
    idleTimeoutMs,

    tryAcquire( ip ) {
      const key = ip || 'unknown';
      const count = perIp.get( key ) || 0;
      if ( active >= maxSessions || count >= maxPerIp ) {
        return false;
      }
      active += 1;
      perIp.set( key, count + 1 );
      return true;
    },

    release( ip ) {
      const key = ip || 'unknown';
      active = Math.max( 0, active - 1 );
      const count = perIp.get( key ) || 0;
      if ( count <= 1 ) {
        perIp.delete( key );
      } else {
        perIp.set( key, count - 1 );
      }
    },

    stats() {
      return { active, ips: perIp.size };
    },
  };
}
