
/**
 * @name: Stack
 * @intention
 *  * LIFO (Last-In, First-Out)
 */
class Stack<T> {
    private data: T[] = [ ];
    get length() { return this.size(); }
    get index() { return (this.length - 1); }
    
    constructor(data: T[] = []) {
        this.clear();
        this.data = [ ...data ];
        return this;
    }
    
    private serialize(object) {
        var json = JSON.stringify(object);
        return json;
    }
    private deserialize(json) {
        var object = JSON.parse(json);
        return object;
    }
    private copy(object) {
        var json = this.serialize(object), object = this.deserialize(json);
        return object;
    }
    
    push(value: T): Stack<T> {
        this.data.push(value);
        return this;
    }
    pop(): T {
        var value = this.data.pop();
        return value;
    }
    peek(): T {
        var value = this.data[this.index];
        return value;
    }
    clear(): Stack<T> {
        this.data.length = 0;
        return this;
    }
    size(): number {
        var value = this.data.length;
        return value;
    }
    isEmpty(): boolean {
        var is = !this.size();
        return is;
    }
    
    toJSON(): T[] {
        return this.valueOf();
    }
    toString(): string {
        var json = this.serialize( this.valueOf() );
        return json;
    }
    valueOf(): T[] {
        return this.data.slice(0);
    }
    
}

export { Stack };
