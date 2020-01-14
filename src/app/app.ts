
import { filter } from 'rxjs/operators';
//
import { Environment } from '@motorman/models';
import { V } from '@motorman/vertices';
//
import { environment } from '../environments/environment';
import { ServiceSandbox, ComponentSandbox as Sandbox } from './core';
import { Director, ActionHandlers, StateHandlers, channels } from './core';
import { CONSTANTS, bootstrap } from './core';


var app = new (class Application {
    
    constructor(env: Environment) {
        
        V(class TestService {
            
            constructor(private $: ServiceSandbox) {
                // console.log('@ TestService', $);
            }
            
            init() {
                // console.log('@ TestService # init', this.$);
                return this;
            }
            
        });
        
        setTimeout( () => V('v-custom', class Component {
            static observedAttributes: string[] = ['name'];
            static template: string = `<h2>This is a template for {name}</h2>`;
            private name: any = '';
            public id: number = +'998';
            ['$on:click']: Function = this.handleClick;
            
            constructor(private $: Sandbox) {
                var filterId = filter( (e: CustomEvent) => e.detail.id === this.id )
                  // , latest = last()
                  ;
                console.log('@ v-custom', $.element, $.element.template);
                setTimeout( () => this.name = 'CLICK ME', (1000 * 3) );
                // $.attach(this);
                $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']).pipe(filterId).subscribe(this.handleId);
                // $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']).pipe(latest).subscribe(this.handleId);
                setTimeout( () => $.attach(this), (1000 * 2) );
            }
            
            init(dataset: DOMStringMap) {
                console.log('@ Component # dataset', dataset);
            }
            
            attributeChangedCallback(attrName, oldVal, newVal) {
                console.log('@ Custom # attributeChangedCallback', attrName, oldVal, newVal);
            }
            
            handleClick(e: Event) {
                console.log('# click', e);
                this.name = 'now-this!!!';
                setTimeout( () => this.name = 'CLICK ME', (1000 * 3) );
            }
            
            next(e: CustomEvent) {
                var { type, detail } = e;
                var action = {
                    [ this.$.channels['JOHN:WILL:LIKE:THIS:STRATEGY'] ]: this.handleId,
                }[ type ];
                
                console.log('@ next', type, detail);
                action && setTimeout( () => action.call(this, e), (1000 * 5) );
            }
            error(error: any) {
                // console.log('@ SomeComponent # error()', error);
            }
            complete() {
                // console.log('@ SomeComponent # complete()');
            }
            
            public handleId = (e: CustomEvent) => {
                var { type, detail } = e;
                console.log('@ handleId', type, detail);
            };
            
            // public handleLatest = (e: CustomEvent) => {
            //   var { type, detail } = e;
            //   console.log('@ handleLatest', type, detail);
            // };
            
        }), (1000 * 5) );
        
        V.directive('document', class DocumentComponent {
            
            constructor(private $: Sandbox) {
                // console.log('@ DocumentComponent', $);
            }
            
            init() {
                // console.log('@ DocumentComponent # init', this.$);
                return this;
            }
            
        });
        
        V('v-other', class OtherComponent {
            static observedAttributes: string[] = [ ];
            static template: string = ``;
            
            constructor(private $: Sandbox) {
                setTimeout( () => this.wait(), (1000 * 3) );
            }
            
            wait() {
                var { $ } = this;
                $.publish($.channels['JOHN:WILL:LIKE:THIS:STRATEGY'], { id: 998, datum: 'A' });
                $.publish($.channels['JOHN:WILL:LIKE:THIS:STRATEGY'], { id: 999, datum: 'B' });
            }
            
        });
        
        V('v-modal', class ModalComponent {
            static observedAttributes: string[] = [ 'options' ];
            static template: string = '';
            private options: any = { };
            
            constructor(private $: Sandbox) {
                $.in($.channels['BACKDROP:DISMISSED']).subscribe(this.handleDismissed);
                setTimeout( () => $.publish($.channels['BACKDROP:REQUESTED'], { test: true }), (1000 * 3) );
            }
            
            attachedCallback() {
                var { $ } = this;
                $.publish($.channels['BACKDROP:REQUESTED'], { test: true });
                setTimeout( () => $.publish($.channels['BACKDROP:REQUESTED'], { test: true }), (1000 * 5) );
            }
            
            public handleDismissed = (e: CustomEvent) => {
                var { type, detail } = e;
                console.log('@ ModalComponent', type, detail);
            };
            
            public handleRequest = (e: CustomEvent) => {
                var { type, detail } = e;
                console.log('@ ModalComponent', type, detail);
            };
            
        });
    
        const {
            SELECTOR,
        } = CONSTANTS;
        
        class Dependencies {};  // mock
        var director = new Director({ channels, Dependencies, ActionHandlers, StateHandlers });
        var config = {
            director,
            selector: `[data-${SELECTOR}]`,
            datasets: '[data-attribute]',
            bootstrap,
            decorators: { services: ServiceSandbox, components: Sandbox },
        };
        
        window.addEventListener( 'load', () => V.config(config) );
        
    }
    
})(environment);

export { app };
