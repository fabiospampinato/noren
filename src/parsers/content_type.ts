
/* IMPORT */

import ext2mime from 'ext2mime';
import {memoize} from '~/server/utils';

/* MAIN */

const ContentType = {

  /* API */

  get: memoize (( type: string ): string => {

    const mime = type.includes ( '/' ) ? type : ext2mime ( type );
    const charset = ( mime.startsWith ( 'text' ) || mime === 'application/json' ) ? '; charset=UTF8' : '';
    const contentType = `${mime}${charset}`;

    return contentType;

  })

};

/* EXPORT */

export default ContentType;
