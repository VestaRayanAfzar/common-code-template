import {Err} from "./Err";

export interface IQueryResult<T> {
    total: number;
    limit: number;
    pageNumber: number;
    items: Array<T>;
    error: Err;
}

export interface IUpsertResult<T> {
    items: Array<T>;
    error: Err;
}

export interface IDeleteResult {
    items: Array<number|string>;
    error: Err;
}

export interface IQueryRequest<T> {
    query?: T;
    limit?: number;
    pageNumber?: number;
}