
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './calendar.component.html';

@ElementNode({ selector: 'app-calendar' })
class CalendarComponent {
    public date: Date = new Date();
    public selection: string = '';
    public multi: boolean = false;
    private start: Date;
    private end: Date;
    private $dates: Map<number, Date> = new Map();
    get dates(): Date[] { return Array.from( this.$dates.values() ); }
    set dates(dates: Date[]) { this.$dates.clear(); dates.sort( (a, b) => a >= b ? 1 : -1 ).forEach( (date) => this.$dates.set(+date, date) ); }
    
    a: Date = new Date(2020, 5, 2);
    b: Date = new Date(2020, 5, 3);
    c: Date = new Date(2020, 5, 4);
    d: Date = new Date(2020, 5, 5);
    e: Date = new Date(2020, 5, 6);
    
    constructor(private $: IElementSandbox) {
        console.log('CALENDAR', $);
        $.state.set(this);
        $.content.set(template);
    }
    
    handleSearch(e: InputEvent) {
        console.log('search', (e.target as HTMLInputElement).value);
    }
    
    handleSelectionClear(e: Event) {}
    
    handleDateChange(e: CustomEvent) {
        var { $dates } = this;
        var { detail } = e;
        var { name, type, selected, date } = detail;
        var timestamp = +date;
        var payload = { name, type, selected, date, $dates };
        var action = {
           'true': () => $dates.set(timestamp, date),   // record
           'false': () => $dates.delete(timestamp),     // remove
        }[ selected ];
        
        if (action) action();
        this.dates = Array.from( $dates.values() );  // commit
        this.$.publish('CALENDAR:SELECTION:CHANGED', payload);
    }
    
    handleDateChangeX(e: CustomEvent) {
        if (!e.detail.selected) this.start = this.end = this.start;
        var { start, end } = this;
        var { detail } = e;
        var { name, type, selected, date } = detail;
        var payload = { name, type, selected, date, start, end };
        
        if (!{ 'multi': true }[ type ]) start = end = date;
        
        if (!start) start = date;
        else end = date;
        if (start > end) (date = end), (end = start), (start = date);
        console.log('-->', type, '\n', 'start', start, '\n', 'end', end);
        
        this.start = start;
        this.end = end;
        // this.$.publish('CALENDAR:SELECTION:CHANGED', { ...payload, start, end });
        
        // // if (!start) start = date;
        // if (!!start && !!end) start = date;  // && end = null | date ?
        // if (!!start &&  !end) end = date;
        // if (start > end) (date = end), (end = start), (start = date);
        
        // // this.start = start;
        // // this.end = end;
        // // console.log('before...', '\n', this.start, '\n', this.end);
        // // // if (!start && !end) return this.handleDateChange(e);
        // // console.log('after...', '\n', this.start, '\n', this.end);
        
        // // console.log('DATE-CHANGE', type, detail, name, type, selected, date);
        // // this.$.publish('CALENDAR:SELECTION:CHANGED', detail);
        // // // this.$.target.dispatchEvent( new CustomEvent('selection', { detail: {} }) );
    }
    
}

export { CalendarComponent };
