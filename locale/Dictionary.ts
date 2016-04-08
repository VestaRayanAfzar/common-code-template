import {Dictionary as enUSDictionary} from './en-US/Dictionary';
import {Dictionary as faIRDictionary} from './fa-IR/Dictionary';

export class Dictionary {
    private collection:any = {};

    constructor(locale:string) {
        switch (locale) {
            case 'en-US':
                this.collection = enUSDictionary;
                break;
            default:
                this.collection = faIRDictionary;
        }
    }

    public get(key:string) {
        return this.collection[key];
    }
}