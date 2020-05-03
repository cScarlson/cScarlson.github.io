
import { Sandbox as CommonSandbox } from '@motorman/vertices/core';

interface IElementSandbox extends CommonSandbox {
    node: Element;
}
interface IAttributeSandbox extends CommonSandbox {
    node: Attr;
}

class Sandbox extends CommonSandbox {}

export { Sandbox, IElementSandbox, IAttributeSandbox };
