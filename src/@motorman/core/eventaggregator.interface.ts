
interface IEventAggregator {
    publish(channel: string, data?: any, ...more: any[]): IEventAggregator;
    subscribe(channel: string, handler: Function): IEventAggregator|any;
    unsubscribe(channel: string, handler: Function): IEventAggregator;
}

export { IEventAggregator };
