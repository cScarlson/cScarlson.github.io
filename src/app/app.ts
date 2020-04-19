
import { Environment } from '@motorman/models';
import { V, Bootstrap, Element, Attribute, Text, Comment, Service } from '@motorman/vertices';
import { ModalComponent } from '@motorman/vertices/sdk/components/modal/modal.component';
//
import { environment } from '../environments/environment';
import { Sandbox } from './core';
import { Director, ActionHandlers, StateHandlers, channels } from './core';
import { CONSTANTS } from './core';
// import { AppComponent } from './app.component';


var app = new (class Application {
    
    constructor(env: Environment) {
        
        class Dependencies {};  // mock
        var director = new Director({ channels, Dependencies, ActionHandlers, StateHandlers });
        var config = {
            environment: document,
            director,
            Sandbox,
            bootstrap: new Bootstrap({}),
        };
        
        @Service({}) class TestService {
            
            constructor(private $: Sandbox) {
                console.log(`@Service({ id: 'foreach' })`, $);
            }
            
        }
        
        @Element({ selector: 'slot' }) class SlotComponent {
            get name() { return (this.$.target as HTMLSlotElement).name; }
            get occupants() { return this.$.data.occupants; }
            
            constructor(private $: Sandbox) {
                console.log(`@Element({ selector: 'slot' })`, $);
            }
            
        }
        
        @Attribute({ selector: 'foreach' }) class TemplateRepeatAttribute {
            
            constructor(private $: Sandbox) {
                console.log(`@Attribute({ selector: 'foreach' })`, $);
            }
            
        }
        
        @Attribute({ selector: '[*]' }) class BindingAttribute {  // TODO: implement for both properties AND attributes ([attr:*])
            /*
            private context: Proxy<IOwner>;
            private mutation: MutationObserver<Attr>;
            ^ if (mutation.target !== this.target) return;
            ^ if (mutation.attribute.name !== this.target.name) return;
            ^ NOTE: MutationObserer is for DOM. Use Proxy<IInstance> instead?
            */
            constructor(private $: Sandbox) {
                console.log(`@Attribute({ selector: '[*]' })`, $);
            }
            
        }
        
        @Attribute({ selector: '{*}' }) class ReporterAttribute {  // TODO: implement for both properties AND attributes ({attr:*})
            /*
            private mutation: MutationObserver;
            private context = new Proxy(this.target, {
                apply(target: Function, args: any[]) {
                    if (target.name === 'setValue') this.updateOwner(args);
                }
            });
            */
            constructor(private $: Sandbox) {
                console.log(`@Attribute({ selector: '{*}' })`, $);
            }
            
        }
        
        @Text({ selector: /\{\{.+\}\}/ }) class TextInterpolationDirective {
            
            constructor(private $: Sandbox) {
                console.log(`@Text({ selector: /^my test text$/ })`, $);
            }
            
        }
        
        @Comment({ selector: /my\scomment/i }) class CommentDirective {
            
            constructor(private $: Sandbox) {
                console.log(`@Comment({ selector: /my comment/i })`, $);
            }
            
        }
        
        V(TestService);
        V(ModalComponent);
        V(SlotComponent);
        V(TemplateRepeatAttribute);
        V(BindingAttribute);
        V(ReporterAttribute);
        V(TextInterpolationDirective);
        V(CommentDirective);
        alert;(`
            Create a "Coding Assessment" module on section of site. Make it efficient enough to completely replace all BS "Take-Home"
            assessments. In fact, this should completely remove the need for onsite interviews altogether. This is your contribution to
            Meritocracy!
        `);
        
        window.addEventListener( 'load', () => V.config(config) );
        
    }
    
})(environment);

export { app };
