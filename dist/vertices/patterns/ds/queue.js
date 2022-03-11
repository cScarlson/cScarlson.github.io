
class Queue {
    data = [ ];
    get size() { return this.data.length }
    
    constructor() {}
    
    enqueue(item) {
        const { data } = this;
        data.push(item);
        return this;
    }
    
    dequeue() {
        const { data } = this;
        const item = data.shift(item);
        return item;
    }
    
    front() {
        const { data } = this;
        const next = data[0];
        return next;
    }
    
    back() {
        const { data } = this;
        const last = data[data.length - 1];
        return last;
    }
    
    isEmpty() {
        return !this.size;
    }
    
}

export { Queue };
