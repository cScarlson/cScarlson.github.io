
import { utilities } from '/asxs/v2.0.0/core/utilities/utilities.js';

const { markdown } = utilities;
const { innerText } = document.querySelector('script[type="application/json"][id="markdown"]');
const { url } = JSON.parse(innerText);
const { innerHTML } = document.querySelector('script[type="application/json"][id="scope"]') || { innerHTML: '{}' };
const scope = JSON.parse(innerHTML);
const template = document.querySelector('template');
const promise = fetch(url)
    .then( response => response.text() )
    .then( text => markdown.parse(text) )
    .then( parsed => utilities.interpolate(parsed)(scope) )
    .then( readme => utilities.interpolate(template.innerHTML)({ content: readme }) )
    .then( innerHTML => template.innerHTML = innerHTML )
    .then( innerHTML => frameElement.replaceWith(template.content) )
    ;
