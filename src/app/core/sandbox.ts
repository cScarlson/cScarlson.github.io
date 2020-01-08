
import { Reactive as CommonSandbox } from '@motorman/core/sandbox';
import { Utilities } from '@motorman/core/utilities';
import { Director, ActionHandlers, StateHandlers, channels } from './director';

class Dependencies {};  // mock
var director = new Director({ channels, Dependencies, ActionHandlers, StateHandlers });

class Sandbox extends CommonSandbox {}

class ServiceSandbox extends Sandbox {
    public http: any = { };
    
    constructor(utils: Utilities) {
        super(director);
    }
    
}

class ComponentSandbox extends Sandbox {
    
    constructor(private element: HTMLElement) {
        super(director);
        return this;
    }
    
}

export { Sandbox, ServiceSandbox, ComponentSandbox };
