
import type { ToDo } from '@asxs/core/types';
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

const { log } = console;

class Basic extends HTMLElement {
    static observedAttributes: string[] = [];
    protected root: ShadowRoot | HTMLElement = this.shadowRoot!;
    
    createRenderRoot(): ShadowRoot | HTMLElement {
        return this.attachShadow({ mode: 'open' });
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
    
    update(content: string) {
        const { root } = this;
        root.innerHTML = content;
    }
    
}

class Interpolator extends Basic {
    get __state__(): any { return {} }
    
    update(template: string, state: any = this.__state__): void {
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
