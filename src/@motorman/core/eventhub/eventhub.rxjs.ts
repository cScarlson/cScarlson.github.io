
// https://stackblitz.com/edit/rxjs-mediator-with-operators?file=index.ts
import { of, from } from 'rxjs';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, filter, last } from 'rxjs/operators';
//
import { ISubscriber } from '../subscriber.interface';
import { IEventAggregator } from '../eventaggregator.interface';

class EventHub implements IEventAggregator {
  private initializations: object = { errors: 0 };
  private initialized: CustomEvent = new CustomEvent('$initialized', { detail: this.initializations });
  public channels$: ReplaySubject<CustomEvent> = new ReplaySubject(1);

  in(channel: string): Observable<CustomEvent> {
    var filterChannel = filter( (o: CustomEvent) => channel === o.type )
      , mapData = map( (o: CustomEvent) => o )
      ;
    var subscription = this.channels$.pipe(filterChannel).pipe(mapData);

    return subscription;
  }
  
  publish(channel: string, data: any = {}, ...more: any[]): IEventAggregator {
    var event = new CustomEvent(channel, { detail: data });
    this.channels$.next(event);
    return this;
  }

  subscribe(channel: string, handler?: (data?: any) => {}): Observable<CustomEvent> {
    var subscription = this.in(channel);
    if (handler) subscription.subscribe(handler);
    return subscription;
  }

  unsubscribe(channel: string, handler: (data?: any) => {}): IEventAggregator {
    // this.channels$.unsubscribe();
    return this;
  }

  attach(observer: ISubscriber): Observable<CustomEvent> {
    var subscription = this.channels$;
    if (observer) subscription.subscribe(observer);
    return subscription;
  }
  
  detach(observer: ISubscriber) {
    // this.channels$.unsubscribe();
    return this;
  }

}

export { EventHub };
