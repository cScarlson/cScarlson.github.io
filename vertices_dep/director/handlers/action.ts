
import { channels as e } from '../channels';
import { Director } from '../director';


class Dependencies {}
class ActionHandlers {
    
    constructor(protected director: Director, protected $: Dependencies) {}
    
    [ e['BACKDROP:INSPECTED'] ](channel: string, request: any) {
        var { id } = request;
        console.log('V:Director; modal dismissed', id, request);
        if ({ 'some:nondismissable:ui': true }[ id ]) return;
        this.director.emit(channel, request);
        this.director.publish(e['BACKDROP:DISMISSED'], request);
        this.director.publish(e['MODAL:DISMISSED'], request);
    }
    
}

export { ActionHandlers };
