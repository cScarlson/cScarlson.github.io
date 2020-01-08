
import { Utilities } from '@motorman/core/utilities';
import { CONSTANTS } from './constants';

const {
    SELECTOR,
} = CONSTANTS;

var utils = new Utilities();
class DataDecorator {
    
    constructor(private dataset: any = {}) {
        utils.extend(this, dataset);
        return this;
    }
    
}

function bootstrap(target, core) {
    var element = target;
    var selector = this.selector;
    var data: any = new DataDecorator(element.dataset);
    var ex = /[\s]+/img;
    var slug = data[SELECTOR] || '';
    var ids = slug.split(ex);
    var children = element.children;// element.querySelectorAll(selector);
    var components = [ ];
    
    var resolveScope = function resolveScope(parent, child) {
        var isDirectDescendant = (child.parentNode === parent);
        if (isDirectDescendant) bootstrap.call(this, child, this);
    }.bind(core, element);
    
    if (!!slug) components = ids.map(core.bootstrap.bind(core, element, data));
    Array.prototype.forEach.call(children, resolveScope);  // TODO: Optimize!!!
    components.forEach( mountComponent.bind(core) );
    
    function mountComponent(component) {
        if (!component) return;
        var instance = component.instance, handleMount = instance.handleMount;
        if (handleMount) handleMount.call(instance);
    }
    
}

export { bootstrap };
