
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './field.component.html';

var booleans = { 'true': true, 'false': false, 'undefined': false, 'null': false, '': false };

enum weekdays {
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
}
type TType = undefined|string|''|'exact'|'multi'|'range'|'discrete';
type TSpecType = 'day'|'month'|'year';
type TSpec = { type: TSpecType, value: any };

@ElementNode({ selector: 'app-calendar-field' })
class FieldComponent {
    private host: Element = this.$.target;
    public name: string = this.host.getAttribute('name');
    get selected(): boolean { return booleans[ this.host.getAttribute('selected') ]; }
    set selected(checked: boolean) { this.host.setAttribute('selected', booleans[ ''+checked ] ); }
    get type(): TType { return this.host.getAttribute('type'); }
    set type(type: TType) { this.host.setAttribute('type', type); }
    get date(): Date { return new Date( this.host.getAttribute('date') ); }
    set date(date: Date) { this.host.setAttribute('date', ''+date); }
    get checked(): string { return { 'true': 'checked', 'false': '' }[ ''+this.selected ]; }
    get monthday(): number { return this.date.getDate(); }
    get weekday(): string { return weekdays[ this.date.getDay() ]; }
    get display(): string|number { return this.type === 'param' ? weekdays[ this.date.getDay() ] : this.date.getDate(); }
    public types: any = { '': 'radio', 'exact': 'radio', 'multi': 'checkbox', 'range': 'checkbox', 'param': 'checkbox' };
    
    constructor(private $: IElementSandbox) {
        var { name, selected, type, date } = this;
        var uuid = $.utils.uuid();
        
        this.name = { 'null': uuid, 'undefined': uuid, '': uuid }[ name ] || name;
        this.type = type || { 'null': '', 'undefined': '', '': ''  }[ type ];
        this.selected = selected;
        
        $.state.set(this);
        $.content.set(template);
        $.subscribe('CALENDAR:SELECTION:CHANGED', this.handleSelection);
    }
    
    private hasSpec(date: Date, spec?: TSpec, ...more: TSpec[]) {
        if (!spec) return false;  // an empty spec should not match dates which have specs.
        var { type, value } = spec;
        var action = { 'day': 'getDay', 'month': 'getMonth', 'year': 'getYear' }[ type ];
        var datum = date[action]();
        var has = (datum === value);
        
        if (more.length) return has && this.hasSpec(date, ...more);
        return has;
    }
    
    handleChange(e: InputEvent) {
        var { host, type, name, date } = this;
        var { target } = e, control = <HTMLInputElement>target;
        var { checked: selected } = control;
        var detail = { type, name, date, selected };
        var output = new CustomEvent('date:change', { detail });
        
        output.detail.selected = this.selected = selected;
        host.dispatchEvent(output);
        this.$.state.set(this);
    }
    
    public handleSelection = (e: CustomEvent) => {
        var { detail } = e;
        var { type, $selections } = detail;
        var handler = {
            '': this.handleExactSelection,
            'exact': this.handleExactSelection,
            'multi': this.handleMultiSelection,
            'range': this.handleRangeSelection,
            'specs': this.handleSpecsSelection,
            'param': this.handleParamSelection,
        }[ type ];
        
        if (handler) return handler.call(this, e);
        if ($selections && !$selections.size) this.selected = false;
        this.$.state.set(this);
    };
    
    public handleExactSelection = (e: CustomEvent) => {
        var { detail } = e;
        var { name, type, selected, date } = detail;
        // console.log('EXACT SELECTION', +this.date === +date, this.date);
        
    };
    
    public handleMultiSelection = (e: CustomEvent) => {
        var { detail } = e;
        var { name, type, selected, date } = detail;
        // console.log('MULTI SELECTION', +this.date === +date, this.date);
        
    };
    
    public handleRangeSelection = (e: CustomEvent) => {
        var { host } = this;
        var { detail } = e;
        var { name, type, selected, date, $selections } = detail;
        var dates: Date[] = Array.from( $selections.values() );
        var first = dates[0], last = dates[ dates.length - 1 ];
        var inRange = (this.date >= first && this.date <= last);
        var notZero = !{ '0': true }[ $selections.size ];
        var oneThatMatches = { '1': true }[ $selections.size ] && (+this.date === +date) && selected;
        var oneInRange = first && last && (this.date >= first && this.date <= last)
        var active = notZero && (oneThatMatches || oneInRange);
        var dirty = (this.selected !== active);
        var changeset = { type: this.type, name: this.name, date: this.date, selected: active };
        var output = new CustomEvent('date:change', { detail: changeset });
        
        this.selected = active;
        if (dirty) host.dispatchEvent(output);  // state may have changed -- notify parent.
    };
    
    public handleSpecsSelection = (e: CustomEvent) => {  // note that all selections can be transformed into specs and selected that way
        if (!{ 'multi': true }[ this.type ]) return;
        var { host, selected: current } = this;
        var { detail } = e;
        var { name, type, selected, date, specs = [] }: any&{ specs: TSpec[]|TSpec } = detail;
        var specs: any = [].concat(specs);
        var matches = this.hasSpec(this.date, ...specs);
        var output = new CustomEvent('date:change', { detail });
        
        if (!matches) return;
        this.selected = selected;
        host.dispatchEvent(output);  // state may have changed -- notify parent.
    };
    
    public handleParamSelection = (e: CustomEvent) => {
        if (!{ 'param': true }[ e.detail.type ]) return;
        if (!{ 'multi': true }[ this.type ]) return;
        var { detail } = e;
        var { name, type, selected, date } = detail;
        var day = date.getDay();
        
        this.$.publish('CALENDAR:SELECTION:CHANGED', { type: 'specs', selected, specs: [ { type: 'day', value: day } ] });
    };
    
}

export { FieldComponent };
