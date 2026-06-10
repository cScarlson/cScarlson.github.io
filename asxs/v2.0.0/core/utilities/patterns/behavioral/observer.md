
The Observer Pattern
================================================================

## Deviations
- ~~`observer.update(state)`~~ --> `observer.call(state)`: allows `Function`s to be normalized with object that have a `call` method.

## Usage
```typescript
import { type Observer, Subject } from '@asxs/core/utilities/patterns/behavioral';

const subject: Subject<any> = new Subject({ initial: 'data' });
const observer0: Observer<any> = { call(state: any) {} };  // object with "call" method
const observer1: Observer<any> = (this: any) => {};  // [Function] object with "call" method

subject.undefined;  // > { initial: 'data' }
subject.state;  // > { initial: 'data' }
subject.attach(observer0, true);  // invoke upon registration
subject.attach(observer1);
subject.notify({ some: 'state' });
subject.detach(observer0, true);  // teardown
subject.detach(observer1);  // teardown
```

## Advanced
Controlling which datum the Subject uses for `state`
```typescript
import { type Observer, Subject } from '@asxs/core/utilities/patterns/behavioral';

const subject = new (class MySubject extends Subject {
    myStateProperty: any = {};
})({ initial: 'data' }, 'myStateProperty');

subject.undefined;  // > { initial: 'data' }
subject.state;  // > { initial: 'data' }
subject.myStateProperty;  // > { initial: 'data' }
```
> _An optional, 2nd argument (`key`) can be sent into the constructor to tell Subject what property to use for its state._

> _Omitting the `key` sets a property "`undefined`" equal to the initial data._

> _Subject maintains a getter for `state` which simply points to `return this[this.key]`._
