
import { Sandbox as CommonSandbox } from '@motorman/vertices/core';
import { NodeSandbox } from '@motorman/vertices/core';

interface IElementSandbox extends NodeSandbox {
    node: Element;
    target: Element;
}
interface IAttributeSandbox extends CommonSandbox {
    node: Attr;
    target: Element;
}

class Sandbox extends CommonSandbox {}

export { Sandbox, IElementSandbox, IAttributeSandbox };
export {}
