
import { Loop } from '@asxs/core';
import { markdown, utilities } from '@asxs/core/utilities';
import { types, basic, sizes, block, checkbox, radio, file, reflect } from '@asxs/button';
import { default as magazine } from './templates/magazine.template.html?raw';
import { default as child } from './templates/child.template.html?raw';
import { default as example } from './templates/example.template.html?raw';

const markdown_types = utilities.interpolate( markdown.parse(types.docs) )({
    element: types.example,
    example: markdown.escapeHTML(types.example)
});
const markdown_basic = utilities.interpolate( markdown.parse(basic.docs) )({
    element: basic.example,
    example: markdown.escapeHTML(basic.example)
});
const markdown_sizes = utilities.interpolate( markdown.parse(sizes.docs) )({
    element: sizes.example,
    example: markdown.escapeHTML(sizes.example)
});
const markdown_block = utilities.interpolate( markdown.parse(block.docs) )({
    element: block.example,
    example: markdown.escapeHTML(block.example)
});
const markdown_checkbox = utilities.interpolate( markdown.parse(checkbox.docs) )({
    element: checkbox.example,
    example: markdown.escapeHTML(checkbox.example)
});
const markdown_radio = utilities.interpolate( markdown.parse(radio.docs) )({
    element: radio.example,
    example: markdown.escapeHTML(radio.example)
});
const markdown_file = utilities.interpolate( markdown.parse(file.docs) )({
    element: file.example,
    example: markdown.escapeHTML(file.example)
});
const markdown_reflect = utilities.interpolate( markdown.parse(reflect.docs) )({
    element: reflect.example,
    example: markdown.escapeHTML(reflect.example)
});

const documentation = new Loop([
    {
        id: 'variables',
        title: 'Variables',
        subtitle: '--{name}',
        tagline: 'CSS Variables',
        description: 'AsXS leverages OpenProps CSS so it is all automatically available to you. However, there are a few shortcut variables AsXS has set up that may give you a little extra lift.',
        selected: true,
        examples: [],
        children: new Loop([
            // {
            //     title: 'Colors',
            //     subtitle: '--color-{type}',
            //     tagline: '',
            //     description: '',
            //     children: [],
            //     examples: new Loop([
            //         { document: markdown_types },
            //         { document: markdown_basic },
            //         { document: markdown_sizes },
            //         { document: markdown_block },
            //     ]).with(example),
            // },
        ]).with(child),
    },
    {
        id: 'icons',
        title: 'Icons',
        subtitle: 'as-icon[type="{name}"][strategy="ascii|openvar"].size.{x}',
        tagline: '',
        description: '',
        selected: true,
        examples: [],
        children: new Loop([
            // {
            //     title: 'Basic',
            //     subtitle: 'style[is="as-css-import][target="buttons"]',
            //     tagline: '',
            //     description: '',
            //     children: [],
            //     examples: new Loop([
            //         { document: markdown_types },
            //         { document: markdown_basic },
            //         { document: markdown_sizes },
            //         { document: markdown_block },
            //     ]).with(example),
            // },
        ]).with(child),
    },
    {
        id: 'buttons',
        title: 'Buttons',
        subtitle: '*[is="as-button"].color.{style}.size.{x}',
        tagline: '',
        description: '',
        selected: true,
        examples: [],
        children: new Loop([
            {
                title: 'Basic',
                subtitle: 'style[is="as-css-import][target="buttons"]',
                tagline: '',
                description: '',
                children: [],
                examples: new Loop([
                    { document: markdown_types },
                    { document: markdown_basic },
                    { document: markdown_sizes },
                    { document: markdown_block },
                ]).with(example),
            },
            {
                title: 'Stateful Buttons',
                subtitle: 'as-stateful > input[type="{type}"]',
                tagline: 'Looks like a button, behaves like a form element.',
                description: 'Stateful Buttons provide native states like form elements while appearing like anything you want.',
                children: [],
                examples: new Loop([
                    { document: markdown_checkbox },
                    { document: markdown_radio },
                    { document: markdown_reflect },
                    { document: markdown_file },
                ]).with(example),
            },
        ]).with(child),
    }
]).with(magazine);
const _menuitems = documentation.map( ({ id, title, subtitle, tagline, description }) => ({ id, title, subtitle, tagline, description }) );

export const menuitems = new Loop(_menuitems).with("...");
export {  documentation };

