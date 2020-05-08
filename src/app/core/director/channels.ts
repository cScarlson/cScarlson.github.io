
import { Channels as CommonChannels } from '@motorman/vertices/director';

class Channels extends CommonChannels {
    ['JOHN:WILL:LIKE:THIS:STRATEGY'] = 'app://preferred-by-john/this/strategy';
    ['SOMETHING:ELSE:HAPPENED'] = 'app://happened/something/else';
    ['MENU:REQUESTED'] = 'app://requested/main/menu';
    ['MENU:DISMISSED'] = 'app://dismissed/main/menu';
}

var channels = new Channels();

export { Channels, channels };
