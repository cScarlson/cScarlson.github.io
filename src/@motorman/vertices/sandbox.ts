
import { Sandbox as CommonSandbox } from '@motorman/core';
import { Director } from '@motorman/vertices/director';

class Sandbox extends CommonSandbox {
    
    constructor(public element: any, public comm: any, director: Director) {
        super(director);
    }
    
}

export { Sandbox };
