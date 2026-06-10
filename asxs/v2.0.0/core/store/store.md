
Reducer
================


## Usage
> _`Store extends Subject` from The Observer Pattern from `@asxs/core/utilities/patterns/behavioral/observer.ts`._
### `~/src/app/core/mediator.ts`
```typescript
import { reducer, Store, State } from '@app/core/store';

const state: State = new State({ unitialized: true });

export const director: Mediator = new (class Mediator {
    #store: Store<State> = new Store(state, reducer);
    
    constructor() {
        this.#store.attach(this);  // does not run upon attachment
        this.#store.attach(this.#handleStateChange, true);  // runs upon attachment
        this.#store.dispatch({ type: 'some:action:type', payload: { datum: true } });
        this.#store.detach(this);
        this.#store.detach(this.#handleStateChange, true);
    }
    
    #handleStateChange(this: State) {
        // 1st run: > { unitialized: true }
        // 2nd run: > { unitialized: true, datum: true }
    }
    
    call(state: State) {
        // 1st run: > { unitialized: true, datum: true }
    }
    
})();
```
> _Attaches multiple `Observer`s._

> _Implements the "`notify`" flag (`arguments[1]`) on the `attach` method to trigger the observer's invocation upon registration._

> _Calls `detach` method for teardown._
