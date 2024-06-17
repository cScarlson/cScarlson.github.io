
import { $ } from '/src/core/core.js';

const { log } = console;
const TEMPLATE_URL = `/src/app/children/contact/sms/sms.template.html`;
const SERVICE_URL = `https://api.emailjs.com/api/v1.0/email/send`;
const USER_ID = 'AJqR9xQ32JBxxo54l';
const SERVICE_ID = 'otocarlson';
const TEMPLATE_ID = 'template_4iu8tcq';
const HEADERS = {
    'Content-Type': 'application/json',
};

class EmailJSRequest {
    user_id = USER_ID;
    service_id = SERVICE_ID;
    template_id = TEMPLATE_ID;
    template_params = new EmailJSTemplateParams();
    
    constructor(options = {}) {
        this.template_params = new EmailJSTemplateParams(options);
        return this;
    }
    
}

class EmailJSTemplateParams {
    message = '';
    
    constructor(options = {}) {
        const { message } = { ...this, ...options };
        this.message = message;
        return this;
    }
    
}

export default new (class SMSService {
    template = fetch(TEMPLATE_URL).then( res => res.text() );
    
    constructor(options = {}) {}
    
    async send(data = {}) {
        const { template: promise } = this;
        const template = await promise;
        const message = $.utilities.interpolate(template)(data);
        const request = new EmailJSRequest({ message });
        const body = JSON.stringify(request);
        const response = await fetch(SERVICE_URL, { headers: HEADERS, body, method: 'POST' });
        const result = await response.text();
        const successful = (result === 'OK');
        const output = {
            successful,
            message,
            template,
            result,
        };
        
        return output;
    }
    
})();
