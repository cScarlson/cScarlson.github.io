
import { console, fetch, utilities, Sandbox as CoreSandbox } from '/browserless/core.js';
import { init } from '/browserless/kit/decorators/init.js';
import { SMSService } from '/src/app/children/contact/children/form/sms/sms.service.js';

const { log } = console;
const decorator = init(class Sandbox extends CoreSandbox {
    $sms = new SMSService();
    
    publish(channel, data) {
        if (channel in this) this[channel](channel, data);
        else super.publish(channel, data);
        return this;
    }
    
    async ['CONTACT:FORM:SUBMISSION'](channel, data) {
        const { $sms } = this;
        const response = await $sms.send(data);
        super.publish(channel, response);
    }
    
});

export { decorator as Sandbox };
