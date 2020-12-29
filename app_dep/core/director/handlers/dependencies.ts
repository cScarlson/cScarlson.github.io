
import { IDependencies as ICommonDependencies, Dependencies as CommonDependencies } from '@motorman/vertices/director/handlers';
import { Director } from '../director';

interface IDependencies extends ICommonDependencies {}

class Dependencies extends CommonDependencies {
    public stats: Console = console;

    constructor(Director: Director) {
        super(Director);
    }
}

export { IDependencies, Dependencies };
