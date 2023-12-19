import { Request, RequestHandler, Response } from "express";
import { FsAction, FsObject } from "./constants";
import { HttpMethods } from "@/server/utils/constants";

export interface ErrorResponse {
    error: string;
    value?: string;
}
export interface ListDirResponse {
    path: string;
    directories: string[];
    files: string[];
}

// Handler
export interface FsHandlerPathParams {
    action: FsAction;
    object: FsObject;
}

export interface FsHandlerQueryParams {
    path: string;
    newPath?: string;
    m?: HttpMethods;
}

export interface FsHandlerError {
    error?: string;
    value?: string;
    fix?: string;
}

export interface FsHandlerResponse {
    path: string;
    newPath?: string;
}

export type FsRequestHandler<
    Res = FsHandlerResponse | FsHandlerError | Record<string, any> | string,
    QParams = FsHandlerQueryParams,
> = RequestHandler<FsHandlerPathParams, Res, any, QParams>;

export type FsActionHandler<
    Res = FsHandlerResponse | FsHandlerError | Record<string, any> | string,
    QParams = FsHandlerQueryParams,
> = (
    req: Request<FsHandlerPathParams, any, any, QParams>,
    res: Response<Res, any>
) => Promise<Response<Res, any> | void>;
