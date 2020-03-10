
import { Reactive as CommonSandbox } from '@motorman/core/sandbox';
import { Sandbox as CommonComponentSandbox } from '@motorman/vertices/sandbox';
import { Utilities } from '@motorman/core/utilities';
import { Director, ActionHandlers, StateHandlers, channels } from './director';

// class Dependencies {};  // mock
// var director = new Director({ channels, Dependencies, ActionHandlers, StateHandlers });

class Sandbox extends CommonSandbox {
    
}

class ServiceSandbox extends Sandbox {
    public http: any = { };
    
    constructor(utils: Utilities, director: Director) {
        super(director);
        return this;
    }
    
}

class ComponentSandbox extends CommonComponentSandbox {
    
    constructor(element: any, comm: any, director: Director) {
        super(element, comm, director);
        return this;
    }
    
}

export { Sandbox, ServiceSandbox, ComponentSandbox };
