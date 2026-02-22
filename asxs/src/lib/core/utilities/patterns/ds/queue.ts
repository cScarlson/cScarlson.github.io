
const { log } = console;

export class Queue<T = any> {
    get size(): number { return this.data.length }
    get empty(): boolean { return this.isEmpty() }
    get front(): T { return this.getFront() }
    
    constructor(public data: T[] = []) {}
    
    enqueue(item: T): Queue<T> {  // normalize with Stack
        const { data } = this;
        data.push(item);
        return this;
    }
    
    dequeue(): T {  // normalize with Stack
        const { data } = this;
        const item = data.shift() as T;
        return item;
    }
    
    getFront(): T {
        return this.data[0];
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
    
    clear(): Queue<T> {
        this.data.length = 0;
        return this;
    }
    
};
