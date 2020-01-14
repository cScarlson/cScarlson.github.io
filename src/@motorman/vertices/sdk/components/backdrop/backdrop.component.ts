
import { V } from '@motorman/vertices';
import { Sandbox } from '@motorman/core';

V('v-backdrop', class BackdropComponent {
    static observedAttributes: string[] = [ 'active', 'options' ];
    static template: string = '';
    private active: boolean = false;
    private options: any = { };
    ['$on:click']: Function = this.handleInteraction;
    
    constructor(private $: Sandbox) {
        $.in($.channels['BACKDROP:REQUESTED']).subscribe(this.handleRequest);
    }
    
    ['[options]'](val, old) {
        console.log('>', val, old);
    }
    
    handleInteraction(e: Event) {
        var { $ } = this;
        this.active = false;
        $.publish($.channels['BACKDROP:DISMISSED']);
    }
    
    public handleRequest = (e: CustomEvent) => {
        var { type, detail } = e;
        console.log('@ BackdropComponent', type, detail);
        this.active = true;
    };
    
});
