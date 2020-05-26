
import { Reactive as Store } from '@motorman/core/store';
import { Director } from '../director';
import { Dependencies } from './dependencies';

class StateHandlers {
    
    constructor(protected director: Director, protected $: Dependencies) {}

}

export { StateHandlers };
