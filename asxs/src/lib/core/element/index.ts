
import type { ToDo } from '@asxs/core/types';
import { utilities } from '@asxs/core/utilities';

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
    protected __meta__: string = '';
    protected __html__: string = '';
    protected __styles__: string = '';
    protected __script__: string = '';
    
    compose(html: string, styles: string) {
        const template = `<style>${styles}</style>\n${html}`;
        super.update(template);
    }
    
}

class CustomElement extends Renderer {}

export { CustomElement, Basic };
