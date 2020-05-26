
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
    
    [ e['USER:TOKEN:FOUND:LINKEDIN'] ](channel: string, token: string) {
        this.director.set('token', token);
        // this.director.emit(channel, token);  // mute token event
    }
    
}

export { ActionHandlers };
