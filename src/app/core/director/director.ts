
import { IDirectorOptions } from '@motorman/core/director';
import { Director as CommonDirector } from '@motorman/vertices/director';


class Director extends CommonDirector {
    
    constructor(settings: { id: string }, options: IDirectorOptions) {
        super(settings, options);
    }
    
}

export { Director };
