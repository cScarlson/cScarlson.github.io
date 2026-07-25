```
        ┌────────────────────────────────────────────────────────────────┐
        │                              CELBus                            │─────┐
        ├────────────────────────────────────────────────────────────────┤     │
        │ + subscribe(channel: string, handle: Listener): CELBus         │     │
        │ + unsubscribe(channel: string, handle: Listener): CELBus       │     │
        │ + publish(channel: string, data?: any): CELBus                 │     │
        │     └▸ ['SOME:CHANNEL:INTERJECTED'](channel data)              │     │
        │ + ['SOME:CHANNEL:INTERJECTED'](channel: string, id: string)    │     │
        │     └▸ data = api.get(id)                                      │     │
        │     └▸ this.dispatch(channel, data)                            │     │
        └────────────────────────────────────────────────────────────────┘     │
                                                                               │
                                                                               │
        ┌────────────────────────────────────────────────────────────────┐     │
        │                 Module (Publisher/Subscriber)                  │     │
        ├────────────────────────────────────────────────────────────────┤     │
        │ - bus: CELBus                                                  ♦─────┘
        ├────────────────────────────────────────────────────────────────┤
        │ + constructor(): Module                                        │
        │     └▸ bus.subscribe(channel, this.handleData)                 │
        │ + handleId(event: InputEvent): void                            │
        │     └▸ bus.publish('SOME:CHANNEL:INTERJECTED', id)             │
        │ + handleData(event: MessageEvent): void                        │
        │     └▸ record = event.data                                     │
        └────────────────────────────────────────────────────────────────┘
```