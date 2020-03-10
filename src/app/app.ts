
import { filter } from 'rxjs/operators';
//
import { Environment } from '@motorman/models';
import { V, Element } from '@motorman/vertices';
// import { V, Element, attr, watch, bind, handle } from '@motorman/vertices';
import { BackdropComponent } from '@motorman/vertices/sdk/components/backdrop/backdrop.component';
import { ModalComponent } from '@motorman/vertices/sdk/components/modal/modal.component';
//
import { environment } from '../environments/environment';
import { ServiceSandbox, ComponentSandbox as Sandbox } from './core';
import { Director, ActionHandlers, StateHandlers, channels } from './core';
import { CONSTANTS, bootstrap } from './core';
// import { AppComponent } from './app.component';


class TestService {
            
    constructor(private $: ServiceSandbox) {
        // console.log('@ TestService', $);
    }
    
    init() {
        // console.log('@ TestService # init', this.$);
        return this;
    }
    
}

@Element({ name: 'v-custom', template: `<h2>This is a template for {name}</h2>` })
class Component {
    // @attr() name: any = '';
    // public id: number = +'998';
    
    // constructor(private $: Sandbox) {
    //     // console.log('@ v-custom', $.element, $.element.template);
    //     setTimeout( () => this.name = 'CLICK ME', (1000 * 3) );
    //     // $.attach(this);
    //     $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']).pipe(this.filterId).subscribe(this.handleId);
    //     // $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']).pipe(latest).subscribe(this.handleId);
    //     // setTimeout( () => $.attach(this), (1000 * 2) );
    // }
    
    // init(dataset: DOMStringMap) {
    //     console.log('@ Component # dataset', dataset);
    // }
    
    // attributeChangedCallback(attrName, oldVal, newVal) {
    //     console.log('@ Custom # attributeChangedCallback', attrName, oldVal, newVal);
    // }
    
    // @watch('name') watchName(val, old) {
    //     console.log(`@v-custom: this.name was ${old} and is now ${val}`);
    // }
    
    // @bind('click') handleClick(e: Event) {
    //     console.log('# click', e);
    //     this.name = 'now-this!!!';
    //     setTimeout( () => this.name = 'CLICK ME', (1000 * 3) );
    // }
    
    // next(e: CustomEvent) {
    //     var { type, detail } = e;
    //     var action = {
    //         [ this.$.channels['JOHN:WILL:LIKE:THIS:STRATEGY'] ]: this.handleId,
    //     }[ type ];
        
    //     console.log('@ next', type, detail);
    //     action && setTimeout( () => action.call(this, e), (1000 * 5) );
    // }
    // error(error: any) {
    //     // console.log('@ SomeComponent # error()', error);
    // }
    // complete() {
    //     // console.log('@ SomeComponent # complete()');
    // }
    
    // private filterId = filter( (e: CustomEvent) => e.detail.id === this.id );
    // private handleId = (e: CustomEvent) => {
    //     var { type, detail } = e;
    //     console.log('@ handleId', type, detail);
    // };
    
    // // public handleLatest = (e: CustomEvent) => {
    // //   var { type, detail } = e;
    // //   console.log('@ handleLatest', type, detail);
    // // };
    
}

@Element({ name: 'v-other', template: `` })
class OtherComponent {
    
    // constructor(private $: Sandbox) {
    //     setTimeout( () => this.wait(), (1000 * 3) );
    //     setTimeout( () => $.publish($.channels['MODAL:REQUESTED'], { active: '???' }), (1000 * 2) );
    // }
    
    // wait() {
    //     var { $ } = this;
    //     $.publish($.channels['JOHN:WILL:LIKE:THIS:STRATEGY'], { id: 998, datum: 'A' });
    //     $.publish($.channels['JOHN:WILL:LIKE:THIS:STRATEGY'], { id: 999, datum: 'B' });
    // }
    
}

var app = new (class Application {
    
    constructor(env: Environment) {
        
        // SERVICES
        // V(TestService);
        // VERTICES COMPONENTS
        // V(BackdropComponent)(ModalComponent);
        V(ModalComponent);
        // APP COMPONENTS
        // V(AppComponent)(Component)(OtherComponent);
        // setTimeout( () => V(Component), (1000 * 5) ); <-- THIS STILL BASICALLY FUNCTIONS
        
        // V.component('document', class DocumentComponent {
            
        //     constructor(private $: Sandbox) {
        //         // console.log('@ DocumentComponent', $);
        //     }
            
        //     init() {
        //         // console.log('@ DocumentComponent # init', this.$);
        //         return this;
        //     }
            
        // });
    
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
