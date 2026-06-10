
export class Command {
    receiver = {};
    action = '';
    
    constructor(receiver, action) {
        this.receiver = receiver;
        this.action = action;
    }
    
    execute = (...splat) => {
        const { receiver, action } = this;
        return receiver[action](...action);
    };
    
}
