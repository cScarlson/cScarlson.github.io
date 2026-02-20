
import type { ToDo } from '@asxs/core/types';
import type { RemoteElementDefinitionOptions } from '@asxs/core/element';
import { Frameless } from '@asxs/core/element';
import { customElement } from '@asxs/core/customelement';

const { log, warn, error: err } = console;
const WRAPPER_TAGNAME = 'as-frameless-slots';

export const TAGNAME = 'as-red';
export @customElement(TAGNAME) class RemotelyDefinedElement extends HTMLElement {
    
    constructor(red: RemoteElementDefinitionOptions, frame: HTMLIFrameElement) {
        super();
        const { meta } = red;  // RED (Remote Element Definition) protocol
        const { attributes: attrs } = meta as HTMLMetaElement;
        const { [0]: attr } = attrs;
        const { value: tagName } = attr;
        const { [`compose:${tagName}`]: handle } = this as ToDo;
        const Class = customElements.get(tagName) as typeof Frameless;
        const defined = !!Class;
        
        if (defined) return this['compose:webcomponent'](red, frame);
        if (handle) return handle.call(this, red, frame) as RemotelyDefinedElement;
    }
    
    ['compose:webcomponent'](red: RemoteElementDefinitionOptions, frame: HTMLIFrameElement) {
        const { meta, template, styles, script, attributes, contentDocument } = red;  // RED (Remote Element Definition) protocol
        const { attributes: attrs } = meta as HTMLMetaElement;
        const { [0]: attr } = attrs;
        const { value: tagName } = attr;
        const { innerHTML: content, parentElement } = frame;
        const nodes = parentElement?.matches(WRAPPER_TAGNAME) ? Array.from(parentElement.childNodes) : [];
        const slotted = nodes.filter(child => child !== this);
        const Class = customElements.get(tagName) as typeof Frameless;
        const element = new Class({ meta, template, styles, script, attributes, contentDocument });
        
        element.innerHTML = content;  // weakly-slotted content
        for (const child of slotted) element.appendChild(child);  // strongly-slotted content
        this.attachShadow({ mode: 'open' });
        this.shadowRoot?.appendChild(element);
        
        return this;
    }
    
    ['compose:static'](red: RemoteElementDefinitionOptions, frame: HTMLIFrameElement) {  // <meta name="static" />
        warn(`Static RED HMTL is not implemented yet`);
    }
    
    handleEvent(e: Event) {}
    
    connectedCallback() {}
    
    disconnectedCallback() {}
    
};
