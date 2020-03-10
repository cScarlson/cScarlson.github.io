
var CSV = new class CSV {
    
    // JSON.stringify(value[, replacer[, space]])
    stringify(collection, fields, delimiter) {  // Word Art Cloud: wordToWeight() & weightToWord()
        /**
         * Given: map.get(fields[i]).push( collection[j][ fields[i] ] )
         * Then: every column (fields[i]) contains an equal number of values as any other column.
         * Because: map.get(fields[i])[0] === collection[j][ fields[i] ]
         */
        var $table = new Map();  // Map { 0 => { a, b, c, ... } }
        var $values = new Map();  // Map { a => [ x, y, z, ... ] }
        var $lines = new Map();  // Map { 0 => [ x, y, z, ... ] }
        var matrix = [ ];  // [ [a,b,c,...], [a,b,c,...], ... ]
        var lines = [ ];
        var span = 0;
        
        if (!fields) fields = Object.keys( collection.reduce( (o, x) => ({ ...o, ...x }), { } ) );  // gets all available keys across all objects in collection
        
        for (let i = 0, width  = collection.length; i < width;  i++)
        for (let j = 0, height = fields.length;     j < height; j++)
		(function create(value, [x, y], row, i, rows, col, j, columns) {
            var _id = x, field = col;
            var record = $table.get(_id) || { _id };
            var column = $values.get(col) || [ ];
            var line = $lines.get(x) || [ ];
            
            if ({ 'undefined': true }[ value ]) value = '';
            matrix[x] = matrix[x] || [ ];
            matrix[x][y] = record[field] = column[x] = line[y] = value;
            
            $table.set(_id, record);  // ensure gets set first time
            $values.set(col, column);  // ensure gets set first time
            $lines.set(x, line);  // ensure gets set first time
            
            span = Math.max.apply(null, [ span, col.length, `${value}`.length ]);
            lines[x] = line.join(',');
            
        })(collection[i][ fields[j] ], [i, j], collection[i], i, collection, fields[j], j, fields);
        
        var tabs = Array.apply(null, { length: span });
        var delimiter = {
            '\t': tabs.map( () => '\t' ),
            '\s': tabs.map( () => '\s' ),
            'undefined': [ ],
        }[ delimiter ].join('');
        var columns = fields.join(',');
        var csv = [ columns ].concat(lines).join('\n');
        var csv = csv.replace(/,/img, `,${delimiter}`);
        
        return csv;
    }
    
    parse(csv) {
        var lines = csv.split(/\n+/img), [ fields ] = lines, fields = fields.split(/,\t*/), rows = lines.slice(1);
		var collection = rows.reduce( getObject.bind(this, fields), [ ] );
        
        function getObject(fields, array, line, row, lines) {
            var o = fields.reduce( getValue.bind(this, line), { } );
            array.push(o);
            
            function getValue(line, o, key, i, fields) {
                var values = line.split(/,\s*/), value = values[i], datum = { [key]: value };
                return { ...o, ...datum };
            }
            
            return array;
        }
        
		return collection;
    }
    
};

/**
 * @ URLComponents
 */
class URLComponents {
    hash: string = '';
    host: string = '';
    hostname: string = '';
    href: string = '';
    origin: string = '';
    pathname: string = '';
    port: string = '';
    protocol: string = '';
    search: string = '';
    
    constructor(url) {
        var parser = document.createElement('a');
        parser.href = url;

        this.hash = parser.hash;
        this.host = parser.host;
        this.hostname = parser.hostname;
        this.href = parser.href;
        this.origin = parser.origin;
        this.pathname = parser.pathname;
        this.port = parser.port;
        this.protocol = parser.protocol;
        this.search = parser.search;

        return this;
    }
    
}

class ParameterMap {
    name: string = '';
    value: string = '';
    
    constructor(str) {
        var pair = str.split('=');
        this.name = pair[0];
        this.value = pair[1];
        return this;
    }
    
}

class QueryMap {
    
    constructor(q) {
        var query = decodeURIComponent(q);
        var exp = /[^\?|\&]([^=]+)\=([^&]+)/g;
        var res = query.match(exp);

        for (var i = 0, len = res.length; i < len; i++) {
            var map = new ParameterMap(res[i]);
            this[map.name] = map.value;
        }

        return this;
    }
    
}

class Utilities {
    CSV: any = CSV;
    console: any = console;
    
    constructor() {
        return this;
    }
      
    noop() {}
    
    extend(object, first?, ...more) {
        var o = Object.keys(first).reduce( (o, k) => (o[k] = first[k], o), object );
        if (more.length) return this.extend(object, ...more);
        return o;
    }
    
    is(value) {
        var isnt = { null: true, undefined: true, '': true, 0: false }[ value ];
        return !isnt;
    }
    
    timeout(handler, ...splat) {
        var cancel = window.setTimeout(handler, ...splat);
        return cancel;
    }
    
    enqueue(handler, ...splat) {
        var result = this.timeout(handler, 0, ...splat);
        return result;
    }
    
    /**
     * 
     * @intention
     *  * Leverage global.setTimeout for intervals instead of global.setInterval.
     * @patterns { Curry }
     * @usage 
     *  * var clear = utils.interval( () => console.log('called!'), 1000 );
     *  * setTimeout(clear, (1000 * n) );  // clears interval after n seconds
     */
    interval(handler, delay, ...splat) {
        var thus = this, timeout = thus.timeout(set, delay, ...splat);
        
        function set(...params) {
            if ( !timeout ) return console.log('break');  // > -1
            handler.call(this, ...params);
            timeout = thus.timeout(set, delay, ...splat);
        }
        function clear() {
            clearTimeout(timeout);
            timeout = null;
            return !timeout;  // assert is cleared
        }
        
        return clear;
    }
    
    debounce(fn, delay) {  // # thx Remy Sharp
        var timer = null;
        
        function _debounce(...splat) {
            var context = this;
            clearTimeout(timer);
            timer = setTimeout( () => fn.call(context, ...splat), delay);
        };
        
        return _debounce;
    }
    
    throttle(fn, threshhold, scope) {  // # thx Remy Sharp
        var threshhold = threshhold || 250, last, deferTimer;
        
        function _throttle(...splat) {
            var context = scope || this, now = +(new Date()), last = now, final = (last + threshhold);
            var invoke = () => ( fn.call(context, ...splat), last = now );
            
            if (!last || now >= final) return invoke();  // don't hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(invoke, threshhold);
        };
        
        return _throttle;
    }
    
    uuid() {
        function replace(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replace);
    }
        
    escapeHTML(s) {
        return s.replace(/[&"<>]/g, function (c) {
            return {
                '&': '&amp;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;'
            }[c];
        });
    }
    
    
    drill(data: any, path: string): any {  // @usage: var x = drill('a.b.c.id', { a: { b: { c: { id: x } } } });
        var keys = path.split('.'), key = keys.shift();
        
        if (!data) return undefined;  // not unlike an operation of { 'existent': true }[ 'absent' ] > undefined
        if (!key) return data;  // data is final
        
        return this.drill( data[key], keys.join('.') );  // TCO/TCE
    }


    /**
     * @ Inspiration: Douglas Crockford (String.prototype.supplant)
     */
    interpolate(str) {
        return (o) => str.replace(/{{([^{}]*)}}/g, (a, b) => {
            var value = this.drill(o, b), val = ''+value;  // default & convert to string
            
            if (!value) val = a;  // leave {{key[.x[.y[.z]]]}} syntax in string so that multiple iterations of interpolation may occur
            else if (value.call) val = ''+value();  // get return value
            
            return this.escapeHTML(val);  // assume rational value for string result
        });
    }

    /**
     * @ THX: Douglas Crockford (String.prototype.supplant)
     * @ INTERPOLATE
     */
    interpolateShallow(str) {
        return (o) => {
            return str.replace(/{{([^{}]*)}}/g, (a, b) => {
                var val = ''+o[b];
                return this.escapeHTML(val);  // TODO: escape HTML-Entities
            });
        };
    }

    /**
     * @ THX: Douglas Crockford (String.prototype.supplant)
     * @ INSECURE_INTERPOLATE
     */
    INSECURE_INTERPOLATE(str) {
        return function interpolate(o) {
            return str.replace(/{{([^{}]*)}}/g, function (a, b) {
                var val = ''+o[b];
                return val;  // TODO: escape HTML-Entities
            });
        }
    }
    
    /**
     * @ EXTERPOLATE | PARSE ROUTE-URI
     */
    exterpolate(str) {
        var str = str || '';
        var re = /:[^\s/]+|{+[^\s/]+}+/g;
        var matcher = new RegExp(str.replace(re, '([\\w-]+)'));

        return function getValues(string) {
            if (!string.match(matcher)) return false;
            var string = string || '';
            var result = string.match(matcher);
            var keys = str.match(re);
            var values = result.slice(1);
            var map = {};

            if (keys && values) {
                for (var i = 0, len = keys.length; i < len; i++) {
                    var key = keys[i].replace(/[:{}]+/g, '');
                    var val = values[i];
                    if (key !== val) map[key] = val;
                }
            }

            return map;
        };
    }
    
    parseURL(url) {
        var a = document.createElement('a');
        a.href = url;
        
        return {
            hash: a.hash,
            host: a.host,
            hostname: a.hostname,
            href: a.href,
            origin: a.origin,
            pathname: a.pathname,
            port: a.port,
            protocol: a.protocol,
            search: a.search,
        };
    }
    
    sortByKey(k, a, b) {  // Sort by Multiple keys (Reusable) using sortByKey()
        // USAGE:
        // var sort = sortByKey.bind(collection, 'x');
        // collection.sort(sort);
        if (a[k] > b[k]) return  1;
        if (a[k] < b[k]) return -1;
        return 0;
    }
    
    // Sort by Multiple keys (Reusable + Optimized) using Methods-Array
    priorityMethodSort(methods, a, b) {
        // USAGE:
        // var sort = prioritySort.bind(collection, [ sort$A, sort$B, sort$C, sort$D ]);
        // collection.sort(sort);
        var i = 0, methods = Array.prototype.slice.call(methods || [ ], 0);
        while (i === 0 && methods.length) i = methods.shift().call(this, a, b);
        return i;
    }
    
    priorityKeySort(keys, a, b) {  // Sort by Multiple keys (Reusable + Optimized) using Reusable prioritySort()
        // USAGE:
        // var sort = prioritySort.bind(collection, [ 'a', 'b', 'c', 'd' ]);
        // collection.sort(sort);
        // console.log('>', collection);
        // >  [
        //       { "a": 0, "b": 0, "c": 0, "d": 0 },
        //       { "a": 0, "b": 1, "c": 2, "d": 2 },
        //       { "a": 0, "b": 1, "c": 2, "d": 3 },
        //       { "a": 1, "b": 1, "c": 1, "d": 1 },
        //       { "a": 1, "b": 2, "c": 2, "d": 1 },
        //       { "a": 1, "b": 2, "c": 3, "d": 1 },
        //       { "a": 2, "b": 2, "c": 2, "d": 2 },
        //       { "a": 3, "b": 3, "c": 3, "d": 3 }
        //    ]
        var i = 0, keys = Array.prototype.slice.call(keys || [ ], 0);
        while (i === 0 && keys.length) i = this.sortByKey.call(this, keys.shift(), a, b);
        return i;
    }
    
    getFileSize(size, unit = 'auto') {  // size: number, unit: 'auto'|'byte'|'KB'|'MG'|'GB'|'TB'|'PB'
        var $ = this.toFixed.bind(this);
        var $bytes = $(size || 0), $KB = $($bytes / 1024), $MB = $($KB / 1024), $GB = $($MB / 1024), $TB = $($GB / 1024), $PB = $($TB / 1024);
        var bytes = `${$bytes} bytes`, KB = `${$KB} KB`, MB = `${$MB} MB`, GB = `${$GB} GB`, TB = `${$TB} TB`, PB = `${$PB} PB`;
        var $auto = $bytes;
        var auto;
        var values = { bytes, KB, MB, GB, TB, PB, auto: undefined };
        var result = { unit: '', value: Infinity };
        var datasets = [
        { unit: 'bytes', value: $bytes },
        { unit: 'KB', value: $KB },
        { unit: 'MB', value: $MB },
        { unit: 'GB', value: $GB },
        { unit: 'TB', value: $TB },
        { unit: 'PB', value: $PB },
        ];
        while ( (result.value / 1024) >= 1 && datasets.length ) result = datasets.shift();
        values.auto = `${result.value} ${result.unit}`;
        
        
        
        return values[unit];
    }
    
    toFixed(n) { return Number( Math.round(+(n + 'e2')) + 'e-2' ); }
    
    exists(n) { return !!~n; }
    
}

export { Utilities };
