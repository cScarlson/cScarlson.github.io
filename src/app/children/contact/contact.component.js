
import { $, CustomElement } from '/src/core/core.js';

const { log } = console;

$('csc-contact', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/src/app/children/contact/contact.component.html', styleURL: '/src/app/children/contact/contact.component.css' });
    }
    
    async connectedCallback() {
        const content = {
            'CONTACT:TITLE': await $.translate('CONTACT:TITLE'),
            'CONTACT:CONTENT': await $.translate('CONTACT:CONTENT'),
            'CONTACT:CTA:TEXT': await $.translate('CONTACT:CTA:TEXT'),
            'CTA:ABOUT': await $.translate('CTA:ABOUT'),
            ...{
                name: {
                    legend: await $.translate('CONTACT:FORM:NAME:LABEL:GROUP'),
                    first: await $.translate('CONTACT:FORM:NAME:FIRST:LABEL'),
                    last: await $.translate('CONTACT:FORM:NAME:LAST:LABEL'),
                },
                contact: {
                    legend: await $.translate('CONTACT:FORM:CONTACT:LABEL:GROUP'),
                    email: await $.translate('CONTACT:FORM:CONTACT:EMAIL:LABEL'),
                    phone: await $.translate('CONTACT:FORM:CONTACT:PHONE:LABEL'),
                    sms: await $.translate('CONTACT:FORM:CONTACT:SMS:LABEL'),
                },
                service: {
                    legend: await $.translate('CONTACT:FORM:SERVICE:LABEL:GROUP'),
                    default: await $.translate('CONTACT:FORM:SERVICE:DEFAULT:OPTION'),
                    enhancement: await $.translate('CONTACT:FORM:SERVICE:ENHANCEMENT:OPTION'),
                    consultation: await $.translate('CONTACT:FORM:SERVICE:CONSULTATION:OPTION'),
                    support: await $.translate('CONTACT:FORM:SERVICE:SUPPORT:OPTION'),
                    other: await $.translate('CONTACT:FORM:SERVICE:OTHER:OPTION'),
                },
                action: {
                    submit: await $.translate('CONTACT:FORM:BUTTON:SUBMIT'),
                    reset: await $.translate('CONTACT:FORM:BUTTON:RESET'),
                },
                feedback: {
                    title: await $.translate('CONTACT:FORM:FEEDBACK:TITLE'),
                    subtitle: await $.translate('CONTACT:FORM:FEEDBACK:SUBTITLE'),
                },
            }
        };
        
        this.content = content;
        return await super.connectedCallback();
    }
    
});
