
export interface Connectable {
    connect(target: HTMLElement, options?: MutationObserverInit): any;
    disconnect(): any;
};
