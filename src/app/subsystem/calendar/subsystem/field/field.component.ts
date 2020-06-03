
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './field.component.html';

var booleans = { 'true': true, 'false': false, 'undefined': false, 'null': false, '': false };

enum weekdays {
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
}
type TType = undefined|string|''|'exact'|'multi'|'range'|'discrete';

@ElementNode({ selector: 'app-calendar-field' })
class FieldComponent {
    private host: Element = this.$.target;
    public name: string = this.host.getAttribute('name');
    public get selected(): boolean { return booleans[ this.host.getAttribute('selected') ]; }
    public set selected(checked: boolean) { this.host.setAttribute('selected', booleans[ ''+checked ] ); }
    public get type(): TType { return this.host.getAttribute('type'); }
    public set type(type: TType) { this.host.setAttribute('type', type); }
    public get date(): Date { return new Date( this.host.getAttribute('date') ); }
    public set date(date: Date) { this.host.setAttribute('date', ''+date); }
    public get checked(): string { return { 'true': 'checked', 'false': '' }[ ''+this.selected ]; }
    public get monthday(): number { return this.date.getDate(); }
    public get weekday(): string { return weekdays[ this.date.getDay() ]; }
    public types: any = { '': 'radio', 'exact': 'radio', 'multi': 'checkbox', 'range': 'checkbox' };
    
    constructor(private $: IElementSandbox) {
        var { name, selected, type, date } = this;
        var uuid = $.utils.uuid();
        
        this.name = { 'null': uuid, 'undefined': uuid, '': uuid }[ name ] || name;
        this.type = type || { 'null': '', 'undefined': '', '': ''  }[ type ];
        console.log('a', selected, date);
        this.selected = selected;
        console.log('b', this.selected);
        $.state.set(this);
        $.content.set(template);
        $.subscribe('CALENDAR:SELECTION:CHANGED', this.handleSelection);
    }
    
    handleChange(e: InputEvent) {
        var { host, type, name, date } = this;
        var { target } = e, control = <HTMLInputElement>target;
        var { checked: selected } = control;
        var detail = { type, name, date, selected };
        var output = new CustomEvent('date:change', { detail });
        
        console.log('DATE', type, selected, this.selected);
        output.detail.selected = this.selected = selected;
        host.dispatchEvent(output);
        this.$.state.set(this);
    }
    
    public handleSelection = (e: CustomEvent) => {
        var { detail } = e;
        var { type } = detail;
        var handler = {
            '': this.handleExactSelection,
            'exact': this.handleExactSelection,
            'multi': this.handleMultiSelection,
            'range': this.handleRangeSelection,
        }[ type ];
        
        handler.call(this, e);
    };
    
    public handleExactSelection = (e: CustomEvent) => {
        var { detail } = e;
        var { name, type, selected, date, start, end } = detail;
        console.log('EXACT SELECTION', +this.date === +date, this.date);
        
    };
    
    public handleMultiSelection = (e: CustomEvent) => {
        var { detail } = e;
        var { name, type, selected, date, start, end } = detail;
        console.log('MULTI SELECTION', +this.date === +date, this.date);
        
    };
    
    public handleRangeSelection = (e: CustomEvent) => {
        var { host } = this;
        var { detail } = e;
        var { name, type, selected, date, $dates } = detail;
        var dates: Date[] = Array.from( $dates.values() );
        var first = dates[0], last = dates[ dates.length - 1 ];
        var inRange = (this.date >= first && this.date <= last);
        var notZero = !{ '0': true }[ $dates.size ];
        var oneThatMatches = { '1': true }[ $dates.size ] && (+this.date === +date) && selected;
        var oneInRange = first && last && (this.date >= first && this.date <= last)
        var active = notZero && (oneThatMatches || oneInRange);
        var dirty = (this.selected !== active);
        var changeset = { type: this.type, name: this.name, date: this.date, selected: active };
        var output = new CustomEvent('date:change', { detail: changeset });
        
        this.selected = active;
        this.$.state.set(this);
        if (dirty) host.dispatchEvent(output);  // state may have changed -- notify parent.
    };
    
}

export { FieldComponent };
