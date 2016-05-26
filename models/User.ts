import {Schema} from "vesta-schema/Schema";
import {FieldType} from "vesta-schema/Field";
import {Model, IModelValues} from "vesta-schema/Model";

export enum UserGender {Male = 1, Female}

var schema = new Schema('User');
schema.addField('id').type(FieldType.String).primary();
schema.addField('firstName').type(FieldType.String).minLength(2).required();
schema.addField('lastName').type(FieldType.String).minLength(2).required();
schema.addField('email').type(FieldType.EMail).unique().required();
schema.addField('password').type(FieldType.Password).required().minLength(4);
schema.addField('birthDate').type(FieldType.Timestamp).required();
schema.addField('gender').type(FieldType.Enum).enum(UserGender.Male, UserGender.Female).default(UserGender.Male);
schema.addField('image').type(FieldType.File).maxSize(6144).fileType('image/png', 'image/jpeg', 'image/pjpeg');

export interface IUser {
    id:number,
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    birthDate:number;
    gender:number;
    image:File|string;
}

export class User extends Model implements IUser {
    public static schema:Schema = schema;
    public id:number;
    public firstName:string;
    public lastName:string;
    public email:string;
    public password:string;
    public birthDate:number;
    public gender:UserGender;
    public image:File|string;

    constructor(values?:IModelValues) {
        super(schema);
        this.setValues(values);
    }

}
