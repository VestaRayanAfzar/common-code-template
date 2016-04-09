export class Err implements Error {
    public code: number;
    public message: string;
    public name: string;
    public debug: any;

    public static Code = {
        DBConnection: 10,
        Database: 11,
        DBDuplicateEntry: 12,
        DBQuery: 13,
        DBInsert: 14,
        DBUpdate: 15,
        DBDelete: 16,
        DBInvalidDriver: 17,
        // acl
        Unauthorized: 401,
        Forbidden: 403,
        Token: 23,
        // logical
        WrongInput: 31,
        OperationFailed: 32,
        // form
        Validation: 41,
        //
        FileSystem: 51,
        Device: 52,
        //
        Implementation: 91,
        NoDataConnection: 92,
        Unknown: 99
    };


    constructor(code: number = Err.Code.Unknown, message: string = '') {
        if (!message) {
            message = Err.getErrorText(code);
        }
        this.code = code;
        this.message = message;
    }

    static getErrorText(code: number): string {
        var message = '';
        switch (code) {
            case Err.Code.DBConnection:
                message = 'Database connection error';
                break;
            case Err.Code.Database:
                message = 'Database operation error';
                break;
            case Err.Code.DBDuplicateEntry:
                message = 'Database insertion error, duplicate entry';
                break;
            case Err.Code.DBQuery:
                message = 'Database query error';
                break;
            case Err.Code.DBInsert:
                message = 'Database insertion error';
                break;
            case Err.Code.DBUpdate:
                message = 'Database update entry error';
                break;
            case Err.Code.DBDelete:
                message = 'Database delete entry error';
                break;
            // acl
            case Err.Code.Unauthorized:
                message = 'Unauthorized';
                break;
            case Err.Code.Forbidden:
                message = 'Forbidden';
                break;
            case Err.Code.Token:
                message = 'Invalid token';
                break;
            // logical
            case Err.Code.WrongInput:
                message = 'Wrong input';
                break;
            case Err.Code.OperationFailed:
                message = 'Operation failed';
                break;
            // form
            case Err.Code.Validation:
                message = 'Invalid data';
                break;
            //
            case Err.Code.Implementation:
                message = 'TODO: This method is not implemented';
                break;
            case Err.Code.NoDataConnection:
                message = 'No network connection';
                break;
            default:
                message = 'Unknown';
        }
        return message;
    }

}
