
import type { ToDo } from '@asxs/core/types';
import type { RemoteElementDefinitionOptions } from '@asxs/core/element';
import { customElement } from '@asxs/core/customelement';
import { Frameless } from '@asxs/core/element';
import { utilities } from '@asxs/core/utilities';

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
        
        this.attachShadow({ mode: 'open' });
        if (defined) return this['compose:webcomponent'](red, frame);  // return this
        if (handle) return handle.call(this, red, frame) as RemotelyDefinedElement;  // return this
    }
    
    ['compose:webcomponent'](red: RemoteElementDefinitionOptions, frame: HTMLIFrameElement) {  // <meta name="{tagName}" />
        const { meta, template, styles, script, attributes, contentDocument } = red;  // RED (Remote Element Definition) protocol
        const { attributes: attrs } = meta as HTMLMetaElement;
        const { [0]: attr } = attrs;
        const { value: tagName } = attr;
        const { innerHTML: content, parentElement } = frame;
        const nodes = parentElement?.matches(WRAPPER_TAGNAME) ? Array.from(parentElement.childNodes) : [];
        const slotted = nodes.filter(child => child !== frame);
        const Class = customElements.get(tagName) as typeof Frameless;
        const element = new Class({ meta, template, styles, script, attributes, contentDocument });
        
        element.innerHTML = content;  // weakly-slotted content
        for (const child of slotted) element.appendChild(child);  // strongly-slotted content
        this.shadowRoot?.appendChild(element);
        
        return this;
    }
    
    ['compose:partial'](red: RemoteElementDefinitionOptions, frame: HTMLIFrameElement) {  // <meta name="partial" />
        const { meta, template, styles, script, attributes, contentDocument } = red;  // RED (Remote Element Definition) protocol
        const { type } = script;
        
        if (type === 'application/json') this['compose:partial:json'](script, template);
        this.shadowRoot?.appendChild(styles);
        this.shadowRoot?.appendChild(template.content);
        this.shadowRoot?.appendChild(script);
        return this;
    }
    
    ['compose:partial:json'](script: HTMLScriptElement, template: HTMLTemplateElement) {
        const { innerHTML: json } = script;
        const { innerHTML } = template;
        const data = JSON.parse(json);
        
        template.innerHTML = utilities.interpolate(innerHTML)(data);
    }
    
    handleEvent(e: Event) {}
    
    connectedCallback() {}
    
    disconnectedCallback() {}
    
};
