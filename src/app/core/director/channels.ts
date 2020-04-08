
import { Channels as CommonChannels } from '@motorman/vertices/director';

class Channels extends CommonChannels {
    ['JOHN:WILL:LIKE:THIS:STRATEGY'] = 'app://preferred-by-john/this/strategy';
    ['SOMETHING:ELSE:HAPPENED'] = 'app://happened/something/else';
    ['ELEMENT:MUTATION:ATTRIBUTE:OBSERVED'] = 'v://observed/element/attribute/mutation';
}

var channels = new Channels();

export { Channels, channels };
