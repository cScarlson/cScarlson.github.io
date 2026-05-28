
const { log } = console;

export class Stack<T = any> {
    get size(): number { return this.data.length }
    get empty(): boolean { return this.isEmpty() }
    get top(): T { return this.peek() }
    
    constructor(public data: T[] = []) {}
    
    enqueue(item: T): Stack<T> {  // normalize with Queue
        const { data } = this;
        data.push(item);
        return this;
    }
    
    dequeue(): T {  // normalize with Queue
        const { data } = this;
        const item = data.pop() as T;
        return item;
    }
    
    peek(): T {
        return this.data[this.data.length - 1];
    }
    
    search(item: T): number {
        const { data } = this;
        const i = data.indexOf(item);
        return i;
    }
    
    has(item: T): boolean {
        return !!~this.search(item);
    }
    
    isEmpty(): boolean {
        return !this.size;
    }
    
    clear(): Stack<T> {
        this.data.length = 0;
        return this;
    }
    
};
