
import { Director as CommonDirector } from '@motorman/core';
import { IDirectorOptions } from '@motorman/core/director';

class Director extends CommonDirector {
    
    constructor(settings: { id: string }, options: IDirectorOptions) {
        super(settings, options);
    }
    
}

export { Director };
