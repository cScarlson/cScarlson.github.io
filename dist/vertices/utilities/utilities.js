
export default {
    delay: (delay=10) => new Promise( r => setTimeout(r, delay) ),
    interpolate(str) {
        return (o) => (new Function(`with (this) return \`${str}\`;`) ).call(o);
      },
    debounce(fn, delay) {  // #thxRemySharp https://remysharp.com/2010/07/21/throttling-function-calls/
        var timer = null;
        
        return function execute(...args) {
            var context = this;
            clearTimeout(timer);
            timer = setTimeout(fn.bind(context, ...args), delay);
        };
    },
    throttle(fn, threshhold=250, scope) {  // #thxRemySharp https://remysharp.com/2010/07/21/throttling-function-calls/
        var last, deferTimer;
        
        return function execute(...args) {
            var context = scope || this, now = +new Date, deferrable = (last && now < last + threshhold);
            
            function invoke() {
                last = now;
                fn.call(context, ...args);
            }
            
            if (!deferrable) return invoke();
            clearTimeout(deferTimer);  // hold on to it...
            deferTimer = setTimeout(invoke, threshhold);
        };
    }
};
