
/* IMPORT */

import type Req from '~/server/req';
import type Res from '~/server/res';

/* HELPERS */

type Head<T extends unknown[]> = T extends [...infer Head, unknown] ? Head : never[];

type PromiseMaybe<T> = Promise<T> | T;

/* MAIN */

type ErrorHandler = {
  ( error: Error, req: Req, res: Res, next: () => Promise<void> ): PromiseMaybe<void>
};

type RequestHandler = {
  ( req: Req, res: Res, next: ( error?: unknown ) => Promise<void> ): PromiseMaybe<void>
};

/* EXPORT */

export type {Head, PromiseMaybe};
export type {ErrorHandler, RequestHandler};
