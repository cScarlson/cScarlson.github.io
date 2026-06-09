
const { log } = console;

export class Stack {
    data = [];
    get size() { return this.data.length }
    get empty() { return this.isEmpty() }
    get top() { return this.peek() }
    
    constructor(data = []) {
        this.data = data;
    }
    
    enqueue(item) {  // normalize with Queue
        const { data } = this;
        data.push(item);
        return this;
    }
    
    dequeue() {  // normalize with Queue
        const { data } = this;
        const item = data.pop();
        return item;
    }
    
    peek() {
        return this.data[this.data.length - 1];
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
