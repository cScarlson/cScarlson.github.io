
import { Queue } from '@motorman/core/utilities/ds';
import { IEventAggregator } from '@motorman/core';
import { IObserver } from '@motorman/core/utilities/patterns/behavioral';
import { ElementNode } from '@motorman/vertices/core/decorators';
import { NodeSandbox as Sandbox } from '@motorman/vertices/core';
import { IActiveRouteDetails, Router, RouteComposite } from './index';
import template from './router.component.html';

@ElementNode({ selector: 'v-router' })
class RouterComponent implements IObserver {
    private static INSTANCE: any = null;
    private details: IActiveRouteDetails = null;
    public attr = this.$.target.attributes['name'];  // name attribute (name="[name]")
    public name = this.attr.value;  // router name
    public get route(): RouteComposite { return this.details ? this.details.route : null; }
    public get url(): string { return this.route ? this.route.id : ''; }
    public get router(): Router { return Router.$instances.get(this.name); };
    
    constructor(private $: Sandbox) {
        var { router, name } = this;
        
        if (!RouterComponent.INSTANCE) RouterComponent.INSTANCE = this;  // set | return before instance operations
        else return RouterComponent.INSTANCE;
        setTimeout( () => router.attach(this, true), (1000 * 0) );
        router.publish('router:outlet:ready', { name });
        
        return RouterComponent.INSTANCE;
    }
    
    update(state: IActiveRouteDetails) {
        var { name, route: current } = this;
        var { url, route, params } = state;
        var old = { ...current }, copy = { ...route };  // protect source-data in Heap
        var payload = { name, url, old, route: copy, params };
        
        if (!state) return !!(this.details = null);  // return false
        this.details = state;
        this.$.target.innerHTML = route.content;
        this.$.v(this.$.target.firstChild);
        // this.$.state.set(this);  // only use if template uses {innerHTML}="route.content" or {{route.content}}
        // this.$.content.set(state.content);  // ISSUE: does not produce innerHTML!
        this.router.publish('router:outlet:content:change');
        this.router.publish('router:outlet:updated', payload);
        // setTimeout( () => this.router.publish('router:outlet:updated', payload), (1000 * 0) );
        
        return this;
    }
    
}

export { RouterComponent };
