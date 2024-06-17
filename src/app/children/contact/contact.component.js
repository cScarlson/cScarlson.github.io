
import { $, CustomElement } from '/src/core/core.js';

const { log } = console;

$('csc-contact', class extends CustomElement {
    errors = undefined;
    
    constructor() {
        super({ templateURL: '/src/app/children/contact/contact.component.html', styleURL: '/src/app/children/contact/contact.component.css' });
        this.$internals = this.attachInternals();
        this.$shadow.addEventListener('submit', this, true);
        this.$shadow.addEventListener('click', this, true);
        $.subscribe('CONTACT:FORM:SUBMISSION', this);
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
    
    validate(data) {
        const { firstname, lastname } = data;
        const { email, phone, sms } = data;
        const { service } = data;
        const { website } = data;
        const invalidations = [ ];
        
        if (website)              invalidations.push({ code: -1, field: 'website' });
        if ( (!email && !phone) ) invalidations.push({ code: -1, field: 'email' });
        if (!service)             invalidations.push({ code: -1, field: 'service' });
        
        return invalidations;
    }
    
    err(html) {
        const { $shadow } = this;
        const { errors = $shadow.querySelector('.form.header .form.errors') } = this;
        
        this.errors = errors;
        errors.innerHTML = html;
    }
    
    handleEvent(e) {
        if (e.type === 'submit') return this.handleSubmit(e);
        if (e.type === 'CONTACT:FORM:SUBMISSION') return this.handleFormSubmission(e);
        if (e.type === 'click' && e.target.matches('.you.refresh')) return window.location.reload();
    }
    
    handleSubmit(e) {
        // return log( 'SUBMISSION...', e.preventDefault(), e );
        const { target } = e;
        const form = new FormData(target);
        const object = Object.fromEntries(form);
        const data = { ...object, sms: { ['on']: true, ['off']: false }[ object.sms ] };
        const invalidations = this.validate(data);
        const valid = !invalidations.length;
        
        e.preventDefault();
        if (!valid) return this.handleInvalidations(invalidations);
        this.$internals.states.add('--submitting');
        $.publish('CONTACT:FORM:SUBMISSION', data);  // auto self-unsubscribe
    }
    
    async handleInvalidations(invalidations) {
        const messages = await Promise.all( invalidations.map(map) );
        const html = messages.join('');
        
        async function map(error) {
            const { code, field } = error;
            const { [field]: message } = {
                website: await $.translate('CONTACT:FORM:ERROR:UNKNOWN'),
                email: await $.translate('CONTACT:FORM:ERROR:CONTACT'),
                service: await $.translate('CONTACT:FORM:ERROR:SERVICE'),
            };

            return `<label class="error message" for="${field}" tabindex="0" title="${message}">${message}</label>`;
        }
        
        this.err(html);
    }
    
    async handleFormSubmission(e) {  // auto self-unsubscribe
        const { form } = this;
        const { type, data: response } = e;
        const { successful } = response;
        const message = await $.translate('CONTACT:FORM:ERROR:UNKNOWN:SUBMISSION');
        
        this.$internals.states.delete('--submitting');
        if (!successful) return this.err(`<label class="error message" for="form" tabindex="0" title="${message}">${message}</label>`);
        this.$internals.states.add('--submitted');
        $.unsubscribe('CONTACT:FORM:SUBMISSION', this);  // auto self-unsubscribe
    }
    
});
