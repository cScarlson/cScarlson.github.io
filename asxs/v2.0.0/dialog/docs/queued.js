
const actuator = document.querySelector('.queued.dialog.actuator');
const dialog = document.querySelector('#queuedDialogCommand');
actuator.addEventListener('click', e => handleEvent(e, dialog), true);

function handleEvent(e, dialog) {
    const requests = ['One', 'Two', 'Three', 'Four', 'Five'].map(create);
    for (const event of requests) dialog.dispatchEvent(event);
}

function create(id) {
    const message = {
        type: 'string',  // can also be type 'node' where 'content' is a NodeList or any other iterable of Node[]
        content: [
            '<header>', '<h1>', 'Request', ' - ', id, '</h1>', '</header>',
            '<div>', 'Body for ', id, '</div>',
            '<footer>',
                '<h3>Footer</h3>',
                '<button is="as-button" onclick="this.dispatchEvent( new MessageEvent(\'as:dialog:close\') )">Request Close</button>',
                ' ',
                '<button is="as-button" command="close" commandfor="queuedDialogCommand">Dismiss All</button>',
            '</footer>'
        ].join(''),
    };
    
    return new MessageEvent('as:dialog:request', { data: message });
}
