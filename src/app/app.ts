
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
        
        @Attribute({ selector: 'foreach' }) class TemplateRepeatAttribute {
            
            constructor(private $: Sandbox) {
                console.log(`@Attribute({ selector: 'foreach' })`, $);
            }
            
        }
        
        @Attribute({ selector: '[*]' }) class BindingAttribute {
            
            constructor(private $: Sandbox) {
                console.log(`@Attribute({ selector: '[*]' })`, $);
            }
            
        }
        
        @Attribute({ selector: '{*}' }) class ReporterAttribute {
            
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
