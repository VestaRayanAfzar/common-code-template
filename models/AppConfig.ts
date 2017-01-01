import {Model} from "vesta-schema/Model";
import {Schema} from "vesta-schema/Schema";
import {FieldType} from "vesta-schema/Field";
import {Database} from "vesta-schema/Database";
import {LogLevel} from "../enum/Log";

export interface IAppConfig {
    id?: number|string;
    logLevel?: LogLevel;
}

export class AppConfig extends Model implements IAppConfig {
    public static schema: Schema = new Schema('AppConfig');
    public static database: Database;
    public id: number|string;
    public logLevel: LogLevel;

    constructor(values?: any) {
        super(AppConfig.schema, AppConfig.database);
        this.setValues(values);
    }
}

AppConfig.schema.addField('id').type(FieldType.Integer).primary();
AppConfig.schema.addField('logLevel').type(FieldType.Enum).required().enum(LogLevel.Error, LogLevel.Warn, LogLevel.Info, LogLevel.Debug, LogLevel.Verbose, LogLevel.None).default(LogLevel.Warn);
AppConfig.schema.freeze();