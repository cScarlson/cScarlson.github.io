
import { Environment } from '@motorman/models';
import { Detective } from '@motorman/core/utilities';
import { V, Bootstrap, ElementNode, AttributeNode, TextNode, CommentNode, Service } from '@motorman/vertices';
import { RouterComponent } from '@motorman/vertices/sdk/components/router/router.component';
import { BackdropComponent } from '@motorman/vertices/sdk/components/backdrop/backdrop.component';
import { ModalComponent } from '@motorman/vertices/sdk/components/modal/modal.component';
//
import { environment } from '../environments/environment';
import { Sandbox, IElementSandbox, IAttributeSandbox } from './core';
import { Director, ActionHandlers, StateHandlers, channels } from './core';
import { CONSTANTS } from './core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './subsystem/header/header.component';
import { HudComponent } from './subsystem/hud/hud.component';
import { WelcomeComponent } from './subsystem/welcome/welcome.component';
//
import { routes } from './routes';


var app = new (class Application {
    
    constructor(env: Environment, routes: any) {
        
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
                // console.log(`@Service({ id: 'foreach' })`, $);
            }
            
        }
        
        @ElementNode({ selector: 'slot' }) class SlotComponent {
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
        
        @AttributeNode({ selector: 'foreach' }) class ElementRepeatAttribute {
            ProxySource: any = class ProxySource {
            
                constructor(private source: any) {}
                
                get(target: any, key: string, receiver: ProxySource) {
                    var { source } = this, result = Reflect.get(target, key, receiver);
                    if ({ 'undefined': true }[ result ]) result = Reflect.get(source, key, receiver);
                    return result;
                }
                
            };
            
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
                // $.bootstrap( clones[0] );
                
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
        
        @AttributeNode({ selector: '[*]' }) class BindingAttribute {
            private reflection: string = this.$.data.value;
            private detective: Detective = new Detective(this.$.data.owner, this);
            private attr: Attr = this.$.data.target;
            private reProperty: RegExp = /^\[(.+)\]$/;
            private reAttribute: RegExp = /^\[attr:(.+)\]$/;
            private isPropertyBinding: boolean = this.reProperty.test(this.attr.name);
            private isAttributeBinding: boolean = this.reAttribute.test(this.attr.name);
            private isBinding: boolean = (this.isPropertyBinding || this.isAttributeBinding);
            private property: string = '';
            
            constructor(private $: Sandbox) {
                var { reProperty, reAttribute, isPropertyBinding, isAttributeBinding } = this;
                var { attr, reflection, detective } = this;
                var { name } = attr;
                var matches = [ ], [ match, property ] = matches;
                if (isPropertyBinding) matches = name.match(reProperty);
                if (isAttributeBinding) matches = name.match(reAttribute);
                [ match, property ] = matches;
                
                this.property = property;
                detective.subscribe(reflection);
            }
            
            detect(e: CustomEvent) {
                var { type: key, detail } = e;
                var { oldValue, value } = detail;
                this.copy(key, value);
            }
            
            copy(key: string, value: any) {
                var { isBinding, isPropertyBinding, isAttributeBinding } = this;
                var { attr, reflection, property } = this;
                var { ownerElement } = attr;
                var operational = (isBinding && key === reflection);
                
                if (!operational) return;
                if (isPropertyBinding) ownerElement[property] = value;
                if (isAttributeBinding) ownerElement.setAttribute(property, value);
            }
            
        }
        
        @AttributeNode({ selector: '{*}' }) class ReporterAttribute {  // TODO: implement for both properties AND attributes ({attr:*})
            /**
             private mutation: MutationObserver;
             private context = new Proxy(this.target, {
                 apply(target: Function, args: any[]) {
                     if (target.name === 'setValue') this.updateOwner(args);
                 }
             });
             */
            constructor(private $: Sandbox) {}
        }
        
        @AttributeNode({ selector: '[!]' }) class ReferenceAttribute {
            constructor(private $: Sandbox) {}
        }
        
        @TextNode({ selector: /\{\{.+\}\}/ }) class TextInterpolationDirective {
            private data: string = (this.$.target as Text).data;
            private owner: string = this.$.data.owner;
            
            constructor(private $: Sandbox) {
                var { data, owner } = this;
                ($.target as Text).data = $.utils.interpolate(data)(owner);
            }
            
        }
        
        @CommentNode({ selector: /my\scomment/i }) class CommentDirective {
            
            constructor(private $: Sandbox) {
                // console.log(`@Comment({ selector: /my comment/i })`, $);
            }
            
        }
        
        class BinderAttribute {  // # Template Method Pattern
            protected key: string = '';
            protected detective: Detective = new Detective(this.$.data.owner, this);
            
            constructor(protected $: IAttributeSandbox) {
                var { node } = $, { value } = node;
                this.key = value;
            }
            
            detect(e: CustomEvent) {
                var { type: datum, detail } = e;
                var { oldValue, value } = detail;
                this._detect(datum, value);
            }
            
            _detect(key: string, value: string) {}  // noop
            
        }
        
        @AttributeNode({ selector: '[*]' }) class AttributeBinder extends BinderAttribute {
            private attr: string = '';
            
            constructor($: IAttributeSandbox) {
                super($);
                var { detective } = this;
                var { node } = $;
                var { name, value } = node;
                var matches = name.match(/^\[(.+)\]$/);
                var [ whole, match ] = matches;
                
                this.attr = match;
                detective.subscribe(value);
            }
            
            _detect(key: string, value: string) {
                var { $, attr } = this;
                var { node } = $;
                var { ownerElement } = node;
                
                ownerElement.setAttribute(attr, value);
            }
            
        }
        
        @AttributeNode({ selector: '{*}' }) class PropertyBinder extends BinderAttribute {
            private property: string = '';
            
            constructor($: IAttributeSandbox) {
                super($);
                var { detective } = this;
                var { node } = $;
                var { name, value } = node;
                var matches = name.match(/^\{(.+)\}$/);
                var [ whole, id ] = matches;
                var codes = <any>id.split('#'), property = String.fromCharCode(...codes);
                
                this.property = property;
                detective.subscribe(value);
            }
            
            _detect(key: string, value: string) {
                var { $, property } = this;
                var { node } = $;
                var { ownerElement } = node;
                
                ownerElement[property] = value;
            }
            
        }
        
        // // V(TestService);
        V(AppComponent);
        V(HeaderComponent);
        V(HudComponent);
        V(WelcomeComponent);
        //
        V(RouterComponent);
        V(BackdropComponent);
        V(ModalComponent);
        V(SlotComponent);
        V(ElementRepeatAttribute);
        // V(BindingAttribute);
        V(AttributeBinder);
        V(PropertyBinder);
        // // V(ReporterAttribute);
        // // V(ReferenceAttribute);
        V(TextInterpolationDirective);
        // // V(CommentDirective);
        alert;(`
            Create a "Coding Assessment" module on section of site. Make it efficient enough to completely replace all BS "Take-Home"
            assessments. In fact, this should completely remove the need for onsite interviews altogether. This is your contribution to
            Meritocracy!
        `);
        
        window.addEventListener( 'load', () => V.config(config) );
        
    }
    
})(environment, routes);

export { app };
