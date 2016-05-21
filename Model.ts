import {Field} from "./Field";
import {Schema} from "./Schema";
import {Database, IQueryOption} from "./Database";
import {Vql, Condition} from "./Vql";
import {Validator, IValidationErrors} from "./Validator";
import {IDeleteResult, IUpsertResult, IQueryResult} from "./ICRUDResult";

export interface IModelFields {
    [fieldName:string]:Field
}

export interface IModelValues {
    [fieldName:string]:any;
}

export interface IModel {
    new ():Model;
    schema:Schema;
}

export abstract class Model {
    private static _database:Database;
    private _schema:Schema;

    constructor(schema:Schema) {
        this._schema = schema;
    }

    public static setDatabese(database:Database) {
        Model._database = database;
    }

    public validate(...fieldNames:Array<string>):IValidationErrors {
        var result = Validator.validate(this.getValues(...fieldNames), this._schema.validateSchema);
        if (!result) return result;
        if (fieldNames.length) {
            var subset:IValidationErrors = {}, hasError = false;
            for (let i = 0, il = fieldNames.length; i < il; ++i) {
                if (!result[fieldNames[i]]) continue;
                subset[fieldNames[i]] = result[fieldNames[i]];
                hasError = true;
            }
            return hasError ? subset : null;
        } else {
            return result;
        }
    }

    public setValues(values:IModelValues):void {
        if (!values) return;
        var fieldsNames = this._schema.getFieldsNames(),
            fieldName;
        for (var i = fieldsNames.length; i--;) {
            fieldName = fieldsNames[i];
            this[fieldName] = values[fieldName] !== undefined ? values[fieldName] : this[fieldName];
        }
    }

    public getValues<T>(...fields:Array<string>):T {
        var values:T = <T>{},
            fieldsNames = fields.length ? fields : this._schema.getFieldsNames(),
            fieldName;
        for (var i = fieldsNames.length; i--;) {
            fieldName = fieldsNames[i];
            if (this[fieldName] && this[fieldName].getValues) {
                values[fieldName] = this[fieldName].getValues();
            } else {
                values[fieldName] = this[fieldName];
            }
        }
        return values;
    }

    public toJSON<T>():T {
        return this.getValues<T>();
    }

    public insert<T>(values?:T):Promise<IUpsertResult<T>> {
        if (values) {
            this.setValues(values);
        }
        // removing id for insertion
        // todo: set previous id on failure?
        delete this['id'];
        return Model._database.insertOne(this._schema.name, this.getValues());
    }

    public update<T>(values?:T):Promise<IUpsertResult<T>> {
        if (values) {
            this.setValues(values);
        }
        return Model._database.updateOne(this._schema.name, this.getValues());
    }

    public delete():Promise<IDeleteResult> {
        return Model._database.deleteOne(this._schema.name, this['id']);
    }

    public static getDatabase():Database {
        return Model._database;
    }

    public static findById<T>(id:number|string, option?:IQueryOption):Promise<IQueryResult<T>> {
        return Model._database.findById<T>(this['constructor']['schema'].name, id, option);
    }

    public static findByModelValues<T>(modelValues:T, limit:number):Promise<IQueryResult<T>> {
        return Model._database.findByModelValues<T>(this['constructor']['schema'].name, modelValues, limit);
    }

    public static findByQuery<T>(query:Vql):Promise<IQueryResult<T>> {
        return Model._database.findByQuery<T>(query);
    }

    public static updateAll<T>(newValues:T, condition:Condition):Promise<IUpsertResult<T>> {
        return Model._database.updateAll<T>(this['constructor']['schema'].name, newValues, condition);
    }

    public static deleteAll(condition:Condition):Promise<IDeleteResult> {
        return Model._database.deleteAll(this['constructor']['schema'].name, condition);
    }
}