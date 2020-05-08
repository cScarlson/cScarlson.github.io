
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
    public get url(): string { return this.route ? this.route.id : ''; }
    public get router(): Router { return Router.$instances.get( this.$.target.attributes['name'].value ); };
    
    constructor(private $: Sandbox) {
        var { router } = this;
        console.log('ROUTER', this.route);
        
        router.attach(this, true);
        // $.state.set(this);
        // $.content.set(template);
        // $.in('MODAL:REQUESTED').subscribe(this.handleRequest);
        // $.in('MODAL:DISMISSED').subscribe(this.handleDismiss);
        // this.router.subscribe('http://localhost:8080/#/route/test/0', (e) => console.log('>', e) );
        
        if (!RouterComponent.INSTANCE) RouterComponent.INSTANCE = this;
        return RouterComponent.INSTANCE;
    }
    
    update(state: RouteComposite) {
        this.route = state;
        console.log('NEW ROUTE LOADED...', this.url, state);
        return this;
    }
    
}

export { RouterComponent };
