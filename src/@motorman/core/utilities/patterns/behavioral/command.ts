
/**
 * @intention 
 * @usage 
 *  * var command = new Command(console, 'log');
 *  * command.execute('This gets logged by the console');
 */
class Command {
    private context: any = null;
    private action: string = '';
        
    constructor(context, action) {
        this.context = context;
        this.action = action;
    }
    
    execute(...splat: any[]) {
        var { context, action } = this;
        var value = context[action](...splat);
        return value;
    }
    
}

class StrictCommand extends Command {
    
    public execute = (...splat: any[]) => super.execute(...splat);
    
}

export { Command, StrictCommand };
