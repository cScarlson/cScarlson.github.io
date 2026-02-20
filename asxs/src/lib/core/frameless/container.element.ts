
import type { ToDo } from '@asxs/core/types';
import type { RemoteElementDefinition, RemoteElementDefinitionOptions } from '@asxs/core/element';
import { Frameless } from '@asxs/core/element';
import { customElement } from '@asxs/core/customelement';

const { log, warn, error: err } = console;

export const TAGNAME = 'as-red';
export @customElement(TAGNAME) class RemotelyDefinedElement extends HTMLElement {
    
    constructor(private red: RemoteElementDefinitionOptions) {
        super();
        const { meta, template, styles, script, attributes, contentDocument } = red;  // RED (Remote Element Definition) protocol
        const { attributes: { [0]: { value: tagName } } } = meta as HTMLMetaElement;
        const Class = customElements.get(tagName) as typeof Frameless;
        const element = new Class({ meta, template, styles, script, attributes, contentDocument });
        
        this.attachShadow({ mode: 'open' });
        // this.shadowRoot?.appendChild(styles);
        this.shadowRoot?.appendChild(element);
        // this.shadowRoot?.appendChild(script);
        log(`@CONTAINER#constructed`, red);
    }
    
    handleEvent(e: Event) {}
    
    connectedCallback() {
        log(`@CONTAINER#connected`);
    }
    
    disconnectedCallback() {}
    
};
