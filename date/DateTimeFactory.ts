import {ILocale} from "../I18N";
import {PersianDate} from "./PersianDate";
import {GregorianDate} from "./GregorianDate";
import {DateTime} from "./DateTime";
import {I18N} from "../I18N";

export class DateTimeFactory {

    static create(localeCode: string): DateTime {
        var date: DateTime;
        switch (localeCode) {
            case 'fa-IR':
                date = new PersianDate();
                break;
            default:
                date = new GregorianDate();
        }
        date.locale = I18N.getLocale(localeCode);
        return date;
    }
}