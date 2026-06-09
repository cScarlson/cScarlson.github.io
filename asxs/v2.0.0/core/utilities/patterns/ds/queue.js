
const { log } = console;

export class Queue {
    data = [];
    get size() { return this.data.length }
    get empty() { return this.isEmpty() }
    get front() { return this.getFront() }
    
    constructor(data = []) {
        this.data = data;
    }
    
    enqueue(item) {  // normalize with Stack
        const { data } = this;
        data.push(item);
        return this;
    }
    
    dequeue() {  // normalize with Stack
        const { data } = this;
        const item = data.shift();
        return item;
    }
    
    getFront() {
        return this.data[0];
    }
    
    search(item) {
        const { data } = this;
        const i = data.indexOf(item);
        return i;
    }
    
    has(item) {
        return !!~this.search(item);
    }
    
    isEmpty() {
        return !this.size;
    }
    
    clear() {
        this.data.length = 0;
        return this;
    }
    
};
