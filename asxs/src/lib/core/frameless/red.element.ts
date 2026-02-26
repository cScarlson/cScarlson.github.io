
import type { ToDo } from '@asxs/core/types';
import type { RemoteElementDefinitionOptions } from '@asxs/core/element';
import { customElement } from '@asxs/core';
import { Frameless } from '@asxs/core/element';
import { utilities } from '@asxs/core/utilities';

const { log, warn, error: err } = console;
const WRAPPER_TAGNAME = 'as-frameless-slots';

export const TAGNAME = 'as-red';
export @customElement(TAGNAME) class RemotelyDefinedElement extends HTMLElement {
    
    constructor(red: RemoteElementDefinitionOptions) {
        super();
        const { meta, frame } = red;  // RED (Remote Element Definition) protocol
        const { attributes: attrs } = meta as HTMLMetaElement;
        const { [0]: attr } = attrs;
        const { value: tagName } = attr;
        const { [`compose:${tagName}`]: handle } = this as ToDo;
        const Class = customElements.get(tagName) as typeof Frameless;
        const defined = !!Class;
        
        this.attachShadow({ mode: 'open' });
        if (defined) return this['compose:webcomponent'](red);  // return this
        if (handle) return handle.call(this, red, frame) as RemotelyDefinedElement;  // return this
    }
    
    ['compose:webcomponent'](red: RemoteElementDefinitionOptions) {  // <meta name="{tagName}" />
        const { meta, template, styles, script, attributes, contentDocument, frame } = red;  // RED (Remote Element Definition) protocol
        const { attributes: attrs } = meta as HTMLMetaElement;
        const { [0]: attr } = attrs;
        const { value: tagName } = attr;
        const { innerHTML: content, parentElement } = frame;
        const nodes = parentElement?.matches(WRAPPER_TAGNAME) ? Array.from(parentElement.childNodes) : [];
        const slotted = nodes.filter(child => child !== frame);
        const Class = customElements.get(tagName) as typeof Frameless;
        const element = new Class(red);
        
        element.innerHTML = content;  // weakly-slotted content
        for (const child of slotted) element.appendChild(child);  // strongly-slotted content
        this.shadowRoot?.appendChild(element);
        
        return this;
    }
    
    ['compose:partial'](red: RemoteElementDefinitionOptions) {  // <meta name="partial" />
        const { meta, template, styles, script, attributes, contentDocument, frame } = red;  // RED (Remote Element Definition) protocol
        const { type } = script;
        
        if (type === 'application/json') this['compose:partial:json'](red);
        this.shadowRoot?.appendChild(styles);
        this.shadowRoot?.appendChild(template.content);
        
        return this;
    }
    
    ['compose:partial:json'](red: RemoteElementDefinitionOptions) {
        const { meta, template, styles, script } = red;  // RED (Remote Element Definition) protocol
        const { innerHTML: json } = script;
        const { innerHTML } = template;
        const { innerHTML: css } = styles;
        const data = JSON.parse(json);
        
        styles.innerHTML = utilities.interpolate(css)(data);
        template.innerHTML = utilities.interpolate(innerHTML)(data);
    }
    
    handleEvent(e: Event) {}
    
    connectedCallback() {}
    
    disconnectedCallback() {}
    
};
