import {IAssertCallback} from "./Validator";
import {Model} from "./Model";

export interface IRelationship {
    type:number;
    model:Model;
    isWeek:boolean;
}

/**
 *
 * Handles the relationship between models. The driver decides how to implement the physical database
 *
 * type     One to One, One to Many, Many to May
 * type     The related model
 * isWeek   For noSQL databases, if the related model is a new collection, treat it as a nested document
 */
export class Relationship implements IRelationship {
    public static Type = {
        One2One: 1,
        One2Many: 2,
        Many2Many: 3
    };
    public type:number;
    public model:Model;
    public isWeek:boolean = false;

    constructor(relationType:number) {
        this.type = relationType;
    }

    public relatedModel(model:Model):Relationship {
        this.model = model;
        return this;
    }
}

export class FieldType {
    static String = 'string';
    static Text = 'text';
    static Password = 'password';
    static Tel = 'tel';
    static EMail = 'email';
    static URL = 'url';
    static Number = 'number';
    static Integer = 'integer';
    static Float = 'float';
    static File = 'file';
    static Timestamp = 'timestamp';
    static Boolean = 'boolean';
    static Object = 'object';
    static Enum = 'enum';
    static Relation = 'relation';
}

export interface IFieldProperties {
    type:string;
    required?:boolean;
    pattern?:RegExp;
    minLength?:number;
    maxLength?:number;
    min?:number;
    max?:number;
    assert?:IAssertCallback;
    enum?:Array<any>;
    default?:any;
    unique?:boolean;
    primary?:boolean;
    maxSize?:number;
    fileType?:Array<string>;
    relation?:Relationship;
    multilingual?:boolean;
}

export class Field {
    private _fieldName:string;
    private _properties:IFieldProperties = <IFieldProperties>{};

    constructor(fieldName:string) {
        this._fieldName = fieldName;
        this._properties.enum = [];
        this._properties.fileType = [];
    }

    get fieldName():string {
        return this._fieldName;
    }

    get properties():IFieldProperties {
        return this._properties;
    }

    public required():Field {
        this._properties.required = true;
        return this;
    }

    public type(type:string):Field {
        this._properties.type = type;
        return this;
    }

    public pattern(pattern:RegExp):Field {
        this._properties.pattern = pattern;
        return this;
    }

    public minLength(minLength:number):Field {
        this._properties.minLength = +minLength;
        return this;
    }

    public maxLength(maxLength:number):Field {
        this._properties.maxLength = +maxLength;
        return this;
    }

    public min(min:number):Field {
        this._properties.min = +min;
        return this;
    }

    public max(max:number):Field {
        this._properties.max = +max;
        return this;
    }

    public assert(cb:IAssertCallback):Field {
        this._properties.assert = cb;
        return this;
    }

    public enum(...values:any[]):Field {
        this._properties.enum = values;
        return this;
    }

    public default(value:any):Field {
        this._properties.default = value;
        return this;
    }

    public unique(isUnique:boolean = true):Field {
        this._properties.unique = isUnique;
        return this;
    }

    public primary(isPrimary:boolean = true):Field {
        this._properties.primary = isPrimary;
        this._properties.type = FieldType.String;
        return this;
    }

    public maxSize(sizeInKB:number):Field {
        this._properties.maxSize = sizeInKB;
        return this;
    }

    public fileType(...fileTypes:string[]):Field {
        this._properties.fileType = fileTypes;
        return this;
    }

    public multilingual():Field {
        this._properties.multilingual = true;
        return this;
    }

    private setRelation(type:number, model:Model):Field {
        this._properties.relation = new Relationship(type);
        this._properties.relation.relatedModel(model);
        return this;
    }

    /**
     *  for one to one relationship
     */
    public isPartOf(model:Model):Field {
        return this.setRelation(Relationship.Type.One2One, model);
    }

    /**
     *  for one to many relationship
     */
    public isOneOf(model:Model):Field {
        return this.setRelation(Relationship.Type.One2Many, model);
    }

    /**
     *  for many to many relationship
     */
    public areManyOf(model:Model):Field {
        return this.setRelation(Relationship.Type.Many2Many, model);
    }
}

