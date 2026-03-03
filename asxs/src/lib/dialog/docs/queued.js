
const { log } = console;

export function execute() {
    const actuator = this.querySelector('.queued.dialog.actuator');
    const dialog = this.querySelector('#queuedDialogCommand');
    actuator.addEventListener('click', e => handleEvent(e, dialog), true);
};

function handleEvent(e, dialog) {
    const timestamp = Date.now();
    const message = {
        mode: 'showModal',
        type: 'string',
        header: [ 'Request', timestamp ].join(''),
        content: [].join(''),
        footer: [].join(''),
    };
    const event = new MessageEvent('as:dialog:request', { data: message });
    
    dialog.dispatchEvent(event);
}
