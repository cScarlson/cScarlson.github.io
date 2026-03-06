
import { Sandbox } from '@app/children/catalog//children/documentation/core/sandbox';
import { markdown, utilities } from '@asxs/core/utilities';
import * as variables from '@asxs/variables/docs';
import * as buttons from '@asxs/button/docs';
import * as tooltip from '@asxs/tooltip/docs';
import * as popover from '@asxs/popover/docs';
import * as dialogs from '@asxs/dialog/docs';
import * as toast from '@asxs/dialog/toast/docs';
import * as quickviews from '@asxs/dialog/quickview/docs';
import * as antitamper from '@asxs/dialog/antitamper/docs';

const { log } = console;
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
const docs_toast = utilities.interpolate( markdown.parse(toast.docs) )( new Sandbox(toast) );
const docs_quickviews = utilities.interpolate( markdown.parse(quickviews.docs) )( new Sandbox(quickviews) );
const docs_antitamper = utilities.interpolate( markdown.parse(antitamper.docs) )( new Sandbox(antitamper) );

export const $docs = [
    {
        id: ID_VARIABLES,
        selected: true,
        docs: docs_variables,
        module: variables,
    },
    {
        id: ID_ICONS,
        selected: true,
        docs: 'ToDo',
        module: {},
    },
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
        docs: docs_toast,
        module: toast,
    },
    {
        id: ID_QUICKVIEWS,
        selected: true,
        docs: docs_quickviews,
        module: docs_quickviews,
    },
    {
        id: ID_ANTITAMPER,
        selected: true,
        docs: docs_antitamper,
        module: antitamper,
    },
].reduce( ($, catagory) => $.set(catagory.id, catagory), new Map() );
export const documentation = [ ...$docs.values() ];
export const menuitems = [ ...$docs.keys() ];

