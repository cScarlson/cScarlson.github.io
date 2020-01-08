
import { filter } from 'rxjs/operators';
//
import { Environment } from '@motorman/models';
import { environment } from '../environments/environment';
import { Sandbox, ServiceSandbox, ComponentSandbox } from './core';
import { CONSTANTS, bootstrap } from './core';
import { V } from '@motorman/vertices';

const {
    SELECTOR,
} = CONSTANTS;

V.config({
    selector: `[data-${SELECTOR}]`,
    datasets: '[data-attribute]',
    bootstrap,
    decorators: { services: ServiceSandbox, components: ComponentSandbox },
});

V(class TestService {
    
    constructor(private $: Sandbox) {
        console.log('@ TestService', $);
    }
    
    init() {
        console.log('@ TestService # init', this.$);
        return this;
    }
    
});

V('document', class DocumentComponent {
    
    constructor(private $: Sandbox) {
        console.log('@ DocumentComponent', $);
    }
    
    init() {
        console.log('@ DocumentComponent # init', this.$);
        return this;
    }
    
});

window.addEventListener( 'load', V.bootstrap.bind(V, { target: document }) );

// /**
//  * CONCEPTS
//  */
// // var component = new V('some/path/to/template.html', { selector: 'widget' }, function Component($) {
// //     // ...
// // });

console.log('V', V);

var app = new (class Application {
    
    constructor(env: Environment) {
        class SomeComponent {
            public id: number = +'998';
            
            constructor(private $: Sandbox) {
                var filterId = filter( (e: CustomEvent) => e.detail.id === this.id )
                  // , latest = last()
                  ;

                // $.attach(this);
                $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']).pipe(filterId).subscribe(this.handleId);
                // $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']).pipe(latest).subscribe(this.handleId);
                setTimeout( () => $.attach(this), (1000 * 2) );
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
                console.log('@ SomeComponent # error()', error);
            }
            complete() {
                console.log('@ SomeComponent # complete()');
            }

            public handleId = (e: CustomEvent) => {
                var { type, detail } = e;
                console.log('@ handleId', type, detail);
            };
            
            // public handleLatest = (e: CustomEvent) => {
            //   var { type, detail } = e;
            //   console.log('@ handleLatest', type, detail);
            // };
            
        }

        // var director = new Director({ channels, Dependencies, ActionHandlers, StateHandlers });
        // var $ = new Sandbox(director);
        // var some1 = new SomeComponent($);

        // var test0Channel$ = $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']);
        // setTimeout( () => {
        //     $.publish($.channels['JOHN:WILL:LIKE:THIS:STRATEGY'], { id: 998, datum: 'A' });
        //     $.publish($.channels['JOHN:WILL:LIKE:THIS:STRATEGY'], { id: 999, datum: 'B' });
        // }, (1000 * 0) );
        // var some2 = new SomeComponent($);
        
        // return this;
    }
    
})(environment);

export { app };
