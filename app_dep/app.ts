
// vertices
import { Environment } from '@motorman/models';
import { Detective } from '@motorman/core/utilities';
import { V, Bootstrap, ElementNode, AttributeNode, TextNode, CommentNode, Service } from '@motorman/vertices';
import { RouterComponent } from '@motorman/vertices/sdk/components/router/router.component';
import { BackdropComponent } from '@motorman/vertices/sdk/components/backdrop/backdrop.component';
import { HUDComponent } from '@motorman/vertices/sdk/components/hud/hud.component';
import { PopstateComponent } from '@motorman/vertices/sdk/components/popstate/popstate.component'
// app
import { environment } from '../environments/environment';
import { Sandbox, IElementSandbox, IAttributeSandbox } from './core';
import { Director, ActionHandlers, StateHandlers, channels } from './core';
import { CONSTANTS } from './core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './subsystem/header/header.component';
import { MenuComponent } from './subsystem/menu/menu.component';
import { WelcomeComponent } from './subsystem/welcome/welcome.component';
import { AboutComponent } from './subsystem/about/about.component';
import { ContactComponent } from './subsystem/contact/contact.component';
import { FormComponent as ContactFormComponent } from './subsystem/contact/subsystem/form/form.component';
import { UserTokenGetterComponent } from './subsystem/user/user.component';
import { CalendarComponent } from './subsystem/calendar/calendar.component';
import { FieldComponent as CalendarFieldComponent } from './subsystem/calendar/subsystem/field/field.component';
import { PlaygroundComponent } from './subsystem/playground/playground.component';
//
import { router } from './routing';


var app = new (class Application {
    
    constructor(env: Environment, router: any) {
        
        class Dependencies {};  // mock
        var director = new Director({ id: 'app' }, { channels, Dependencies, ActionHandlers, StateHandlers });
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
                // var commit = new Function('o', 'value', `console.log('.....', '${property}'); o.${property} = ${value}`);
                
                // console.log('.....', property, value);
                // commit(ownerElement);
                ownerElement[property] = value;
            }
            
        }
        
        @AttributeNode({ selector: '$' }) class ReferenceAttribute {  // TODO: this should be deprecated. use in bootstrap and add to scope that is interpolated
            
            constructor(private $: IAttributeSandbox) {
                var { name, value, ownerElement } = $.target;
                $.data.owner[value] = ownerElement;
            }
            
        }
        
        @AttributeNode({ selector: 'autofocus' }) class AutofocusAttribute {  // TODO: this should be deprecated. use in bootstrap and add to scope that is interpolated
            
            constructor(private $: IAttributeSandbox) {
                if ({ 'false': true }[ $.target.value ]) return this;
                var { name, value, ownerElement } = <any>$.target;
                var element = <HTMLElement>ownerElement, delay = <any>value || 0;
                setTimeout( () => element.focus(), delay );
            }
            
        }
        
        class ActionOnAttribute {
            protected context: HTMLElement = <HTMLElement>this.$.target.ownerElement;
            
            constructor(protected $: IAttributeSandbox, protected action: string = '') {
                var { name, value, ownerElement } = $.target;
                $.subscribe(value, this.handleAction);
            }
            
            execute(...params: any[]) {}
            
            public handleAction = (e: CustomEvent<{ params: any[] }>) => {
                var { type, detail } = e;
                var { params = [] } = detail;
                this.execute(...params);
            };
            
        }
        
        @AttributeNode({ selector: 'focuson' }) class FocusOnAttribute extends ActionOnAttribute {
            
            constructor($: IAttributeSandbox) {
                super($, 'focus');
            }
            
            execute(...params: any[]) {
                var { context, action } = this;
                context[action](...params);
            }
            
        }
        
        @ElementNode({ selector: 'input[type="signature"]' }) class SignatureComponent {
            // REQUIRES TRACK-PAD / TOUCH-PAD
            // uses algorithm to provide accurate aspect-ratio representation for writing signature on touch-pad
            // provides canvas and swipe/touch on mobile
        }
        
        // // V(TestService);
        V(AppComponent);
        V(HeaderComponent);
        V(MenuComponent);
        V(WelcomeComponent);
        V(AboutComponent);
        V(ContactComponent);
        V(ContactFormComponent);
        V(UserTokenGetterComponent);
        V(CalendarComponent);
        V(CalendarFieldComponent);
        if ( { 'QA': true, 'DEV': true, 'MOCK': true }[ environment.type ] ) V(PlaygroundComponent);
        //
        V(RouterComponent);
        V(HUDComponent);
        V(BackdropComponent);
        V(PopstateComponent);
        V(SlotComponent);
        V(ElementRepeatAttribute);
        V(AttributeBinder);
        V(PropertyBinder);
        V(ReferenceAttribute);
        V(AutofocusAttribute);
        V(FocusOnAttribute);
        // V(TextInterpolationDirective);
        // V(CommentDirective);
        alert;(`
            Create a "Coding Assessment" module on section of site. Make it efficient enough to completely replace all BS "Take-Home"
            assessments. In fact, this should completely remove the need for onsite interviews altogether. This is your contribution to
            Meritocracy!
        `);
        
        window.addEventListener( 'load', () => V.config(config) );
        
    }
    
})(environment, router);

export { app };
