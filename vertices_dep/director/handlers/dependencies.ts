
import { Director } from '../director';

interface IDependencies {}

class Dependencies implements IDependencies {
    public stats: Console = console;

    constructor(private Director: Director) {}
}

export { IDependencies, Dependencies };
