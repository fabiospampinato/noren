
/* IMPORT */

import type Req from '~/server/req';
import type Res from '~/server/res';

/* HELPERS */

type JSONValue = string | number | boolean | null | JSONValue[] | { [K: string]: JSONValue };

type PromiseMaybe<T> = Promise<T> | T;

/* MAIN */

type ErrorHandler = {
  ( error: Error, req: Req, res: Res, next: () => Promise<void> ): PromiseMaybe<void>
};

type RequestHandler = {
  ( req: Req, res: Res, next: ( errorOrDone?: true |unknown ) => Promise<void> ): PromiseMaybe<void>
};

/* EXPORT */

export type {JSONValue, PromiseMaybe};
export type {ErrorHandler, RequestHandler};
