
const middleware = new Set()
    .add(test)
    ;

function test(state, action) {
    return state;
}

export { middleware as default, middleware };
