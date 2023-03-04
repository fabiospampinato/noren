
/* MAIN */

const castArrayBuffer = ( uint8: Uint8Array ): ArrayBuffer => {

  const {buffer, byteOffset, byteLength} = uint8;

  if ( !byteOffset && byteLength === buffer.byteLength ) { // Full-length

    return buffer;

  } else { // Partial

    return buffer.slice ( byteOffset, byteOffset + byteLength );

  }

};

const castError = ( exception: unknown ): Error => {

  if ( isError ( exception ) ) return exception;

  if ( isString ( exception ) ) return new Error ( exception );

  return new Error ( 'Unknown error' );

};

const isError = ( value: unknown ): value is Error => {

  return value instanceof Error;

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

/* EXPORT */

export {castArrayBuffer, castError, isError, isString};
