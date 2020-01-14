
import { ActionHandlers as CommonHandlers } from '@motorman/vertices/director';
import { channels as e } from '../channels';
import { Director } from '../director';

class Dependencies {
    public stats: Console = console;

    constructor(private Director: Director) {}
}

class ActionHandlers extends CommonHandlers {
    
    constructor(director: Director, $: Dependencies) {
        super(director, $);
    }
    
    [ e['JOHN:WILL:LIKE:THIS:STRATEGY'] ](channel: string, data: { id: number, datum: string }) {
        var { id, datum } = data;
        if ({ '999': true }[ id ]) console.log('@ Director: Caught', data.id);
        this.director.set(datum, data);
        this.director.emit(channel, data);
    }
    
}

export { ActionHandlers };
