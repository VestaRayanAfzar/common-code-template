export class Set<T> {
    private collection:Array<T> = [];

    constructor() {
    }

    public append(...items:Array<T>) {
        for (var i = items.length; i--;) {
            if (this.collection.indexOf(items[i]) < 0) {
                this.collection.push(items[i]);
            }
        }
    }

    public contain(item:T) {
        return this.collection.indexOf(item) >= 0;
    }

    get count():number {
        return this.collection.length;
    }

    public remove(item:T) {
        var index = this.collection.indexOf(item);
        if (index >= 0) {
            this.collection.splice(index, 1);
        }
    }
}