
import { channels as e } from '../channels';
import { Director } from '../director';

class Dependencies {
    public stats: Console = console;

    constructor(private Director: Director) {}
}

class ActionHandlers {
    
    constructor(private director: Director, private $: Dependencies) {}
    
    [ e['JOHN:WILL:LIKE:THIS:STRATEGY'] ](channel: string, data: { id: number, datum: string }) {
        var { id, datum } = data;
        // if ({ '999': true }[ id ]) console.log('@ Director: Caught', data.id);
        this.director.set(datum, data);
        // this.director.emit(channel, data);
    }
    
}

export { ActionHandlers };
