
import { $, CustomElement } from '/src/core/core.js';

const { log } = console;

$('csc-pricing', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/src/app/children/pricing/pricing.component.html', styleURL: '/src/app/children/pricing/pricing.component.css' });
    }
    
    async connectedCallback() {
        const response = await fetch('/src/app/children/pricing/pricing.template.html');
        const template = await response.text();
        const content = {
            'PRICING:TITLE': await $.translate('PRICING:TITLE'),
            'PRICING:TIER:TITLE': await $.translate('PRICING:TIER:TITLE'),
            'PRICING:TIER:TEXT:0': await $.translate('PRICING:TIER:TEXT:0'),
            'PRICING:TIER:TEXT:1': await $.translate('PRICING:TIER:TEXT:1'),
            'PRICING:RATE:TITLE': await $.translate('PRICING:RATE:TITLE'),
            'PRICING:RATE:TEXT:0': await $.translate('PRICING:RATE:TEXT:0'),
            'PRICING:RATE:TEXT:1': await $.translate('PRICING:RATE:TEXT:1'),
            'CTA:ESTIMATE': await $.translate('CTA:ESTIMATE'),
            'CTA:ABOUT': await $.translate('CTA:ABOUT'),
        };
        const tiers = [
            { i: 1, icon: 'la la-trophy', title: await $.translate('PRICING:TIER:0:TITLE'), text: await $.translate('PRICING:TIER:0:TEXT') },
            { i: 2.5, icon: 'la la-medal', title: await $.translate('PRICING:TIER:1:TITLE'), text: await $.translate('PRICING:TIER:1:TEXT') },
            { i: 3.75, icon: 'la la-award', title: await $.translate('PRICING:TIER:2:TITLE'), text: await $.translate('PRICING:TIER:2:TEXT') },
        ];
        const rates = [
            { i: 0.75, icon: 'la la-feather', title: await $.translate('PRICING:RATE:0:TITLE'), text: await $.translate('PRICING:RATE:0:TEXT') },
            { i: 0.50, icon: 'la la-bug', title: await $.translate('PRICING:RATE:1:TITLE'), text: await $.translate('PRICING:RATE:1:TEXT') },
            { i: 0.10, icon: 'la la-rocket', title: await $.translate('PRICING:RATE:2:TITLE'), text: await $.translate('PRICING:RATE:2:TEXT') },
        ];
        
        this.content = content;
        this.tiers = tiers;
        this.rates = rates;
        this.template = template;
        return await super.connectedCallback();
    }
    
    interpolate = (data) => {
        return $.utilities.interpolate(this.template)(data);
    };
    
});
