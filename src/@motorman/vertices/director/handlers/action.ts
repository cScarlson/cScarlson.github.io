
import { channels as e } from '../channels';
import { Director } from '../director';


class Dependencies {}
class ActionHandlers {
    
    constructor(protected director: Director, protected $: Dependencies) {}
    
    // [ e['BACKDROP:REQUESTED'] ]() {}
    
}

export { ActionHandlers };
