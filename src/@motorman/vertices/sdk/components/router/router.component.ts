
import { Queue } from '@motorman/core/utilities/ds';
import { IEventAggregator } from '@motorman/core';
import { IObserver } from '@motorman/core/utilities/patterns/behavioral';
import { ElementNode } from '@motorman/vertices/core/decorators';
import { NodeSandbox as Sandbox } from '@motorman/vertices/core';
import { Router, RouteComposite } from './index';
import template from './router.component.html';

@ElementNode({ selector: 'v-router' })
class RouterComponent implements IObserver {
    private static INSTANCE: any = null;
    private route: RouteComposite = null;
    public attr = this.$.target.attributes['name'];  // name attribute (name="[name]")
    public name = this.attr.value;  // router name
    public get url(): string { return this.route ? this.route.id : ''; }
    public get router(): Router { return Router.$instances.get(this.name); };
    
    constructor(private $: Sandbox) {
        var { router, name } = this;
        
        if (!RouterComponent.INSTANCE) RouterComponent.INSTANCE = this;  // set | return before instance operations
        else return RouterComponent.INSTANCE;
        router.attach(this, true);
        router.publish('router:outlet:ready', { name });
        
        return RouterComponent.INSTANCE;
    }
    
    update(state: RouteComposite) {
        var { name, route } = this;
        var old = { ...route }, copy = { ...state };  // protect source-data in Heap
        var payload = { name, old, route: copy };
        
        this.route = state;
        this.$.target.innerHTML = state.content;
        this.$.v(this.$.target.firstChild);
        // $.state.set(this);  // only use if template uses {innerHTML}="route.content" or {{route.content}}
        // this.$.content.set(state.content);  // ISSUE: does not produce innerHTML!
        this.router.publish('router:outlet:content:change');
        this.router.publish('router:outlet:updated', payload);
        
        return this;
    }
    
}

export { RouterComponent };
