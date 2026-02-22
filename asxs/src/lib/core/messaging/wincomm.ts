

const { log } = console;
const SOURCE = 'cScarlson@github';
const STREAM_UP = 'up';
const STREAM_DOWN = 'down';

export class Wincomm {
    medium = new EventTarget();
    
    constructor({ }) {
        window.addEventListener('message', this.handleMessage, true);
    }
    
    handleMessage = (e) => {
        if (e.data.source !== SOURCE) return;// log(`@Window.onmessage: source: "${e.data.source}"`);
        const { type, data = {} } = e;
        const { source, channel, payload, stream } = data;
        const event = new MessageEvent(channel, { data: payload });
        const propagate = {
            [STREAM_UP]: this.upstream,
            [STREAM_DOWN]: this.downstream,
        }[ stream ];
        
        this.medium.dispatchEvent(event);
        if (propagate) propagate.call(this, channel, payload);
    };
    
    upstream(channel, payload) {
        const { parent } = window;
        if (window.parent !== window) parent.postMessage({ source: SOURCE, channel, payload, stream: STREAM_UP });
        return this;
    }
    
    downstream(channel, payload) {
        const { frames: children } = window;
        for (let i = 0, len = children.length; i < len; i++) children[i].postMessage({ source: SOURCE, channel, payload, stream: STREAM_DOWN });
        return this;
    }
    
    subscribe(channel, handler) {
        this.medium.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {
        this.medium.removeEventListener(channel, handler, true);
        return this;
    }
    
};
