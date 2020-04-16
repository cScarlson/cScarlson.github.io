
import { IEventAggregator } from '../eventaggregator.interface';
import { IDirectorOptions } from './options.interface';
import { Reactive as Store } from '../store';
import { Utilities } from '../utilities';


class Director extends Store implements IEventAggregator {
    private dependencies: IDirectorOptions;
    private actionHandlers: any;
    private stateHandlers: any;
    public utils: Utilities = new Utilities();
    public channels: any;

    constructor(options: IDirectorOptions) {
        super({ id: 'app' });
        var { channels, ActionHandlers, StateHandlers, Dependencies } = options;
        var dependencies = new Dependencies(this);
        var actionHandlers = new ActionHandlers(this, dependencies)
          , stateHandlers = new StateHandlers(this, dependencies)
          ;
        
        this.channels = channels;
        this.dependencies = dependencies;
        this.actionHandlers = actionHandlers;
        this.stateHandlers = stateHandlers;
        this.register('publishers', actionHandlers);
        this.attach({ next: this.handleState });
    }

    private handleState = (e: CustomEvent) => {
        var { type, detail } = e;
        var { stateHandlers: handlers } = this;
        var action = handlers[type];

        if (action) action.call(handlers, e);
        // else setTimeout( () => console.log('@ OBSERVED STATE', type, detail), (1000 * 10) );
    };

    emit(channel: string, data?: any, ...more: any[]) {
        this.dispatch(channel, data, ...more);
        return this;
    }

}

export { Director };
