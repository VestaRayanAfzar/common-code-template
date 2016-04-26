import {IModelValues} from "./Model";
import {IQueryOption, IOrderBy} from "./Database";

interface IComparison {
    field:string;
    value:any
    isValueOfTypeField:boolean;
}

export interface ITraverseCallback {
    (condition:Condition):void;
}

/**
 * It has two main category
 *  - comparison (`isConnector` = false): it compares a field with a value
 *      The comparison operator is a above  10
 *      Attention: The value for comparison might be another field e.g. model.fieldA > model.fieldC
 *  - conjunction (`isConnector` = false):: it connects two or more comparison by logical operators (AND, OR)
 *      The conjunction operator is a number below 10
 *
 * The data structure is a tree and each internal node is of type `Condition.Operator`. The values a
 */
export class Condition {
    public static Operator = {
        Or: 1,
        And: 2,
        EqualTo: 11,
        NotEqualTo: 12,
        GreaterThan: 13,
        GreaterThanOrEqualTo: 14,
        LessThan: 15,
        LessThanOrEqualTo: 16,
        Like: 17,
        NotLike: 18
    };
    public comparison:IComparison;
    public children:Array<Condition> = [];
    public isConnector:boolean = false;
    public operator:number;

    constructor(operator:number) {
        this.operator = operator;
        this.isConnector = operator < 10;
    }

    /**
     *
     * If the operator is of type comparison
     */
    public compare(field:string, value:any, isValueOfTypeField:boolean = false):Condition {
        if (this.isConnector) return this;
        this.comparison = {field: field, value: value, isValueOfTypeField: isValueOfTypeField};
        return this;
    }

    public append(child:Condition):Condition {
        if (!this.isConnector) return this;
        this.children.push(child);
        return this;
    }

    public traverse(cb:ITraverseCallback) {
        cb(this);
        for (var i = 0, il = this.children.length; i < il; ++i) {
            var child = this.children[i];
            child.isConnector ? child.traverse(cb) : cb(child);
        }
    }

    private negateChildren() {
        for (var i = 0, il = this.children.length; i < il; ++i) {
            this.children[i].negate();
        }
    }

    public negate() {
        switch (this.operator) {
            // Connectors
            case Condition.Operator.And:
                this.operator = Condition.Operator.Or;
                this.negateChildren();
                break;
            case Condition.Operator.Or:
                this.operator = Condition.Operator.And;
                this.negateChildren();
                break;
            // Comparison
            case Condition.Operator.EqualTo:
                this.operator = Condition.Operator.NotEqualTo;
                break;
            case Condition.Operator.NotEqualTo:
                this.operator = Condition.Operator.EqualTo;
                break;
            case Condition.Operator.GreaterThan:
                this.operator = Condition.Operator.LessThanOrEqualTo;
                break;
            case Condition.Operator.GreaterThanOrEqualTo:
                this.operator = Condition.Operator.LessThan;
                break;
            case Condition.Operator.LessThan:
                this.operator = Condition.Operator.GreaterThanOrEqualTo;
                break;
            case Condition.Operator.LessThanOrEqualTo:
                this.operator = Condition.Operator.GreaterThan;
                break;
            case Condition.Operator.Like:
                this.operator = Condition.Operator.NotLike;
                break;
            case Condition.Operator.NotLike:
                this.operator = Condition.Operator.Like;
                break;
        }
    }
}

/**
 * Vesta Query Language
 *
 */
export class Vql implements IQueryOption {
    // IQueryOption
    public limit:number = 0;
    public offset:number = 0;
    public page:number = 1;
    public fields:Array<string> = [];
    public orderBy:Array<IOrderBy> = [];
    public relations:Array<string> = [];
    // Vql
    public model:string;
    public condition:Condition;

    constructor(model:string) {
        this.model = model;
    }

    public filter(filter:IModelValues):Vql {
        var condition = new Condition(Condition.Operator.And);
        for (var field in filter) {
            if (filter.hasOwnProperty(field)) {
                var cmp = new Condition(Condition.Operator.EqualTo);
                cmp.compare(field, filter[field]);
                condition.append(cmp);
            }
        }
        return this;
    }

    public select(...fields:Array<string>):Vql {
        this.fields = fields;
        return this;
    }

    public limitTo(limit:number = 1):Vql {
        this.limit = limit;
        return this;
    }

    public fromOffset(offset:number):Vql {
        this.offset = offset;
        return this;
    }

    public fromPage(page:number):Vql {
        this.page = page;
        return this;
    }

    public sortBy(field:string, ascending:boolean = true):Vql {
        for (var i = this.orderBy.length; i--;) {
            if (this.orderBy[i].field == field) {
                this.orderBy[i] = {field: field, ascending: ascending};
                return this;
            }
        }
        this.orderBy.push({field: field, ascending: ascending});
        return this;
    }

    public fetchRecordFor(field:string):Vql {
        if (this.relations.indexOf(field) < 0) {
            this.relations.push(field);
        }
        return this;
    }

    public where(condition:Condition):Vql {
        this.condition = condition;
        return this;
    }
}