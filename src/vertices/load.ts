
interface IModuleDetails {
    e: CustomEvent<unknown>;
    src: string;
    more: Element[];
    slots: HTMLSlotElement[];
    $slots: Map<string, HTMLSlotElement>;
    module: Element;
    script: HTMLScriptElement;
    children: Node[];
    contents: string;
}

class LIFECYCLE_EVENTS {
    static onmount = 'vertex:mount';
}

function load(module?: Element, ...more: Element[]): Promise<IModuleDetails> {
    if (!module) return Promise.reject(module);
    const { childNodes } = module;
    const e = new CustomEvent(LIFECYCLE_EVENTS.onmount, { detail: true });  // detail should be more useful.
    const src = module.getAttribute('src');  // access as attribute, not property.
    const $slots = new Map();
    const children = [ ...childNodes ];
    const promise = Promise.resolve({ e, src, more, slots: [ ], $slots, module, script: null, children, contents: '' })
        .then(get)
        .then(inject)
        .then(query)
        .then(reduce)
        .then(project)
        .then(activate)  // notifications are unnecessary before this point.
        .then(notify)
        .then(recur)
        .then(proceed)
        ;
    return promise;
}

function get(details: IModuleDetails): Promise<IModuleDetails> {
    const pResponse = fetch(details.src, { cache: 'force-cache' })
        , pContents = pResponse.then( response => response.text() )
        , pResult = pContents.then( contents => ({ ...details, contents }) )
        ;
    return pResult;
}

function inject(details: IModuleDetails): IModuleDetails {
    const { module, contents } = details;
    module.innerHTML = contents;
    return details;
}

function query(details: IModuleDetails): IModuleDetails {
    const { module } = details;
    const slots = [ ...module.querySelectorAll('slot') ];
    return { ...details, slots };
}

function reduce(details: IModuleDetails): IModuleDetails {
    var { $slots, slots } = details;
    var $slots = slots.reduce( ($, slot) => $.set(slot.name || '', slot), $slots );
    return { ...details, $slots };
}

function notify(details: IModuleDetails): IModuleDetails {
    const { e, module } = details;
    module.dispatchEvent(e);
    return details;
}

function recur(details: IModuleDetails): Promise<IModuleDetails> {
    const { module } = details;
    var modules: any = module.querySelectorAll('module')
      , modules: any = [ ...modules ]
      ;
    return load(...modules);
}

function project(details: IModuleDetails): IModuleDetails {
    var { $slots, children } = details;
    var $slots = append($slots, ...children)
    return { ...details, $slots };
}

function append($slots: Map<string, HTMLSlotElement>, node?: Node|any, ...more: Node[]): Map<string, HTMLSlotElement> {
    if (!$slots.size) return $slots;
    if (!node) return $slots;
    const { slot: key = '' } = node;
    const slot = $slots.get(key);
    const has = $slots.has(key);
    
    if (has) slot.appendChild(node);
    if (more.length) return append($slots, ...more);
    return $slots;
}

function activate(details: IModuleDetails): IModuleDetails {
    const { module } = details;
    const script = module.querySelector('script');
    const clone = document.createElement('script');
    
    clone.type = script.type;
    script.replaceWith(clone);
    clone.innerHTML = script.innerHTML;
    
    return { ...details, script: clone };
}

function proceed(details: IModuleDetails): Promise<IModuleDetails> {
    const { more } = details;
    const promise = load(...more);
    return promise;
}

export { load };
