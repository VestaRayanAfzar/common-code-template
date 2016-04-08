import {Validator, IValidationModelSet, IValidationModel} from './Validator';
import {Field, FieldType} from './Field';
import {Model, IModelFields} from './Model';
import {IFieldProperties} from "./Field";

export interface IDBModelSet {
    [fieldName:string]: IValidationModel
}

export class Schema {
    //private modelName:string;
    private _validateSchema;
    private _dbSchema;
    private fields: IModelFields = {};
    private fieldsName: Array<string> = [];

    constructor(private modelName: string) {
    }

    getFields(): IModelFields {
        return this.fields;
    }

    getFieldsNames(): Array<string> {
        return this.fieldsName;
    }

    get name(): string {
        return this.modelName;
    }

    get validateSchema() {
        if (!this._validateSchema) {
            this._validateSchema = getValidatorSchema(this.fields);
        }
        return this._validateSchema;
    }

    get dbSchema() {
        if (!this._dbSchema) {
            this._dbSchema = getDbSchema(this.fields);
        }
        return this._dbSchema;
    }

    addField(fieldName: string): Field {
        this.fields = this.fields || {};
        this.fields[fieldName] = new Field(fieldName);
        this.fieldsName.push(fieldName);
        return this.fields[fieldName];
    }
}

/**
 *
 * @param {IModelFields} fields  {fieldName: Field}
 * @returns {IValidationModelSet}
 */
function getValidatorSchema(fields: IModelFields): IValidationModelSet {
    var getFieldSchema = function (properties: IFieldProperties): IValidationModel {
        var fieldSchema = {};
        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                if (['fileType', 'enum'].indexOf(property) >= 0) {
                    if (properties[property].length) {
                        fieldSchema[property] = properties[property];
                    }
                    continue;
                }
                fieldSchema[property] = properties[property];
            }
        }
        return fieldSchema;
    };

    var schema: IValidationModelSet = {};
    for (var field in fields) {
        if (fields.hasOwnProperty(field)) {
            schema[field] = getFieldSchema(fields[field].properties);
        }
    }
    return schema;
}

/**
 *  db field types
 *  text, number, integer, boolean, date, enum, object, point, binary, serial
 *  db field type properties
 *  all -> defaultValue: string, unique:bool, required:bool
 *  text -> size:int, big:bool
 *  date -> time:bool,
 *  number -> size:int, unsigned:bool
 *  enum -> values:array
 */
function getDbSchema(fields: IModelFields): IDBModelSet {
    var getFieldSchema = function (properties: IFieldProperties) {
        var fieldSchema: any = {};
        if (properties.unique) {
            fieldSchema.unique = true;
        }
        //if (properties.required) {
        fieldSchema.required = false;
        //}
        if (properties.default) {
            fieldSchema.defaultValue = properties.default;
        }
        if (properties.maxLength) {
            fieldSchema.size = properties.default;
        }
        //
        switch (properties.type) {
            case FieldType.String:
            case FieldType.Password:
            case FieldType.Tel:
            case FieldType.EMail:
            case FieldType.URL:
            case FieldType.File:
            case FieldType.Text:
                fieldSchema.type = 'text';
                break;
            case FieldType.Integer:
                fieldSchema.type = 'integer';
                break;
            case FieldType.Number:
            case FieldType.Float:
                fieldSchema.type = 'number';
                break;
            //case FieldType.Date:
            //case FieldType.DateTime:
            case FieldType.Timestamp:
                fieldSchema.type = 'integer';
                break;
            case FieldType.Boolean:
                fieldSchema.type = 'boolean';
                break;
            case FieldType.Object:
                fieldSchema.type = 'object';
                break;
            case FieldType.Enum:
                fieldSchema.type = 'integer';
                fieldSchema.defaultValue = properties.default || properties.enum[0];
                break;
        }
        //
        if (properties.primary) {
            fieldSchema.type = 'serial';
            fieldSchema.key = true;
        }

        return fieldSchema;
    };

    var schema: IDBModelSet = {};
    for (var field in fields) {
        if (fields.hasOwnProperty(field)) {
            schema[field] = getFieldSchema(fields[field].properties);
        }
    }
    return schema;
}
