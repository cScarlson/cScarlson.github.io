
import { utils } from './utilities';
import { Director } from './director';

class Sandbox {
    director = new Director();
    utils = utils;
    target = document.createElement('div');
    classList = this.target.classList;
    dataset = this.target.dataset;
    childNodes = this.target.childNodes;
    children = this.target.children;
    innerHTML = this.target.innerHTML;

    constructor(target) {
        var { classList, dataset, childNodes, children, innerHTML } = target;
        
        this.target = target;
        this.classList = classList;
        this.dataset = dataset;
        this.childNodes = childNodes;
        this.children = children;
        this.innerHTML = innerHTML;

        return this;
    }

    publish(channel, data, ...more) {
        this.director.publish(channel, data, ...more);
        return this;
    }

    subscribe(channel, handler) {
        this.director.subscribe(channel, handler);
        return this;
    }

    unsubscribe(channel, handler) {
        this.director.unsubscribe(channel, handler);
        return this;
    }

}

export { Sandbox };
