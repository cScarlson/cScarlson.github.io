
const middleware = new Set()
    .add(test)
    ;

function test(action) {
    return this;
}

export { middleware as default, middleware };
