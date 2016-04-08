import {ILocale} from "../I18N";

export abstract class DateTime extends Date {
    public locale:ILocale;
    protected gregorianDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    protected persianDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    protected char2param = {
        Y: 'FullYear',
        y: 'Year',
        n: 'Month',
        m: 'Month',
        M: 'Month',
        d: 'Date',
        j: 'Date',
        D: 'Day',
        l: 'Day',
        h: 'Hours',
        H: 'Hours',
        i: 'Minutes',
        s: 'Seconds'
    };
    protected sameValues = ['h', 'H', 'i', 's'];
    protected leadingZeros = ['d', 'm', 'H', 'h', 'i', 's'];

    protected addZero(param) {
        return (param < 10 ? '0' : '') + param
    }

    protected _getEqParam(char) {
        var param = char;
        if (this.char2param[char]) {
            var getter = `get${this.char2param[char]}`;
            param = this[getter]();
            switch (char) {
                case 'D':
                    param = this.locale.weekDaysShort[param];
                    break;
                case 'l':
                    param = this.locale.weekDays[param];
                    break;
                case 'M':
                    param = this.locale.monthNamesShort[param];
                    break;
                case 'h':
                    param = param % 12;
                    break;
                case 'm':
                    param++;

            }
            if (this.leadingZeros.indexOf(char) >= 0) {
                param = this.addZero(param);
            }
        }
        return param;
    };

    protected validateTime(hour:number, minute:number = 0, second:number = 0):number {
        var milliseconds = 0;
        if (0 < hour && hour < 25) milliseconds += hour * 60 * 60;
        if (0 < minute && minute < 60) milliseconds += minute * 60;
        if (0 < second && second < 60) milliseconds += second;
        return milliseconds * 1000;
    }

    public validate(date:string, hasTime:boolean = false):number {
        var result = 0;
        if (!date) return result;
        var [dateStr, timeStr] = date.split(this.locale.dateTimeSep);
        if (!dateStr) return result;
        var dateParts = dateStr.split(this.locale.dateSep);
        if (!dateParts || dateParts.length != 3) return result;
        result = this.validateLocale(+dateParts[0], +dateParts[1], +dateParts[2]);
        if (hasTime && timeStr) {
            var timeParts = timeStr.split(this.locale.timeSep);
            if (timeParts.length >= 2) {
                result += this.validateTime(+timeParts[0], +timeParts[1], +timeParts[2]);
            }
        }
        return result;
    }

    public format(format:string) {
        var parsed = '';
        for (var i = 0, il = format.length; i < il; ++i) {
            parsed += this._getEqParam(format[i]);
        }
        return parsed;
    }

    protected abstract validateLocale(year:number, month:number, day:number):number;
}