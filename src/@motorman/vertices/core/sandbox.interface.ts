
import { ISandbox as ICommonSandbox } from '@motorman/core';
import { Subject } from '@motorman/core/utilities/patterns/behavioral';

interface ISandbox extends ICommonSandbox {
    // content?: Subject;
    // setState?(state: any): ISandbox;
    // bootstrap?(root: Node): any;
}

export { ISandbox };
