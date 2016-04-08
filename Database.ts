import {Err} from "./Err";
import {Vql, Condition} from "./Vql";
import {Schema} from "./Schema";
import {IModelValues} from "./Model";
import {IDeleteResult, IUpsertResult, IQueryResult} from "./ICRUDResult";

export interface IDatabaseConfig {
    protocol:string;
    host:string;
    port:number;
    user:string;
    password:string;
    database:string;
}

export interface IOrderBy {
    field:string;
    ascending:boolean;
}

export interface IQueryOption {
    fetchLimit?:number;
    fetchFrom?:number;
    fields?:Array<string>;
    sort?:Array<IOrderBy>;
    relations?:Array<string>;
}

export abstract class Database {
    public static MySQL = 'mysql';
    public static Mongodb = 'mongo';
    public static Redis = 'redis';

    public static getInstance(config:IDatabaseConfig):Promise<Database> {
        return Promise.reject(new Err(Err.Code.Implementation));
    }

    public abstract findById<T>(model:string, id:number|string, option?:IQueryOption):Promise<IQueryResult<T>>;

    public abstract findByModelValues<T>(model:string, modelValues:IModelValues, option?:IQueryOption):Promise<IQueryResult<T>>;

    public abstract findByQuery<T>(query:Vql):Promise<IQueryResult<T>>;

    public abstract insertOne<T>(model:string, value:T):Promise<IUpsertResult<T>>;

    public abstract updateOne<T>(model:string, value:T):Promise<IUpsertResult<T>>;

    public abstract updateAll<T>(model:string, newValues:IModelValues, condition:Condition):Promise<IUpsertResult<T>>;

    public abstract deleteOne(model:string, id:number|string):Promise<IDeleteResult>;

    public abstract deleteAll(model:string, condition:Condition):Promise<IDeleteResult>;

    public abstract init(schema:Schema);
}