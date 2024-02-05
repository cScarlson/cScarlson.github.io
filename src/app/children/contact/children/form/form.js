
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox, translate } from '/src/app/core.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/contact/children/form/form.html',
    styles: './src/app/children/contact/children/form/form.css',
};

f('my-contact-form', metadata, Sandbox, new class {
    call = async ($) => ({
        metadata: $.interpolate({
            name: {
                legend: await translate('CONTACT:FORM:NAME:LABEL:GROUP'),
                first: await translate('CONTACT:FORM:NAME:FIRST:LABEL'),
                last: await translate('CONTACT:FORM:NAME:LAST:LABEL'),
            },
            contact: {
                legend: await translate('CONTACT:FORM:CONTACT:LABEL:GROUP'),
                email: await translate('CONTACT:FORM:CONTACT:EMAIL:LABEL'),
                phone: await translate('CONTACT:FORM:CONTACT:PHONE:LABEL'),
                sms: await translate('CONTACT:FORM:CONTACT:SMS:LABEL'),
            },
            service: {
                legend: await translate('CONTACT:FORM:SERVICE:LABEL:GROUP'),
                default: await translate('CONTACT:FORM:SERVICE:DEFAULT:OPTION'),
                enhancement: await translate('CONTACT:FORM:SERVICE:ENHANCEMENT:OPTION'),
                consultation: await translate('CONTACT:FORM:SERVICE:CONSULTATION:OPTION'),
                support: await translate('CONTACT:FORM:SERVICE:SUPPORT:OPTION'),
                other: await translate('CONTACT:FORM:SERVICE:OTHER:OPTION'),
            },
            action: {
                submit: await translate('CONTACT:FORM:BUTTON:SUBMIT'),
                reset: await translate('CONTACT:FORM:BUTTON:RESET'),
            },
            feedback: {
                title: await translate('CONTACT:FORM:FEEDBACK:TITLE'),
                subtitle: await translate('CONTACT:FORM:FEEDBACK:SUBTITLE'),
            },
        }),
        connectedCallback() {
            const { element, shadow } = $;
            const form = shadow.querySelector('.contact.form');
            const errors = form.querySelector('.form.errors');
            const website = form.querySelector('input[name="website"]');
            
            this.form = form;
            this.errors = errors;
            
            website.style = 'display: none !important';
            shadow.addEventListener('submit', this, false);
            $.subscribe('CONTACT:FORM:SUBMISSION', this);
        },
        err(html) {
            const { errors } = this;
            errors.innerHTML = html;
            errors.focus();
        },
        handleEvent(e) {
            const { type } = e;
            const handle = {
                'submit': this.handleSubmit,
                'CONTACT:FORM:SUBMISSION': this.handleFormSubmission,
            }[ type ];
            
            if (handle) handle.call(this, e);
        },
        handleSubmit(e) {
            const { target } = e;
            const form = new FormData(target);
            const object = Object.fromEntries(form);
            const data = { ...object, sms: { ['on']: true, ['off']: false }[ object.sms ] };
            const invalidations = validate(data);
            const valid = !invalidations.length;
            
            e.preventDefault();
            if (!valid) return this.handleInvalidations(invalidations);
            $.states.add('--submitting');
            $.publish('CONTACT:FORM:SUBMISSION', data);  // auto self-unsubscribe
        },
        async handleInvalidations(invalidations) {
            const messages = await Promise.all( invalidations.map(map) );
            const html = messages.join('');
            
            async function map(error) {
                const { code, field } = error;
                const { [field]: message } = {
                    website: await translate('CONTACT:FORM:ERROR:UNKNOWN'),
                    email: await translate('CONTACT:FORM:ERROR:CONTACT'),
                    service: await translate('CONTACT:FORM:ERROR:SERVICE'),
                };

                return `<label class="error message" for="${field}" tabindex="0" title="${message}">${message}</label>`;
            }
            
            this.err(html);
        },
        async handleFormSubmission(e) {  // auto self-unsubscribe
            const { form } = this;
            const { type, data: response } = e;
            const { successful } = response;
            const message = await translate('CONTACT:FORM:ERROR:UNKNOWN:SUBMISSION');
            
            if (!successful) return this.err(`<label class="error message" for="form" tabindex="0" title="${message}">${message}</label>`);
            form.reset();
            form.innerHTML = '';  // destroy form
            $.states.add('--submitted');
            $.unsubscribe('CONTACT:FORM:SUBMISSION', this);  // auto self-unsubscribe
        },
    })
});

function validate(data) {
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
