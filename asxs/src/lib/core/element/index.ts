
import type { ToDo } from '@asxs/core/types';
import { KEY_STATE } from '@asxs/core/constants';
import { utilities } from '@asxs/core/utilities';

// TODO: export { Easy, Normal, Heroic, Legendary };

interface RemoteElementDefinition extends HTMLCollection {  // Schema/Protocol for RED (Remote Element Definition)
    0: HTMLMetaElement,
    1: HTMLTemplateElement,
    2: HTMLStyleElement,
    3: HTMLScriptElement,
}

interface RemoteElementDefinitionOptions {
    meta: HTMLMetaElement;
    template: HTMLTemplateElement;
    styles: HTMLStyleElement;
    script: HTMLScriptElement;
    attributes: NamedNodeMap;
    contentDocument: Document;
    frame: HTMLIFrameElement;
}

const { log, warn, error: err } = console;

class Basic extends HTMLElement {
    static observedAttributes: string[] = [];
    protected root: ShadowRoot | HTMLElement = this.shadowRoot!;
    
    handleEvent(e: Event) {
        const { type, target } = e;
        const { dataset } = target as HTMLElement;
        const { [`(${type})`]: handler } = dataset;
        const { [`${type}:${handler}`]: handle } = this as ToDo;
        
        if (handle) handle.call(this, e);
        else warn(`WARNING. Uncaught Event: "${type}" expected handler "${handler}".`);
    }
    
    connectedCallback() {
        const root = this.createRenderRoot();
        this.root = root;
    }
    
    disconnectedCallback() {}
    
    adoptedCallback() {}
    
    connectedMoveCallback() {}
    
    attributeChangedCallback(name: string, old: string, val: string) {
        if (`attr:${name}` in this) this[`attr:${name}`](val, old);
    }
    
    createRenderRoot(): ShadowRoot | HTMLElement {
        return this.attachShadow({ mode: 'open' });
    }
    
    update(content: string) {
        const { root } = this;
        const { ['as:crawler']: crawler, ['as:update:handler']: handle } = this as ToDo;
        const { children } = root;
        
        root.innerHTML = content;
        if (crawler) crawler.execute(...children);
        if (handle) handle.call(this, content); 
    }
    
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        const { root } = this;
        super.addEventListener.call(root, type, listener, options);
    }
    
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        const { root } = this;
        super.removeEventListener.call(root, type, listener, options);
    }
    
    dispatchEvent(event: Event): boolean {
        const { root } = this;
        return super.dispatchEvent.call(root, event);
    }
    
    querySelector(selector: string): Element | null {
        if (this.root === this) return super.querySelector(selector);
        return this.root.querySelector(selector);
    }
    
    querySelectorAll(selector: string): NodeList {
        if (this.root === this) return super.querySelectorAll(selector);
        return this.root.querySelectorAll(selector);
    }
    
}

class Interpolator extends Basic {
    get [KEY_STATE](): any { return {} }
    
    update(template: string, state: any = this[KEY_STATE]): void {
        const content = utilities.interpolate(template)(state);
        super.update(content);
    }
    
}

class Renderer extends Interpolator {
    
    connectedCallback( x = super.connectedCallback() ): void {
        const template = this.render();
        this.update(template);
    }
    
    render(): string {
        return ``;
    }
    
}

class Frameless extends Interpolator {
    protected get __meta__(): HTMLMetaElement { return this.options.meta };
    protected get __template__(): HTMLTemplateElement { return this.options.template };
    protected get __styles__(): HTMLStyleElement { return this.options.styles };
    protected get __script__(): HTMLScriptElement { return this.options.script };
    
    constructor(protected options: RemoteElementDefinitionOptions) {
        super();
    }
    
}

class Sandbox extends Renderer {}

class PageElement extends Renderer {}

class CustomElement extends Renderer {}

export { customElement } from './customelement';
export { Loop } from './loop';
export { QUERY_HANDLER, ElementCrawler } from './elementcrawler';
export { CustomElement, Basic, Interpolator, Renderer, Frameless };
export {  // just for fun
    Basic as Easy,
    Interpolator as Normal,
    Renderer as Heroic,
    Sandbox as Legendary,
};
export type {
    RemoteElementDefinition,
    RemoteElementDefinitionOptions,
};
