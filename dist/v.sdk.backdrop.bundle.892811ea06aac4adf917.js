(window.webpackJsonp=window.webpackJsonp||[]).push([[3],[function(t,e,n){"use strict";n.r(e);var r=n(1);function i(t){return t}function s(t){return t}class o extends class{constructor(t,e){this.context=null,this.action="",this.context=t,this.action=e}execute(...t){var{context:e,action:n}=this;return e[n](...t)}}{constructor(){super(...arguments),this.execute=(...t)=>super.execute(...t)}}EventTarget;class a{constructor({comm:t,Sandbox:e,element:n,director:r}){this.comm=t,this.Sandbox=e,this.element=n,this.director=r}construct(t,e){var{Sandbox:n,comm:r,element:i,director:s}=this,o=new n(i,s),a=[].concat(o,"extra"),c={type:"construct",Target:t,args:e},u=Reflect.construct(t,a);return this.sandbox=o,r.publish(r.channels["PROXY:INVOKED"],c),r.publish(r.channels["PROXY:CONSTRUCT:INVOKED"],c),u}}class c{constructor({comm:t,source:e,element:n}){this.comm=t,this.source=e,this.element=n}has(t,e){var{source:n,comm:r}=this,i={type:"has",source:n,key:e},s=Reflect.has(n,e);return r.publish(r.channels["PROXY:INVOKED"],i),r.publish(r.channels["PROXY:HAS:INVOKED"],i),s}get(t,e,n){var{source:r,comm:i}=this,s={type:"get",source:r,key:e},o=Reflect.get(r,e);return i.publish(i.channels["PROXY:INVOKED"],s),i.publish(i.channels["PROXY:GET:INVOKED"],s),o}set(t,e,n,r){var{source:i,comm:s}=this,o={type:"set",source:i,key:e,value:n},a=Reflect.set(i,e,n);return s.publish(s.channels["PROXY:INVOKED"],o),s.publish(s.channels["PROXY:SET:INVOKED"],o),a}deleteProperty(t,e){var{source:n,comm:r}=this,i={type:"delete",source:n,key:e},s=Reflect.deleteProperty(n,e);return r.publish(r.channels["PROXY:INVOKED"],i),r.publish(r.channels["PROXY:DELETE:INVOKED"],i),s}apply(t,e,n){var{source:r,comm:i}=this,s={type:"apply",source:r,target:t,thus:e,args:n},o=t.call(r,...n);return i.publish(i.channels["PROXY:INVOKED"],s),i.publish(i.channels["PROXY:APPLY:INVOKED"],s),o}}class u{constructor(){this["PROXY:INVOKED"]="vcomm://invoked/proxy",this["PROXY:CONSTRUCT:INVOKED"]="vcomm://invoked/proxy/construct",this["PROXY:HAS:INVOKED"]="vcomm://invoked/proxy/has",this["PROXY:GET:INVOKED"]="vcomm://invoked/proxy/get",this["PROXY:SET:INVOKED"]="vcomm://invoked/proxy/set",this["PROXY:DELETE:INVOKED"]="vcomm://invoked/proxy/delete",this["PROXY:APPLY:INVOKED"]="vcomm://invoked/proxy/apply"}}class l{constructor(){this.target=new EventTarget,this.channels=new u}publish(t,e){var n=new CustomEvent(t,{detail:e});return this.target.dispatchEvent(n),this}subscribe(t,e){return this.target.addEventListener(t,e,!1),this}unsubscribe(t,e){return this.target.removeEventListener(t,e,!1),this}}class h{constructor(t,e){this.Sandbox=t,this.director=e}composeCommand(t,e){return new o(t,e)}composeExecutor(t,e){var n=this.composeCommand(t,e),{execute:r}=n;return r}composeOperand(t,e,n){return e(this.composeExecutor(t,n))}mapListener(t,e){var{type:n,name:r}=e;return{type:n,name:r,handler:this.composeExecutor(t,r)}}mapSubscription(t,e,{type:n,name:r,operators:i}){return{type:n,name:r,operators:e.filter(({name:t})=>i.has(t)).map(({name:e,operator:n})=>this.composeOperand(t,n,e))}}getConfig(t,e){var{director:n,Sandbox:r}=this,{observedAttributes:i=[],watchers:s=new Map}=t,{listeners:o=[]}=t,{subscriptions:u=[],operators:h=[]}=t,{template:p="",pTemplate:f}=t,d=new l,m=new a({comm:d,Sandbox:r,element:e,director:n}),v=new new Proxy(t,m)({state:!1}),b=new c({comm:d,source:v,element:e}),g=new Proxy(v,b),o=o.map(t=>this.mapListener(v,t)),u=u.map(t=>this.mapSubscription(v,h,t)),y=Object.create(g);for(let t in g)g[t].call&&(y[t]=new Proxy(g[t],b));return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({comm:d,director:n,Sandbox:r,Class:t},{sandbox:m.sandbox}),{template:p,pTemplate:f}),{observedAttributes:i,watchers:s}),{listeners:o}),{subscriptions:u,operators:h}),{component:v,surrogate:y})}prepare(t){var e,n=this,{observedAttributes:i=[]}=t;return(e=class e extends HTMLElement{constructor(){super(),this.$utils=new r.b,this.config=n.getConfig(t,this),this.comm=this.config.comm,this.$=this.config.sandbox,this.component=this.config.component,this.listeners=this.config.listeners,this.subscriptions=this.config.subscriptions,this.operators=this.config.operators,this.$watchers=this.config.watchers,this.template=this.config.template,this.pTemplate=this.config.pTemplate,this.$comparitors=new Map,this.handleProxyInvokation=t=>{var{component:e,attributes:n}=this,{type:r,detail:i}=t,{type:s}=i;this.getAttributeChanges(this.comparitors).forEach(({name:t})=>this.initAttribute(e,n[t]))};var{comm:i,component:s,listeners:o,subscriptions:a,operators:c,pTemplate:u}=this,{observedAttributes:l}=e;return this.bind(s,l,o,a),this.init(this),u.then(t=>this.template=t),i.subscribe(i.channels["PROXY:INVOKED"],this.handleProxyInvokation),this}get comparitors(){return Array.from(this.$comparitors.values())}get content(){return this.$utils.interpolate(this.template)(this.component)}set content(t){this.innerHTML=t}get attrs(){return i}init({component:t,dataset:e,attributes:n}){return this.initAttributes(this),t.init&&t.init(e),this}initAttributes({component:t,attributes:e}){for(let n=0,r=e.length;n<r;n++)this.initAttribute(t,e[n],n,e);return this}initAttribute(t,e,n,r){var{attrs:i}=this,{name:s}=e,o=t[s];return this.setAttribute(s,o),this.initAttributeComparitors(t,i),this}initAttributeComparitors(t,e){for(let n=0,r=e.length;n<r;n++)this.initAttributeComparitor(t,e[n],n,e);return this}initAttributeComparitor(t,e,n,r){var i=function(t,e){return function(n){return{name:t,equal:e===n,previous:e,current:n}}}(e,t[e]);return this.$comparitors.set(e,{name:e,compare:i}),this}bind(t,e,n,r){return e.forEach(e=>this.bindAttribute(t,e)),n.forEach(e=>this.bindListener(t,e)),r.forEach(e=>this.bindMessageHandler(t,e)),this}unbind(){}bindAttribute(e,n){var r=Object.getOwnPropertyDescriptor(t.prototype,n),{get:i,set:s}=(r=Object.assign({},r),r);return this.getAttribute(n)||this.setAttribute(n,e[n]),r.get&&r.set?r={get:i,set:s}:r.get||r.set?!r.get&&r.set?r={get:()=>this.getAttribute(n),set:s}:r.get&&!r.set&&(r={get:i,set:()=>this.setAttribute(n,e[n])}):r={get:()=>this.getAttribute(n),set:t=>this.setAttribute(n,t)},Object.defineProperty(e,n,r),this}bindListener(t,e){var{type:n,handler:r}=e;this.addEventListener(n,r,!1)}unbindListener(t,e){var{type:n,handler:r}=e;this.removeEventListener(n,r,!1)}bindMessageHandler(t,e){var{type:n,name:r,operators:i}=e,{$:s}=this,o=s.channels[n];s.in(o).pipe(...i).subscribe((...e)=>t[r](...e))}unbindMessageHandler(t,e){var{type:n,handler:r}=e,{$:i}=this}getAttributeChanges(t){return t.filter(t=>this.compareAttributeValues(t))}compareAttributeValues(t){var{name:e,compare:n}=t,{[e]:r}=this.component,i=n(r),{equal:s}=i;return!s}connectedCallback(){var{component:t,content:e}=this;t.attachedCallback&&t.connectedCallback(),this.content=e}attributeChangedCallback(t,e,n){var{component:r,content:i,$watchers:s}=this,o=r[`[${t}]`],a=r["[*]"],c=s.get(t);r.attributeChangedCallback&&r.attributeChangedCallback(t,e,n),a&&a.call(r,t,e,n),o&&o.call(r,n,e),c&&c.handler.call(r,n,e),this.content=i}disconnectedCallback(){var{component:t,listeners:e,subscriptions:n}=this;t.detachedCallback&&t.disconnectedCallback(),e.forEach(e=>this.unbindListener(t,e)),n.forEach(e=>this.unbindMessageHandler(t,e))}adoptedCallback(){var{component:t,content:e}=this;t.adoptedCallback&&t.adoptedCallback(),this.content=e}}).observedAttributes=i,e}define(t,e,n){if(customElements.get(t))return this;var r=this.prepare(e);return window.customElements.define(t,r,n),this}}var p=new class{},f={director:p,selector:"[data-v]",datasets:"[v-attribute]",bootstrap:function t(e){var n=e,r=(this.selector,n.dataset||{}),i=r.behavior||n.v||"",s=i.split(/[\s]+/gim),o=n.children;document;var a=function(e,n){n.parentNode===e&&t.call(this,n)}.bind(this,n);Array.prototype.forEach.call(o,a),i&&s.forEach(this.bootstrap.bind(this,n))},decorators:{services:i,components:s}};var d=new function t(e,n){return n.call((function r(){return this instanceof r?new t(e,n):r.register.apply(r,arguments)}),new e)}(class{constructor(){this.dConfiguration=new r.a,this.pConfiguration=this.dConfiguration.promise,this.dInitialization=new r.a,this.pInitialization=this.dInitialization.promise,this.utils=new r.b,this.engine=new h(s,p),this.services={},this.components={},this.elements={},this.configuration=f;var{pInitialization:t,elements:e}=this;return t.then(t=>console.log("INIT",t)),this.pConfiguration.then(t=>this.dInitialization.resolve({target:document})),this}init(t){if(!t)throw Error("Vertices Core initialized without options");return this.arm(t),this}configure(t){return this.utils.extend(this.configuration,t),this.engine=new h(this.configuration.decorators.components,this.configuration.director),this.dConfiguration.resolve(this.configuration),this.utils.extend({},this.configuration)}registerService(t){var e=t.constructor,n={id:e,Constructor:t};return this.services[e]=this.services[e]||n,this}registerComponent(t,e){var n={id:t,Constructor:e};return this.components[t]=this.components[t]||n,this}define(t){var{name:e,Class:n,options:r}=t,{dConfiguration:i}=this,{promise:s}=i;return s.then(t=>this.engine.define(e,n,r)),this}arm(t){var e=this.configuration,n=e.bootstrap,r=t.target;this.startServices(),n.call(e,r,this)}startServices(){this.configuration.decorators;for(var t in this.services)this.startService(this.services[t],t,this.services);return this}startService(t,e,n){var{configuration:r,utils:s}=this,{director:o,decorators:a}=r,{services:c=i}=a;new(0,t.Constructor)(new c(s,o)).init()}bootstrap(t,e,n){if(!t||!n)return null;if(!this.components[n])return this.utils.console.warn("Unregistered Component: "+n),null;var{configuration:r}=this,{director:i,decorators:o}=r,{components:a=s}=o,c=new(0,this.components[n].Constructor)(new a(t,i)),u={id:n,instance:c,element:t,data:e=e||{}};return c.init(e),u}},(function(t){return this.utils=t.utils,this.config=function(){return t.configure.apply(t,arguments)},this.service=function(e){return t.registerService.apply(t,arguments),this},this.element=function(e){return t.define(e),this},this.component=function(e,n){return t.registerComponent.apply(t,arguments),this},this.register=function(t,e){return this[{string:"component",function:"service",object:t.type}[typeof t]].call(this,t,e),this},this.bootstrap=function(e){return t.init(e),this},this})),m=n(2),v=n(4),b={writable:!0,configurable:!0,enumerable:!0};function g(t,e){var n=v()[1].getFileName(),{template:r="",lazy:i="undefined"}=(t=Object.assign(Object.assign({},t),{options:e,type:"element"}),t),s=(m.join(n,r),{undefined:()=>Promise.resolve(r)}[i]());return function(e){return e.template=r,e.pTemplate=s,Object.assign(Object.assign({},t),{Class:e})}}function y(t){return function(t,e,n={}){var{constructor:r}=t,{get:i,set:s}=n,o=!(!i&&!s);n=Object.assign({},n);return o||(n.writable=!0),r.observedAttributes=r.observedAttributes||[],r.observedAttributes.push(e),n}}function w(t){return function(e,n,r){var{constructor:i}=e,{value:s}=(r=Object.assign(Object.assign({},r),b),r);return i.watchers=i.watchers||new Map,i.watchers.set(t,{attr:t,name:n,handler:s}),r}}function x(t){return function(e,n,r){var{constructor:i}=e,{value:s}=(r=Object.assign(Object.assign({},r),b),r);return i.listeners=i.listeners||[],i.listeners.push({type:t,name:n,handler:s}),r}}function O(t,e){var n=[].concat(e),r=new Set(n);return function(e,n,i){var{constructor:s}=e,{value:o}=(i=Object.assign(Object.assign({},i),b),i);return s.subscriptions=s.subscriptions||[],s.subscriptions.push({type:t,name:n,value:o,operators:r}),i}}function E(t){return function(e,n,r){var{constructor:i}=e;r=Object.assign(Object.assign({},r),b);return i.operators=i.operators||[],i.operators.push({operator:t,name:n}),r}}n.d(e,"V",(function(){return d})),n.d(e,"Element",(function(){return g})),n.d(e,"attr",(function(){return y})),n.d(e,"watch",(function(){return w})),n.d(e,"handler",(function(){return x})),n.d(e,"message",(function(){return O})),n.d(e,"pipe",(function(){return E}))},function(t,e,n){"use strict";var r=new class{stringify(t,e,n){var r=new Map,i=new Map,s=new Map,o=[],a=[],c=0;e||(e=Object.keys(t.reduce((t,e)=>Object.assign(Object.assign({},t),e),{})));for(let n=0,u=t.length;n<u;n++)for(let u=0,l=e.length;u<l;u++)!function(t,[e,n],u,l,h,p,f,d){var m=e,v=p,b=r.get(m)||{_id:m},g=i.get(p)||[],y=s.get(e)||[];({undefined:!0})[t]&&(t=""),o[e]=o[e]||[],o[e][n]=b[v]=g[e]=y[n]=t,r.set(m,b),i.set(p,g),s.set(e,y),c=Math.max.apply(null,[c,p.length,`${t}`.length]),a[e]=y.join(",")}(t[n][e[u]],[n,u],t[n],0,0,e[u]);var u=Array.apply(null,{length:c});n={"\t":u.map(()=>"\t"),s:u.map(()=>"s"),undefined:[]}[n].join("");return[e.join(",")].concat(a).join("\n").replace(/,/gim,`,${n}`)}parse(t){var e=t.split(/\n+/gim),[n]=e,n=n.split(/,\t*/);return e.slice(1).reduce(function(t,e,n,r,i){var s=t.reduce(function(t,e,n,r,i){var s=t.split(/,\s*/)[r],o={[n]:s};return Object.assign(Object.assign({},e),o)}.bind(this,n),{});return e.push(s),e}.bind(this,n),[])}};class i{constructor(){return this.CSV=r,this.console=console,this}noop(){}extend(t,e,...n){var r=Object.keys(e).reduce((t,n)=>(t[n]=e[n],t),t);return n.length?this.extend(t,...n):r}is(t){return!{null:!0,undefined:!0,"":!0,0:!1}[t]}timeout(t,...e){return window.setTimeout(t,...e)}enqueue(t,...e){return this.timeout(t,0,...e)}interval(t,e,...n){var r=this,i=r.timeout((function s(...o){if(!i)return console.log("break");t.call(this,...o),i=r.timeout(s,e,...n)}),e,...n);return function(){return clearTimeout(i),!(i=null)}}debounce(t,e){var n=null;return function(...r){var i=this;clearTimeout(n),n=setTimeout(()=>t.call(i,...r),e)}}throttle(t,e,n){var r;e=e||250;return function(...i){var s=n||this,o=+new Date,a=o,c=()=>(t.call(s,...i),a=o);if(!a||o>=a+e)return c();clearTimeout(r),r=setTimeout(c,e)}}uuid(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var e=16*Math.random()|0;return("x"==t?e:3&e|8).toString(16)}))}escapeHTML(t){return t.replace(/[&"<>]/g,(function(t){return{"&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"}[t]}))}interpolate(t){return e=>t.replace(/{([^{}]*)}/g,(t,n)=>{var r=""+e[n];return this.escapeHTML(r)})}INSECURE_INTERPOLATE(t){return function(e){return t.replace(/{([^{}]*)}/g,(function(t,n){return""+e[n]}))}}exterpolate(t){t=t||"";var e=/:[^\s/]+|{+[^\s/]+}+/g,n=new RegExp(t.replace(e,"([\\w-]+)"));return function(r){if(!r.match(n))return!1;var i=(r=r||"").match(n),s=t.match(e),o=i.slice(1),a={};if(s&&o)for(var c=0,u=s.length;c<u;c++){var l=s[c].replace(/[:{}]+/g,""),h=o[c];l!==h&&(a[l]=h)}return a}}parseURL(t){var e=document.createElement("a");return e.href=t,{hash:e.hash,host:e.host,hostname:e.hostname,href:e.href,origin:e.origin,pathname:e.pathname,port:e.port,protocol:e.protocol,search:e.search}}sortByKey(t,e,n){return e[t]>n[t]?1:e[t]<n[t]?-1:0}priorityMethodSort(t,e,n){var r=0;for(t=Array.prototype.slice.call(t||[],0);0===r&&t.length;)r=t.shift().call(this,e,n);return r}priorityKeySort(t,e,n){var r=0;for(t=Array.prototype.slice.call(t||[],0);0===r&&t.length;)r=this.sortByKey.call(this,t.shift(),e,n);return r}getFileSize(t,e="auto"){for(var n=this.toFixed.bind(this),r=n(t||0),i=n(r/1024),s=n(i/1024),o=n(s/1024),a=n(o/1024),c=n(a/1024),u={bytes:`${r} bytes`,KB:`${i} KB`,MB:`${s} MB`,GB:`${o} GB`,TB:`${a} TB`,PB:`${c} PB`,auto:void 0},l={unit:"",value:1/0},h=[{unit:"bytes",value:r},{unit:"KB",value:i},{unit:"MB",value:s},{unit:"GB",value:o},{unit:"TB",value:a},{unit:"PB",value:c}];l.value/1024>=1&&h.length;)l=h.shift();return u.auto=`${l.value} ${l.unit}`,u[e]}toFixed(t){return Number(Math.round(+(t+"e2"))+"e-2")}exists(t){return!!~t}}class s{constructor(){this._resolve=()=>{},this._reject=()=>{},this.promise=new Promise(this.exe.bind(this))}exe(t,e){this._resolve=t,this._reject=e}resolve(t){return this._resolve(t),this.promise}reject(t){return this._reject(t),this.promise}}n.d(e,"b",(function(){return i})),n.d(e,"a",(function(){return s}))},function(t,e,n){(function(t){function n(t,e){for(var n=0,r=t.length-1;r>=0;r--){var i=t[r];"."===i?t.splice(r,1):".."===i?(t.splice(r,1),n++):n&&(t.splice(r,1),n--)}if(e)for(;n--;n)t.unshift("..");return t}function r(t,e){if(t.filter)return t.filter(e);for(var n=[],r=0;r<t.length;r++)e(t[r],r,t)&&n.push(t[r]);return n}e.resolve=function(){for(var e="",i=!1,s=arguments.length-1;s>=-1&&!i;s--){var o=s>=0?arguments[s]:t.cwd();if("string"!=typeof o)throw new TypeError("Arguments to path.resolve must be strings");o&&(e=o+"/"+e,i="/"===o.charAt(0))}return(i?"/":"")+(e=n(r(e.split("/"),(function(t){return!!t})),!i).join("/"))||"."},e.normalize=function(t){var s=e.isAbsolute(t),o="/"===i(t,-1);return(t=n(r(t.split("/"),(function(t){return!!t})),!s).join("/"))||s||(t="."),t&&o&&(t+="/"),(s?"/":"")+t},e.isAbsolute=function(t){return"/"===t.charAt(0)},e.join=function(){var t=Array.prototype.slice.call(arguments,0);return e.normalize(r(t,(function(t,e){if("string"!=typeof t)throw new TypeError("Arguments to path.join must be strings");return t})).join("/"))},e.relative=function(t,n){function r(t){for(var e=0;e<t.length&&""===t[e];e++);for(var n=t.length-1;n>=0&&""===t[n];n--);return e>n?[]:t.slice(e,n-e+1)}t=e.resolve(t).substr(1),n=e.resolve(n).substr(1);for(var i=r(t.split("/")),s=r(n.split("/")),o=Math.min(i.length,s.length),a=o,c=0;c<o;c++)if(i[c]!==s[c]){a=c;break}var u=[];for(c=a;c<i.length;c++)u.push("..");return(u=u.concat(s.slice(a))).join("/")},e.sep="/",e.delimiter=":",e.dirname=function(t){if("string"!=typeof t&&(t+=""),0===t.length)return".";for(var e=t.charCodeAt(0),n=47===e,r=-1,i=!0,s=t.length-1;s>=1;--s)if(47===(e=t.charCodeAt(s))){if(!i){r=s;break}}else i=!1;return-1===r?n?"/":".":n&&1===r?"/":t.slice(0,r)},e.basename=function(t,e){var n=function(t){"string"!=typeof t&&(t+="");var e,n=0,r=-1,i=!0;for(e=t.length-1;e>=0;--e)if(47===t.charCodeAt(e)){if(!i){n=e+1;break}}else-1===r&&(i=!1,r=e+1);return-1===r?"":t.slice(n,r)}(t);return e&&n.substr(-1*e.length)===e&&(n=n.substr(0,n.length-e.length)),n},e.extname=function(t){"string"!=typeof t&&(t+="");for(var e=-1,n=0,r=-1,i=!0,s=0,o=t.length-1;o>=0;--o){var a=t.charCodeAt(o);if(47!==a)-1===r&&(i=!1,r=o+1),46===a?-1===e?e=o:1!==s&&(s=1):-1!==e&&(s=-1);else if(!i){n=o+1;break}}return-1===e||-1===r||0===s||1===s&&e===r-1&&e===n+1?"":t.slice(e,r)};var i="b"==="ab".substr(-1)?function(t,e,n){return t.substr(e,n)}:function(t,e,n){return e<0&&(e=t.length+e),t.substr(e,n)}}).call(this,n(3))},function(t,e){var n,r,i=t.exports={};function s(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function a(t){if(n===setTimeout)return setTimeout(t,0);if((n===s||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:s}catch(t){n=s}try{r="function"==typeof clearTimeout?clearTimeout:o}catch(t){r=o}}();var c,u=[],l=!1,h=-1;function p(){l&&c&&(l=!1,c.length?u=c.concat(u):h=-1,u.length&&f())}function f(){if(!l){var t=a(p);l=!0;for(var e=u.length;e;){for(c=u,u=[];++h<e;)c&&c[h].run();h=-1,e=u.length}c=null,l=!1,function(t){if(r===clearTimeout)return clearTimeout(t);if((r===o||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(t);try{r(t)}catch(e){try{return r.call(null,t)}catch(e){return r.call(this,t)}}}(t)}}function d(t,e){this.fun=t,this.array=e}function m(){}i.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];u.push(new d(t,e)),1!==u.length||l||a(f)},d.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=m,i.addListener=m,i.once=m,i.off=m,i.removeListener=m,i.removeAllListeners=m,i.emit=m,i.prependListener=m,i.prependOnceListener=m,i.listeners=function(t){return[]},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},function(t,e){t.exports=function(){var t=Error.prepareStackTrace;Error.prepareStackTrace=function(t,e){return e};var e=new Error;Error.captureStackTrace(e,arguments.callee);var n=e.stack;return Error.prepareStackTrace=t,n}},function(t,e,n){"use strict";var r,i=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},s=function(){var t={};return function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}t[e]=n}return t[e]}}(),o={};function a(t,e,n){for(var r=0;r<e.length;r++){var i={css:e[r][1],media:e[r][2],sourceMap:e[r][3]};o[t][r]?o[t][r](i):o[t].push(m(i,n))}}function c(t){var e=document.createElement("style"),r=t.attributes||{};if(void 0===r.nonce){var i=n.nc;i&&(r.nonce=i)}if(Object.keys(r).forEach((function(t){e.setAttribute(t,r[t])})),"function"==typeof t.insert)t.insert(e);else{var o=s(t.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(e)}return e}var u,l=(u=[],function(t,e){return u[t]=e,u.filter(Boolean).join("\n")});function h(t,e,n,r){var i=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=l(e,i);else{var s=document.createTextNode(i),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(s,o[e]):t.appendChild(s)}}function p(t,e,n){var r=n.css,i=n.media,s=n.sourceMap;if(i?t.setAttribute("media",i):t.removeAttribute("media"),s&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(s))))," */")),t.styleSheet)t.styleSheet.cssText=r;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r))}}var f=null,d=0;function m(t,e){var n,r,i;if(e.singleton){var s=d++;n=f||(f=c(e)),r=h.bind(null,n,s,!1),i=h.bind(null,n,s,!0)}else n=c(e),r=p.bind(null,n,e),i=function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(n)};return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e)}else i()}}t.exports=function(t,e,n){return(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=i()),t=n.base?t+n.base:t,e=e||[],o[t]||(o[t]=[]),a(t,e,n),function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){o[t]||(o[t]=[]),a(t,e,n);for(var r=e.length;r<o[t].length;r++)o[t][r]();o[t].length=e.length,0===o[t].length&&delete o[t]}}}},function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=(o=r,a=btoa(unescape(encodeURIComponent(JSON.stringify(o)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(c," */")),s=r.sources.map((function(t){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(t," */")}));return[n].concat(s).concat([i]).join("\n")}var o,a,c;return[n].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r=0;r<t.length;r++){var i=[].concat(t[r]);n&&(i[2]?i[2]="".concat(n," and ").concat(i[2]):i[2]=n),e.push(i)}},e}},function(t,e,n){"use strict";n.r(e),n.d(e,"BackdropComponent",(function(){return o}));var r=n(0),i=function(t,e,n,r){var i,s=arguments.length,o=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(o=(s<3?i(o):s>3?i(e,n,o):i(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};class s extends class{constructor(t={}){}}{constructor(t={}){super(t),this.id="";var{id:e}=t;return this.id=e||this.id,this}}let o=class{constructor(t){this.$=t,this.active=!1,this.options={},this.request=new s({})}watchOptions(t,e){console.log(">",t,e)}handleInteraction(t){var{$:e,request:n}=this;e.publish(e.channels["BACKDROP:INSPECTED"],n)}handleRequest(t){var{type:e,detail:n}=t,r=new s(n);console.log("@ BackdropComponent",e,n),this.request=r,this.active=!0}handleDismissed(t){var{type:e,detail:n}=t;console.log("@ BackdropComponent",e,n),this.active=!1}};i([Object(r.attr)()],o.prototype,"active",void 0),i([Object(r.attr)()],o.prototype,"options",void 0),i([Object(r.watch)("options")],o.prototype,"watchOptions",null),i([Object(r.handler)("click")],o.prototype,"handleInteraction",null),i([Object(r.message)("BACKDROP:REQUESTED")],o.prototype,"handleRequest",null),i([Object(r.message)("BACKDROP:DISMISSED")],o.prototype,"handleDismissed",null),o=i([Object(r.Element)({name:"v-backdrop"})],o)},,,,function(t,e,n){n(7),t.exports=n(12)},function(t,e,n){var r=n(5),i=n(13);"string"==typeof(i=i.__esModule?i.default:i)&&(i=[[t.i,i,""]]);var s={insert:"head",singleton:!1},o=(r(t.i,i,s),i.locals?i.locals:{});t.exports=o},function(t,e,n){(e=n(6)(!1)).push([t.i,'v-backdrop{position:fixed;top:0;bottom:0;left:0;right:0;background-color:#fff;opacity:0.8;display:none}v-backdrop[active="true"]{display:block}\n',""]),t.exports=e}],[[11,0]]]);
//# sourceMappingURL=v.sdk.backdrop.bundle.892811ea06aac4adf917.js.map