
import { Loop } from '@asxs/core';
import { markdown, utilities } from '@asxs/core/utilities';
import { default as magazine } from './templates/magazine.template.html?raw';
import * as buttons from '@asxs/button/docs';
import * as tooltip from '@asxs/tooltip/docs';

class Sandbox extends Object {
    
    constructor(data: any) {
        super(data);
        Object.assign(this, data);
    }
    
    escape(html: string): string {
        return  markdown.escapeHTML(html);
    }
    
}

const docs_buttons = utilities.interpolate( markdown.parse(buttons.docs) )(new Sandbox({
    setup: buttons.setup,
    types: buttons.types,
    basic: buttons.basic,
    sizes: buttons.sizes,
    block: buttons.block,
    stateful: buttons.stateful,
}));
const markdown_tooltip = utilities.interpolate( markdown.parse(tooltip.docs) )(new Sandbox({
    setup: tooltip.setup,
    tooltip: tooltip.example,
}));

const documentation = new Loop([  // TODO: move all content to .md files
    // {
    //     id: 'variables',
    //     title: 'Variables',
    //     subtitle: '--{name}',
    //     tagline: 'CSS Variables',
    //     description: 'AsXS leverages OpenProps CSS so it is all automatically available to you. However, there are a few shortcut variables AsXS has set up that may give you a little extra lift.',
    //     selected: true,
    //     examples: [],
    //     children: new Loop([
    //         // {
    //         //     title: 'Colors',
    //         //     subtitle: '--color-{type}',
    //         //     tagline: '',
    //         //     description: '',
    //         //     children: [],
    //         //     examples: new Loop([
    //         //         { document: markdown_types },
    //         //         { document: markdown_basic },
    //         //         { document: markdown_sizes },
    //         //         { document: markdown_block },
    //         //     ]).with(example),
    //         // },
    //     ]).with(child),
    // },
    // {
    //     id: 'icons',
    //     title: 'Icons',
    //     subtitle: 'as-icon[type="{name}"][strategy="ascii|openvar"].size.{x}',
    //     tagline: '',
    //     description: '',
    //     selected: true,
    //     examples: [],
    //     children: new Loop([
    //         // {
    //         //     title: 'Basic',
    //         //     subtitle: 'style[is="as-css-import][target="buttons"]',
    //         //     tagline: '',
    //         //     description: '',
    //         //     children: [],
    //         //     examples: new Loop([
    //         //         { document: markdown_types },
    //         //         { document: markdown_basic },
    //         //         { document: markdown_sizes },
    //         //         { document: markdown_block },
    //         //     ]).with(example),
    //         // },
    //     ]).with(child),
    // },
    {
        id: 'buttons',
        title: 'Buttons',
        subtitle: '*[is="as-button"].color.{style}.size.{x}',
        tagline: '',
        description: '',
        selected: true,
        docs: docs_buttons,
    },
    {
        id: 'tooltips',
        title: 'Tooltips',
        subtitle: '* > as-tooltip[position="(block | inline)-(start | end)"][style="--delay: {n}ms"]',
        tagline: 'Tooltip popovers',
        description: 'Tooltips that appear for :hover, :focus, and :focus-within actions. ',
        selected: true,
        docs: markdown_tooltip,
    },
]).with(magazine);
const _menuitems = documentation.map( ({ id, title, subtitle, tagline, description }) => ({ id, title, subtitle, tagline, description }) );

export const menuitems = new Loop(_menuitems).with("...");
export {  documentation };

