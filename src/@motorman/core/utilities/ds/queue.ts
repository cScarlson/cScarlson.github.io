
/**
 * @name: Queue
 * @intention
 *  * FIFO (First-In, First-Out)
 */
class Queue {
    private data: any[] = [ ];
    get length() { return this.size(); }
    get index() { return 0; }
    
    constructor(data) {
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
    
    enqueue(value) {
        this.data.push(value);
        return this;
    }
    dequeue() {
        var value = this.data.shift();
        return value;
    }
    front() {
        var value = this.data[this.index];
        return value;
    }
    clear() {
        this.data.length = 0;
        return this;
    }
    size() {
        var value = this.data.length;
        return value;
    }
    isEmpty() {
        var is = !this.size();
        return is;
    }
    
    toJSON() {
        return this.valueOf();
    }
    toString() {
        var json = this.serialize( this.valueOf() );
        return json;
    }
    valueOf() {
        return this.data.slice(0);
    }
    
}

export { Queue };
