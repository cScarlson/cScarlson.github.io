
import { Loop } from '@asxs/core';
import { Sandbox } from '@app/children/catalog//children/documentation/core/sandbox';
import { markdown, utilities } from '@asxs/core/utilities';
import { default as magazine } from './templates/magazine.template.html?raw';
import * as buttons from '@asxs/button/docs';
import * as tooltip from '@asxs/tooltip/docs';
import * as popover from '@asxs/popover/docs';

const docs_buttons = utilities.interpolate( markdown.parse(buttons.docs) )( new Sandbox(buttons) );
const markdown_tooltip = utilities.interpolate( markdown.parse(tooltip.docs) )( new Sandbox(tooltip) );
const markdown_popover = utilities.interpolate( markdown.parse(popover.docs) )( new Sandbox(popover) );
const documentation = new Loop([  // TODO: move all content to .md files
    // {
    //     id: 'variables',
    //     selected: true,
    // },
    // {
    //     id: 'icons',
    //     selected: true,
    // },
    {
        id: 'buttons',
        selected: true,
        docs: docs_buttons,
    },
    {
        id: 'tooltips',
        selected: true,
        docs: markdown_tooltip,
    },
    {
        id: 'popovers',
        selected: true,
        docs: markdown_popover,
    },
]).with(magazine);
const _menuitems = documentation.map( ({ id, title, subtitle, tagline, description }) => ({ id, title, subtitle, tagline, description }) );

export const menuitems = new Loop(_menuitems).with("...");
export {  documentation };

