
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
            get occupants() { return [ ...this.$.data.parent.occupants ]; }
            
            constructor(private $: Sandbox) {
                var { target } = $;
                var { name } = this;
                var nodes = [ ];
                
                if (!name) nodes = this.occupants.filter( (el: Element|Text) => !(el as Element).slot);
                else if ( $.data.parent.$occupants.has(name) ) nodes = $.data.parent.$occupants.get(name);
                
                if (nodes.length) (target as Element).innerHTML = '';  // clear before adding
                for (let i = 0, len = nodes.length; i < len; i++) ($.target as Element).appendChild( nodes[i].cloneNode(true) );
            }
            
        }
        
        @Attribute({ selector: 'foreach' }) class ElementRepeatAttribute {
            ProxySource: any = class ProxySource {
            
                constructor(private source: any) {}
                
                get(target: any, key: string, receiver: ProxySource) {
                    var { source } = this, result = Reflect.get(target, key, receiver);
                    if ({ 'undefined': true }[ result ]) result = Reflect.get(source, key, receiver);
                    return result;
                }
                
            }
            
            constructor(private $: Sandbox) {
                // console.log(`@Attribute({ selector: 'foreach' })`, $);
                var data = $.data, attr = <Attr>$.target;
                var element = ($.element as Element), clone = <Element>element.cloneNode(true);
                var { owner } = data;
                var { name, value } = attr;
                var [ as, key ] = value.split(' of ');
                var array = owner[key];
                var removed = this.clean(clone);
                var container = document.createElement('div');
                var clones: Element[] = array.map( (item, i) => this.clone(container, clone, as, item, i) );
                
                element.outerHTML = container.innerHTML;
                $.bootstrap( clones[0] );
                
            }
            
            clean(node: Element) {
                node.removeAttribute('foreach');
                return node.hasAttribute('foreach');
            }
            
            clone(container: Node&Element, node: Node, key: string, details: any = {}, i: number) {
                var { $, ProxySource } = this, { data, utils } = $, { owner, parent } = data, { Class } = parent;
                var clone = <Element>node.cloneNode(true), template = clone.outerHTML;
                var fallback = new ProxySource(owner), scope = new Proxy({ [key]: details }, fallback);
                var interpolated = utils.interpolate(template)(scope);
                
                container.appendChild(clone);
                clone.outerHTML = interpolated;
                
                // console.log('------>', container.children[i]);
                return container.children[i];
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
                console.log(`@Attribute({ selector: '[*]' })`, ($.target as Attr).ownerElement);
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
        V(ElementRepeatAttribute);
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
