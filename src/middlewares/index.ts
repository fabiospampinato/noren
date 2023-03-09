
/* MAIN */

import basicAuth from '~/middlewares/basic_auth';
import cors from '~/middlewares/cors';
import etag from '~/middlewares/etag';
import logger from '~/middlewares/logger';
import poweredBy from '~/middlewares/powered_by';
import serveStatic from '~/middlewares/serve_static';

/* EXPORT */

export {basicAuth, cors, etag, logger, poweredBy, serveStatic};
