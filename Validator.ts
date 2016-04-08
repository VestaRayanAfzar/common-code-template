import {FieldType} from './Field';
import {IModelValues} from "./Model";
import {IDBModelSet} from "./Schema";
import {Platform} from "./Platform";
import {FileMemeType} from "./FileMemeType";

/**
 * This callback type is called `assertCallback`
 * @callback assertCallback
 * @param {*} value - The value of the field
 * @param {{}} values - All other values of fields
 * @return {boolean}
 */
export interface IAssertCallback {
    (value: any, allValues: IModelValues):boolean;
}

export interface IValidationModel {
    [ruleName:string]:any
}

export interface IValidationModelSet {
    [fieldName:string]: IValidationModel
}

export interface IValidationError {
    rule: string;
}

export interface IValidationErrors {
    [fieldName:string]: IValidationError;
}

export class Validator {
    public static regex = {
        'email': /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i,
        'phone': /[0-9 \-]{8,15}/,
        'url': /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    };

    public static ruleValidator = {
        required: function (value, isRequired) {
            if (isRequired) {
                return [null, undefined, '', NaN].indexOf(value) == -1;
            }
            return true;
        },
        minLength: function (value, minLength) {
            return typeof value === 'string' && value.length >= minLength;
        },
        maxLength: function (value, maxLength) {
            return typeof value === 'string' && value.length <= maxLength;
        },
        pattern: function (value, regex) {
            return regex.exec(value);
        },
        min: function (value, min) {
            return value && value >= min;
        },
        max: function (value, max) {
            return value && value <= max;
        },
        assert: function (value: any, cb: IAssertCallback, allValues: Array<any>) {
            return cb(value, allValues);
        },
        maxSize: function (file: File, size: number): boolean {
            return file.size && file.size <= size * 1024;
        },
        fileType: function (file: File, acceptedTypes: Array<string>): boolean {
            if (Platform.isClient()) {
            if (!(file instanceof File)) {
                return false;
            }
            }
            var part = file.name.split('.');
            var extension = part[part.length - 1];
            if (file.type == 'application/octet-stream' || !file.type || !FileMemeType.isValid(file.type)) {
                var meme = FileMemeType.getMeme(extension);
                for (var i = meme.length; i--;) {
                    if (acceptedTypes.indexOf(meme[i]) >= 0) {
                        return true;
                    }
                }
            } else {
            return acceptedTypes.indexOf(file.type) >= 0;
            }

            return false;
        },
        // field types; second arg is undefined
        enum: function (value: any, values: Array<number>) {
            return values.indexOf(value) >= 0;
        },
        email: function (email) {
            return Validator.regex.email.exec(email)
        },
        integer: function (number) {
            return !isNaN(parseInt(number));
        },
        number: function (number) {
            return !isNaN(+number);
        },
        float: function (number) {
            return !isNaN(parseFloat(number));
        },
        tel: function (phoneNumber) {
            return Validator.regex.phone.exec(phoneNumber);
        },
        boolean: function (bool) {
            return (bool === true || bool === false);
        },
        timestamp: function (timestamp: number) {
            return timestamp > 0;
        },
        relation: function (value) {
            return true;
        },
        url: function (url) {
            return Validator.regex.url.exec(url);
        },
        // mocks; prevents error
        default: function (value, defaultValue) {
            return true;
        },
        unique: function (value, isUnique) {
            return true;
        },
        primary: function (value, isPrimary) {
            return true;
        },
        string: function (value) {
            return true;
        },
        password: function (value) {
            return true;
        },
        file: function (value) {
            return true;
        },
        object: function (value) {
            return true;
        }
    };

    /**
     *
     * @param {IModelValues} values {fieldName: fieldValue}
     * @param {IValidationModelSet} validationPatterns {fieldName: {ruleName: }}
     * @returns {IValidationErrors}
     */
    public static validate(values: IModelValues, validationPatterns: IValidationModelSet): IValidationErrors {
        var errors: IValidationErrors = null,
            valid = true;
        for (var fieldName in validationPatterns) {
            if (validationPatterns.hasOwnProperty(fieldName)) {
                var isRequired = <boolean>validationPatterns[fieldName].hasOwnProperty('required');
                var hasValue = values.hasOwnProperty(fieldName);
                if (isRequired || hasValue) {
                    var result = Validator.validateField(values[fieldName], validationPatterns[fieldName], values, isRequired);
                    if (result) {
                        if (!errors) errors = {};
                        errors[fieldName] = {rule: result};
                        valid = false;
                    }
                }
            }
        }
        return errors;
    }

    /**
     * Returns the name of the rule that has failed
     */
    public static validateField(value: any, validationRules, model, isRequired: boolean): string {
        var result;
        if (isRequired) {
            result = Validator.ruleValidator.required(value, true);
            if (!result) {
                return 'required';
            }
        }
        for (var rule in validationRules) {
            if (validationRules.hasOwnProperty(rule)) {
                if (rule == 'type') {
                    rule = validationRules[rule];
                }
                if (rule != 'required') {
                    result = <boolean>Validator.ruleValidator[rule](value, validationRules[rule], model);
                    if (!result) {
                        return rule;
                    }
                }
            }
        }
        return '';
    }
}
