export interface ILoggerMinor {
    type: number;
    data: any;
}

export interface ILogger {
    id: string;
    level: number;
    start: number;
    duration: number;
    data: Array<ILoggerMinor>;
}