
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

const isArray = ( value: unknown ): value is any[] => {

  return Array.isArray ( value );

};

const isError = ( value: unknown ): value is Error => {

  return value instanceof Error;

};

const isFunction = ( value: unknown ): value is Function => {

  return typeof value === 'function';

};

const isPromise = ( value: unknown ): value is Promise<unknown> => {

  return value instanceof Promise;

};

const isStream = ( value: unknown ): value is ReadableStream => {

  return value instanceof ReadableStream;

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const memoize = <T, U> ( fn: (( arg: T ) => U) ): (( arg: T ) => U) => {

  const cache = new Map<T, U> ();

  return ( arg: T ): U => {

    const cached = cache.get ( arg );

    if ( cached ) return cached;

    const result = fn ( arg );

    cache.set ( arg, result );

    return result;

  };

};

const Once = () => { //TODO: Write this better, perhaps

  const once = <T> ( fn: (() => T) ): (() => T) => {

    const symbol = Symbol ();

    return function ( this: any ): T {

      return this[symbol] ||= fn.call ( this );

    };

  };

  return ( target: Object, key: string, descriptor: TypedPropertyDescriptor<any> ): any => {

    if ( isFunction ( descriptor.value ) ) {

      descriptor.value = once ( descriptor.value );

    } else if ( isFunction ( descriptor.get ) ) {

      descriptor.get = once ( descriptor.get );

    } else {

      throw new Error ( '@Once can only be called on methods and getters' );

    }

  };

};

/* EXPORT */

export {castArrayBuffer, castError, isArray, isError, isFunction, isPromise, isStream, isString, memoize, Once};
