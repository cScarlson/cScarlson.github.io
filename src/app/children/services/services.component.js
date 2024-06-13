
import { $, CustomElement } from '/src/core/core.js';

const { log } = console;

$('csc-services', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/src/app/children/services/services.component.html', styleURL: '/src/app/children/services/services.component.css' });
    }
    
    async connectedCallback() {
        const response = await fetch('/src/app/children/services/service.template.html');
        const template = await response.text();
        const content = {
            'SERVICES:TITLE': await $.translate('SERVICES:TITLE'),
            'SERVICES:FOOTER:TEXT': await $.translate('SERVICES:FOOTER:TEXT'),
            'CTA:ESTIMATE': await $.translate('CTA:ESTIMATE'),
            'CTA:PRICING': await $.translate('CTA:PRICING'),
        };
        const services = [
            { icon: 'la la-tachometer', title: await $.translate('SERVICES:0:TITLE'), text: await $.translate('SERVICES:0:TEXT') },
            { icon: 'la la-universal-access', title: await $.translate('SERVICES:1:TITLE'), text: await $.translate('SERVICES:1:TEXT') },
            { icon: 'la la-mobile', title: await $.translate('SERVICES:2:TITLE'), text: await $.translate('SERVICES:2:TEXT') },
            { icon: 'la la-shapes', title: await $.translate('SERVICES:3:TITLE'), text: await $.translate('SERVICES:3:TEXT') },
            { icon: 'la la-file-code', title: await $.translate('SERVICES:4:TITLE'), text: await $.translate('SERVICES:4:TEXT') },
            { icon: 'la la-wheelchair', title: await $.translate('SERVICES:5:TITLE'), text: await $.translate('SERVICES:5:TEXT') },
        ];
        
        this.content = content;
        this.services = services;
        this.template = template;
        return await super.connectedCallback();
    }
    
    interpolate = (service) => {
        return $.utilities.interpolate(this.template)(service);
    };
    
});
