
/* HELPERS */

const SEPARATOR_RE = /\s*,\s*/g;

/* MAIN */

const Address = {

  /* API */

  get: ( header: string ): string[] => {

    if ( !header ) return [];

    return header.split ( SEPARATOR_RE );

  }

};

/* EXPORT */

export default Address;
