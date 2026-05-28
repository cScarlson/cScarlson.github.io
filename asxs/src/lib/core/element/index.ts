
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
        // log(`@connectedCallback`, this.tagName);
        this.root = this.createRenderRoot();
    }
    
    disconnectedCallback() {
        // delete (this as ToDo).root;
    }
    
    adoptedCallback() {}
    
    connectedMoveCallback() {}
    
    attributeChangedCallback(name: string, old: string, val: string) {
        if (`attr:${name}` in this) this[`attr:${name}`](val, old);
    }
    
    createRenderRoot(): ShadowRoot | HTMLElement {
        // log(`@createRenderRoot`, this.tagName);
        if (this.root) return this.root;
        if (this.shadowRoot) return this.shadowRoot;
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
    
    disconnectedCallback(): void {
        this.innerHTML = '';  // clear to prevent descendant custom elements from running again before next update/render
    }
    
    render(): string {
        return this.innerHTML;
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

class CustomElement extends Renderer {}

class PageElement extends CustomElement {}

export { customElement } from './customelement';
export { Loop } from './loop';
export { QUERY_HANDLER, ElementCrawler } from './elementcrawler';
export { PageElement, CustomElement, Basic, Interpolator, Renderer, Frameless };
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
