
/* HELPERS */

const SEPARATOR_RE = /\s*,\s*/g;

/* MAIN */

//TODO: Filter out known ips, like localhost hostnames, to better align with Express (maybe)

const Address = {

  /* API */

  get: ( header: string ): string[] => {

    if ( !header ) return [];

    return header.split ( SEPARATOR_RE );

  }

};

/* EXPORT */

export default Address;
