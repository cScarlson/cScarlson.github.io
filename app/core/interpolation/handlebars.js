
const helpers = new Map()
    .set('$', reinterpolate)
    ;

function reinterpolate(text, options) {
    const { data } = options;
    const { root } = data;
    const template = Handlebars.compile(text);
    const result = template(root);
    return result;
}

export { helpers };
