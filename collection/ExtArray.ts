export class ExtArray<T> extends Array {

    indexOfByProperty(property: string, value: any, fromIndex: number = 0): number {
        for (var i = fromIndex, il = this.length; i < il; ++i) {
            if (this[i][property] == value) {
                return i;
            }
        }
        return -1;
    }

    findByProperty(property: string, value: any): ExtArray<T>;
    findByProperty(property: string, value: Array<any>): ExtArray<T> {
        var founds = new ExtArray<T>(), i, il;
        if (value.splice) {
            for (i = 0, il = this.length; i < il; ++i) {
                for (var j = 0, jl = value.length; j < jl; ++j) {
                    if (this[i][property] == value[j]) {
                        founds.push(this[i]);
                    }
                }
            }
        } else {
            for (i = 0, il = this.length; i < il; ++i) {
                if (this[i][property] == value) {
                    founds.push(this[i]);
                }
            }
        }
        return founds;
    }

    removeByProperty(property: string, value) {
        var index = this.indexOfByProperty(property, value);
        return index >= 0 ? this.splice(index, 1) : undefined;
    }

    set(items: Array<T>) {
        this.splice(0, this.length);
        for (var i = 0, il = items.length; i < il; ++i) {
            this.push(items[i]);
        }
    }

    clear() {
        this.splice(0, this.length);
    }

}
