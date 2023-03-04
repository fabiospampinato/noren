
/* MAIN */

import basicAuth from '~/middlewares/basic_auth';
import bearerAuth from '~/middlewares/bearer_auth';
import cache from '~/middlewares/cache';
import cors from '~/middlewares/cors';
import etag from '~/middlewares/etag';
import logger from '~/middlewares/logger';
import poweredBy from '~/middlewares/powered_by';

/* EXPORT */

export {basicAuth, bearerAuth, cache, cors, etag, logger, poweredBy};
