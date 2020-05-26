
import { Reactive as Mediator } from '../mediator';


class Store extends Mediator {
    private $data: Map<any, any> = new Map();
    public id: string;

    constructor(options: any = {}) {
        super();
        var { id } = options;
        this.id = id;

        return this;
    }

    next(e: CustomEvent, key: any) {
        var { type, detail } = e;
        var child = this.get(key)
          , data = child.data()
          ;
        var paths = {
            'parent.child.datum':   `${this.id}.${key}.${type}`,
            'parent.*.datum':       `${this.id}.*.${type}`,
            '**.child.datum':       `**.${key}.${type}`,
            '**.*.datum':           `**.*.${type}`,
        };
        
        this.publish(paths['parent.child.datum'], detail);
        this.publish(paths['parent.*.datum'], detail);
        this.publish(paths['**.child.datum'], detail);
        this.publish(paths['**.*.datum'], detail);
    }
    error(error: Error) {}
    complete() {}

    has(key: any) {
        var has = this.$data.has(key);
        return has;
    }

    get(key: any) {
        var value = this.$data.get(key);
        return value;
    }

    set(key: any, value: any) {
        this.$data.set(key, value);
        this.publish(key, value);
        this.publish('*', value);
        this.publish('**.*', value);
        this.publish(`**.${key}`, value);
        if (value instanceof Store) value.attach({ next: (e) => this.next(e, key) });
        
        return this;
    }

    data() {
        var entries = Array.from( this.$data.entries() ), o = { };
        for (let [key, value] of entries) o[key] = value;
        return o;
    }

    toJSON() {
        return this.data();
    }

}

export { Store };
