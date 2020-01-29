
import { Element, attr, handler, message } from '@motorman/vertices';

@Element({ name: 'x-app', template: `` })
export class AppComponent {
    @attr() prop: string = '';
    
    constructor() {}
    
    @handler('click') handleClick(e: Event) {
        
    }
    @message('SOMETHING:HAPPENED') handleMessage(e: CustomEvent) {
        
    }
    
}
