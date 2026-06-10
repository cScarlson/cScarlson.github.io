
Reducer
================


## Usage
### `~/src/app/core/store/reducer.ts`
```typescript
import { type Action, Reducer as Core } from '@asxs/core/store';
import { State } from '@app/core/store';

export const reducer: Reducer<State> = new (class Reducer extends Core {
    
    ['some:action:type'](state: State, action: Action): State {
        const { payload } = action;
        const { datum } = payload;
        return { ...state, datum };
    }
    
})();
```

### `~/src/app/core/mediator.ts`
```typescript
import { reducer, Store, State } from '@app/core/store';

const state: State = new State({ unitialized: true });

export const director: Mediator = new (class Mediator {
    #store: Store<State> = new Store(state, reducer);
    
    constructor() {
        this.#store.dispatch({ type: 'some:action:type', payload: { datum: true } });
    }
    
})();
```

### Reactive Web Storage (Advanced)
#### `~/src/app/core/store/reducer.ts`
```typescript
import { type Action, Reducer as Core } from '@asxs/core/store';
import { State } from '@app/core/store';

export const reducer: Reducer<State> = new (class Reducer extends Core {
    
    execute = (state: State, action: Action) => {
        const { storage } = sessionStorage;  // aquire persisted data
        const initial = JSON.parse(storage);
        const result = super.execute({ ...state, ...initial }, action);  // get result of current data & persisted combined
        const persisted = JSON.stringify(result);
        
        sessionStorage.setItem('storage', presisted);  // repersist final result
        
        return result;
    };
    
})();
```
