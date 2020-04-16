
import { IEventAggregator } from '@motorman/core/eventaggregator.interface';

interface ISandbox extends IEventAggregator {
    publish(channel: string, data?: any, ...more: any[]): ISandbox;
    subscribe(channel: string, handler: Function): ISandbox;
    unsubscribe(channel: string, handler: Function): ISandbox;
}

export { ISandbox };
