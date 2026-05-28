
import { KEY_STATE } from '@asxs/core/constants';
import { utilities } from '@asxs/core/utilities';

const { log } = console;

export class Loop extends Array {
    template: string = '{MISSING CONTENT}';
    as: string = KEY_STATE;
    context: any = {};
    
    constructor(data: any[]) {
        if (typeof data === 'number') super(data);
        else super(...data);
    }
    
    with(template: string): Loop {
        this.template = template;
        return this;
    }
    
    use(context: any = {}, as: string = this.as): Loop {
        this.context = context;
        this.as = as;
        return this;
    }
    
    toString(): string {
        const { template, context, as } = this;
        const { [KEY_STATE]: state = context } = context;
        const reduce = (t, data, i) => {
            const scope = { [as]: state, ['as:loop']: this, ['as:index']: i };
            const details = Object.assign(data, scope);
            return utilities.interpolate(`${t}${template}`)(details);
        };
        
        return this.reduce(reduce, '');
    }
    
};
