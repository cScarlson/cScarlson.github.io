
const { log } = console;
export class Queue {
    data = [];
    get size() { return this.data.length }
    get empty() { return !this.size }
    get front() { return this.data[0] }
    
    constructor(initial = this.data) {
        this.data = initial;
    }
    
    enqueue(item) {
        const { data } = this;
        data.push(item);
        return this;
    }
    
    dequeue() {
        const { data } = this;
        const item = data.shift();
        return item;
    }
    
    clear() {
        this.data.length = 0;
        return this;
    }
    
};
