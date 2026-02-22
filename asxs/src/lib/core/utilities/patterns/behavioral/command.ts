
export class Command {
    
    constructor(public receiver: any, public action: string) {}
    
    execute = (...splat: any[]) => {
        const { receiver, action } = this;
        return receiver[action](...action);
    };
    
}
