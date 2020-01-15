
import { Element, attr, handler, message } from '@motorman/vertices';

@Element({ name: 'x-app', template: ``, templateUrl: './app.component.html', lazy: true })
export class AppComponent {
    @attr() prop: string = '';
    
    constructor() {}
    
    @handler('click') handleClick(e: Event) {
        
    }
    @message('SOMETHING:HAPPENED') handleMessage(e: CustomEvent) {
        
    }
    
}
