import {DateTime} from "./DateTime";

export class GregorianDate extends DateTime {

    private gregorianDate:Date;

    constructor() {
        super();
        this.gregorianDate = new Date();
    }

    public setFullYear(year:number, month?:number, date?:number) {
        return this.gregorianDate.setFullYear(year, month, date);
    }

    public setMonth(month:number, date?:number) {
        return this.gregorianDate.setMonth(month, date);
    }

    public setDate(date:number) {
        return this.gregorianDate.setDate(date);
    }

    public getFullYear() {
        return this.gregorianDate.getFullYear();
    }

    public getMonth() {
        return this.gregorianDate.getMonth();
    }

    public getDate() {
        return this.gregorianDate.getDate();
    }

    public getDay() {
        return this.gregorianDate.getDay();
    }

    public getHours():number {
        return this.gregorianDate.getHours();
    }

    public getMinutes():number {
        return this.gregorianDate.getMinutes();
    }

    public getSeconds():number {
        return this.gregorianDate.getSeconds();
    }

    public setUTCFullYear(year:number, month?:number, date?:number) {
        return this.gregorianDate.setUTCFullYear(year, month, date);
    }

    public setUTCMonth(month:number, date?:number) {
        return this.gregorianDate.setUTCMonth(month, date);
    }

    public setUTCDate(date:number) {
        return this.gregorianDate.setUTCDate(date);
    }

    public getUTCFullYear() {
        return this.gregorianDate.getUTCFullYear();
    }

    public getUTCMonth() {
        return this.gregorianDate.getUTCMonth();
    }

    public getUTCDate() {
        return this.gregorianDate.getUTCDate();
    }

    public getUTCDay() {
        return this.gregorianDate.getUTCDay();
    }

    public getTime():number {
        return this.gregorianDate.getTime();
    }

    public setTime(time:number):number {
        return this.gregorianDate.setTime(time);
    }

    public valueOf():number {
        return this.gregorianDate.getTime();
    }

    protected validateLocale(year:number, month:number, day:number):number {
        var date = new Date(year, month, day),
            timestamp = date.getTime();
        if (isNaN(timestamp)) return 0;
        return timestamp;
    }
}