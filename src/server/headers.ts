
/* MAIN */

// This leads to significantly faster execution than the built-in Headers class

class Headers {

  /* VARIABLES */

  headers: Record<string, string> = {};

  /* CONSTRUCTOR */

  constructor ( entries?: readonly (readonly [string, string])[] ) {

    if ( entries ) {

      for ( let i = 0, l = entries.length; i < l; i++ ) {

        const [key, value] = entries[i];

        this.set ( key, value );

      }

    }

  }

  /* API */

  append ( key: string, value: string ): void {

    key = key.toLowerCase ();

    const prev = this.headers[key];
    const next = prev ? `${prev}, ${value}` : value;

    this.headers[key] = next;

  }

  delete ( key: string ): void {

    delete this.headers[key.toLowerCase ()];

  }

  get ( key: string ): string | null {

    return this.headers[key.toLowerCase ()] || null;

  }

  has ( key: string ): boolean {

    return ( key.toLowerCase () in this.headers );

  }

  set ( key: string, value: string ): void {

    this.headers[key.toLowerCase ()] = value;

  }

  keys (): string[] {

    return Object.keys ( this.headers );

  }

  values (): string[] {

    return Object.values ( this.headers );

  }

  entries (): [string, string][] {

    return Object.entries ( this.headers );

  }

  forEach ( callback: ( value: string, key: string, parent: this ) => void ): void {

    for ( const key in this.headers ) {

      callback ( this.headers[key], key, this );

    }

  }

}

/* EXPORT */

export default Headers;
