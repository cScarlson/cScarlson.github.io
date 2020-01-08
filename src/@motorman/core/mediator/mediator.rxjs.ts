
import { IEventAggregator } from '../eventaggregator.interface';
import { Reactive as EventHub } from '../eventhub';


class Mediator extends EventHub implements IEventAggregator {
    private publishers: any = { };
    private context: any = this;
    
    constructor() {
        super();
    }
    
    private registerPublishers(handlers: any) {
        this.publishers = handlers;
        return this;
    }
    protected register(type: 'publishers', handlers: any) {
        var action = { 'publishers': 'registerPublishers' }[ type ];
        this[action](handlers);
        return this;
    }
  
    protected dispatch(channel: string, data?: any, ...more: any[]) {
      super.publish.call(this, channel, data, ...more);
      return this;
    }
    
    publish(channel: string, data?: any, ...more: any[]) {
        var { publishers } = this;
        if (!channel) console.warn(`Mediator.publish expected a channel-value but got "${channel}". Please check the spelling of your channel-key.`);
        if (channel in publishers) publishers[channel].call(publishers, channel, data, ...more);
        else this.dispatch.call(this, channel, data, ...more);
        
        return this;
    }
    
}

export { Mediator };
