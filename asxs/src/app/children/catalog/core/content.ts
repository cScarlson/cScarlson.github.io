
import { Loop } from '@asxs/core';
import { Sandbox } from '@app/children/catalog//children/documentation/core/sandbox';
import { markdown, utilities } from '@asxs/core/utilities';
import { default as magazine } from './templates/magazine.template.html?raw';
import * as variables from '@asxs/variables/docs';
import * as buttons from '@asxs/button/docs';
import * as tooltip from '@asxs/tooltip/docs';
import * as popover from '@asxs/popover/docs';
import * as dialogs from '@asxs/dialog/docs';

const ID_VARIABLES = 'variables';
const ID_ICONS = 'icons';
const ID_BUTTONS = 'buttons';
const ID_TOOLTIP = 'tooltip';
const ID_POPOVER = 'popover';
const ID_DIALOGS = 'dialogs';
const ID_TOASTS = 'toasts';
const ID_QUICKVIEWS = 'quickviews';
const ID_ANTITAMPER = 'antitamper';
const docs_variables = utilities.interpolate( markdown.parse(variables.docs) )( new Sandbox(variables) );
const docs_buttons = utilities.interpolate( markdown.parse(buttons.docs) )( new Sandbox(buttons) );
const docs_tooltip = utilities.interpolate( markdown.parse(tooltip.docs) )( new Sandbox(tooltip) );
const docs_popover = utilities.interpolate( markdown.parse(popover.docs) )( new Sandbox(popover) );
const docs_dialogs = utilities.interpolate( markdown.parse(dialogs.docs) )( new Sandbox(dialogs) );

export const $docs = [
    {
        id: ID_VARIABLES,
        selected: true,
        docs: docs_variables,
        module: variables,
    },
    // {
    //     id: ID_ICONS,
    //     selected: true,
    // },
    {
        id: ID_BUTTONS,
        selected: true,
        docs: docs_buttons,
        module: variables,
    },
    {
        id: ID_TOOLTIP,
        selected: true,
        docs: docs_tooltip,
        module: tooltip,
    },
    {
        id: ID_POPOVER,
        selected: true,
        docs: docs_popover,
        module: popover,
    },
    {
        id: ID_DIALOGS,
        selected: true,
        docs: docs_dialogs,
        module: dialogs,
    },
    {
        id: ID_TOASTS,
        selected: true,
        docs: '...toasts...',
        module: variables,
    },
    {
        id: ID_QUICKVIEWS,
        selected: true,
        docs: '...quickviews...',
        module: variables,
    },
    {
        id: ID_ANTITAMPER,
        selected: true,
        docs: '...antitamper...',
        module: variables,
    },
].reduce( ($, catagory) => $.set(catagory.id, catagory), new Map() );
export const documentation = [ ...$docs.values() ];
export const menuitems = [ ...$docs.keys() ];

