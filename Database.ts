import {Err} from "./Err";
import {Vql, Condition} from "./Vql";
import {Schema} from "./Schema";
import {IDeleteResult, IUpsertResult, IQueryResult} from "./ICRUDResult";

/**
 * protocol     database protocol (Database.MySQL | Database.Redis | ...)
 * host         database server IP address or hostName
 * port         port number on database server
 * user         username for connecting to database server
 * password     password for connecting to database server
 * database     name of the database or collection
 */
export interface IDatabaseConfig {
    protocol:string;
    host:string;
    port:number;
    user:string;
    password:string;
    database:string;
}

/**
 * field        name of field
 * ascending    sort ascending if true, otherwise sort descending
 */
export interface IOrderBy {
    field:string;
    ascending:boolean;
}

/**
 * limit        number of records that should be fetched
 * offset       offset of starting record index (LIMIT fetchFrom, fetchLimit)
 * page         offset = (page - 1) * limit
 * fields       fieldNames that are suppose to be fetched
 * sort         sort results by fieldName and type of sorting (ORDER BY fieldName ASC | DESC)
 * relations    fieldNames (of type Relationship) that their related models should be fetched
 */
export interface IQueryOption {
    limit?:number;
    offset?:number;
    page?:number;
    fields?:Array<string>;
    orderBy?:Array<IOrderBy>;
    relations?:Array<{name:string, fields:Array<string>}|string>;
}

/**
 * Abstract Database class for drivers
 */
export abstract class Database {
    public static MySQL = 'mysql';
    public static Mongodb = 'mongo';
    public static Redis = 'redis';

    public static getInstance(config:IDatabaseConfig):Promise<Database> {
        return Promise.reject(new Err(Err.Code.Implementation));
    }

    public abstract findById<T>(model:string, id:number|string, option?:IQueryOption):Promise<IQueryResult<T>>;

    public abstract findByModelValues<T>(model:string, modelValues:T, option?:IQueryOption):Promise<IQueryResult<T>>;

    public abstract findByQuery<T>(query:Vql):Promise<IQueryResult<T>>;

    public abstract insertOne<T>(model:string, value:T):Promise<IUpsertResult<T>>;

    public abstract updateOne<T>(model:string, value:T):Promise<IUpsertResult<T>>;

    public abstract updateAll<T>(model:string, newValues:T, condition:Condition):Promise<IUpsertResult<T>>;

    public abstract deleteOne(model:string, id:number|string):Promise<IDeleteResult>;

    public abstract deleteAll(model:string, condition:Condition):Promise<IDeleteResult>;

    public abstract init(schemaList:Array<Schema>);
}