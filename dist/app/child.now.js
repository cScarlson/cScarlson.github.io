
import V, {} from '/dist/vertices/core.js';
import utils, {} from '/dist/vertices/utilities.js';

const { log } = console;

V('child:now', 'sandbox', function ChildNow($) {
    const children = [
        { text: "Child A" },
        { text: "Child B" },
        { text: "Child C" },
    ];
    const collection = [
        { id: 0, name: 'a', title: "A", children },
        { id: 1, name: 'b', title: "B", children },
        { id: 2, name: 'c', title: "C", children },
    ];
    const content = [
        `...child:now {{text}}`,
        `<ul>`,
            `{{#collection}}`,
                `<li>`,
                    `{{title}}`,
                    `<s><slot></slot></s>`,
                    `{{#children}}`,
                        `<div>{{text}}--<slot name="test"></slot></div>`,
                    `{{/children}}`,
                `</li>`,
            `{{/collection}}`,
        `</ul>`,
    ].join('');
    
    this.text = 'ze tiext';
    this.collection = collection;
    this.template = content;
    // $.log(`@child:now`, this, $);
    
    return this;
});
