
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './calendar.component.html';

class CalendarMonth {
    protected cache: { previous: CalendarMonth, next: CalendarMonth } = { previous: null, next: null };
    public year: number = this.datetime.getFullYear();
    public month: number = this.datetime.getMonth();
    public length: number = CalendarMonth.getMonthLength(this.month, this.year);
    public days: Date[] = CalendarMonth.getDays(this.month, this.year);
    public padded: Date[] = [ ];
    public $dates: Map<number, Date> = new Map();
    get dates(): Date[] { return Array.from( this.$dates.values() ); }
    set dates(dates: Date[]) { this.$dates.clear(); dates.forEach( (d: Date) => this.$dates.set(+d, d) ); }
    get previous(): CalendarMonth { return this.cache.previous = this.getPrevious(); }
    get next(): CalendarMonth { return this.cache.next = this.getNext(); }
    
    constructor(public datetime: Date) {
        var { year, month } = this;
        var dates = CalendarMonth.getDates(month, year);
        var padded = this.pad(dates);
        
        this.dates = dates;
        this.padded = padded;
        
        return this;
    }
    
    static getMonthLength(month: number, year: number) {
        var isLeap = ((year % 4) === 0 && ((year % 100) !== 0 || (year % 400) === 0));
        var length = [ 31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][ month ];
        return length;
    }
    
    static getDays(month: number, year: number) {
        var length = this.getMonthLength(month, year), days = [ ];
        for (let i = 0; i < length; i++) days.push(i);
        return days;
    }
    
    static getDates(month: number, year: number) {
        var days = this.getDays(month, year), datetimes = days.map( (day: number) => new Date(year, month, day+1) );
        return datetimes;
    }
    
    private pad(dates: Date[]) {
        const INDEX_OFFSET = 1;
        var { length, year, month } = this;
        var first = dates[0]
          , last = dates[length - 1]
          , fDay = first.getDay()
          , lDay = last.getDay()
          , fDate = first.getDate()
          , lDate = last.getDate()
          , fOffset = (fDate - fDay)
          , lOffset = ( lDate + (6 - lDay) )
          ;
        var padded = [ ...dates ];
        
        // for (let p = fOffset; p < fDate; p++) console.log('<-UNSHIFT', p);
        // for (let f = lDate ; f < lOffset ; f++) console.log('PUSH->', f);
        for (let p = fOffset; p < fDate; p++) padded.unshift( new Date(year, month, p) );
        for (let f = lDate ; f < lOffset ; f++) padded.push( new Date(year, month, f+INDEX_OFFSET) );
        console.log('PADDING-->', fOffset, lOffset );
        
        return padded;
    }
    
    private getPrevious() {
        if (this.cache.previous) return this.cache.previous;
        var { year, month } = this;
        var datetime = new Date(year, month, 0), calendar = new CalendarMonth(datetime);
        return calendar;
    }
    
    private getNext() {
        if (this.cache.next) return this.cache.next;
        var { year, month } = this, month = (month + 2);
        var datetime = new Date(year, month, 0), calendar = new CalendarMonth(datetime);
        return calendar;
    }
    
}

var weekdatenames = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];

@ElementNode({ selector: 'app-calendar' })
class CalendarComponent {
    private weekdatenames: string[] = weekdatenames;
    private today: Date = new Date();
    private calendar: CalendarMonth = new CalendarMonth(this.today);
    private $calendars: Map<CalendarMonth, CalendarMonth> = new Map([ [this.calendar, this.calendar] ]);
    public selection: string = '';
    public multi: boolean = false;
    private $selections: Map<number, Date> = new Map();
    get selections(): Date[] { return Array.from( this.$selections.values() ); }
    set selections(selections: Date[]) { this.$selections.clear(); selections.sort( (a, b) => a >= b ? 1 : -1 ).forEach( (date) => this.$selections.set(+date, date) ); }
    get dates(): any { return this.calendar.padded; }
    get weekdates(): Date[] { return this.dates.slice(0, 7); }
    
    constructor(private $: IElementSandbox) {
        console.log('CALENDAR', $);
        $.state.set(this);
        $.content.set(template);
    }
    
    handleSearch(e: InputEvent) {
        console.log('search', (e.target as HTMLInputElement).value);
    }
    
    handleColumnSelection(e: Event, day: number) {
        // this.$.publish('CALENDAR:SELECTION:CHANGED', { type: 'specs', specs: [ { type: 'day', value: day } ] });
    }
    
    handleSelectionClear(e: Event) {
        this.$selections.clear();
        this.$.publish('CALENDAR:SELECTION:CHANGED', { $selections: this.$selections });
    }
    
    handleDateChange(e: CustomEvent) {
        var { $selections } = this;
        var { detail } = e;
        var { name, type, selected, date } = detail;
        var timestamp = +date;
        var payload = { name, type, selected, date, $selections };
        var action = {
           'true': () => $selections.set(timestamp, date),   // record
           'false': () => $selections.delete(timestamp),     // remove
        }[ selected ];
        
        if (action) action();
        this.selections = Array.from( $selections.values() );  // commit
        this.$.publish('CALENDAR:SELECTION:CHANGED', payload);
    }
    
}

export { CalendarComponent };
