(window.webpackJsonp=window.webpackJsonp||[]).push([[4],[function(e,t,n){"use strict";n.d(t,"d",(function(){return o})),n.d(t,"a",(function(){return i})),n.d(t,"g",(function(){return a})),n.d(t,"b",(function(){return c})),n.d(t,"c",(function(){return u})),n.d(t,"e",(function(){return l})),n.d(t,"f",(function(){return d})),n.d(t,"l",(function(){return b})),n.d(t,"m",(function(){return m})),n.d(t,"n",(function(){return v})),n.d(t,"i",(function(){return p})),n.d(t,"h",(function(){return h})),n.d(t,"j",(function(){return g})),n.d(t,"k",(function(){return j}));class r{constructor(e){this.klass=e,this.$members=new Map,this.$observedAttributes=new Map,this.$watchers=new Map,this.$elements=new Map,this.$attrs=new Map,this.$listeners=new Map,this.$subscriptions=new Map;var{metadata:t}=e,{$members:n,$observedAttributes:r,$watchers:s,$elements:o,$attrs:i,$listeners:a,$subscriptions:c}=t||{};return this.$members=n||this.$members,this.$observedAttributes=r||this.$observedAttributes,this.$watchers=s||this.$watchers,this.$elements=o||this.$elements,this.$attrs=i||this.$attrs,this.$listeners=a||this.$listeners,this.$subscriptions=c||this.$subscriptions,e.metadata=this,this}}var s={writable:!0,configurable:!0,enumerable:!0};function o(e,t){var n=Object.assign(Object.assign({},e),{type:"element",key:"selector",options:t,members:{}});return function(e){return e.meta=n,Object.assign(Object.assign({},n),{Class:e})}}function i(e){var t=Object.assign(Object.assign({},e),{type:"attribute",key:"selector"});return function(e){return Object.assign(Object.assign({},t),{Class:e})}}function a(e){var{selector:t="#text"}=e,n=Object.assign(Object.assign({},e),{type:"text",selector:t});return function(e){return Object.assign(Object.assign({},n),{Class:e})}}function c(e){var{selector:t="#comment"}=e,n=Object.assign(Object.assign({},e),{type:"comment",selector:t});return function(e){return Object.assign(Object.assign({},n),{Class:e})}}function u(e){var{type:t}=e;return{"#text":a(Object.assign(Object.assign({},e),{selector:"#text"})),"#comment":c(Object.assign(Object.assign({},e),{selector:"#comment"}))}[t]}function l(){}function d(e){var t=Object.assign(Object.assign({},e),{type:"service"});return function(e){var{id:n=e.name}=t;return Object.assign(Object.assign({},t),{selector:n,Class:e})}}var f=new class extends class{namespace(e,t,n=t.split(".")){for(;n.length;)e[n[0]]||(e[n.shift()]={});return!!new Function(`return constructor.${t};`)()}ensure(e,t,n,r){this.namespace(e,t);var s=new Function("value",`object.${t} = value;`),o=new Function(`return object.${t};`);return s(r),o()}meta(e,t,n){this.namespace(e,"meta.members"),e.meta.members[t]=n}}{constructor(){super(...arguments),this.observe=e=>{var t=this;return function(n,o,i={}){var{constructor:a}=n,{value:c}=i,u=new r(a),l=(i=Object.assign(Object.assign({},i),s),{true:"observer",false:"observee"}[!!c]),d=t[l](e),f=d(...arguments);return u.$members.set(o,f),i}}}observee(e){return function(t,n,s={}){var{constructor:o}=t,{get:i,set:a}=s,c=!!i,u=!!a,l=c||u,d=c&&u,f=new r(o),b={decorator:"attribute:observee",name:e||n,alias:n,hasGet:c,hasSet:u,hasGetOrSet:l,hasGetAndSet:d};return l||(s.writable=!0),f.$members.set(n,b),f.$observedAttributes.set(n,b),b}}observer(e){return function(t,n,o={}){var{constructor:i}=t,{value:a}=(o=Object.assign(Object.assign({},o),s),o),c=new r(i),u={decorator:"attribute:observer",name:n,attr:e,handler:a};return c.$members.set(n,u),c.$watchers.set(e,u),u}}element(e){var t="this"===e;return function(n,o,i={}){var{constructor:a}=n,c=(i=Object.assign(Object.assign({},i),s),new r(a)),u={decorator:"reference:element",name:o,key:o,selector:e,isHost:t};return c.$members.set(o,u),c.$elements.set(o,u),i}}attr(e){var t=new RegExp(/^(.*)\[(.+)\]$/).exec(e),[n,o,i]=t,a="this"===o;return function(t,n,o={}){var{constructor:c}=t,u=(o=Object.assign(Object.assign({},o),s),new r(c)),l={decorator:"reference:attribute",name:i,key:n,selector:e,isHost:a};return u.$members.set(n,l),u.$attrs.set(n,l),o}}listener(e){var t=!e;return function(n,s,o={}){var{constructor:i}=n,{value:a}=o,c=new r(i),u={decorator:"handler:dom",name:s,key:s,type:e,handler:a,isHost:t};return c.$members.set(s,u),c.$listeners.set(s,u),o}}message(e){return function(t,n,o={}){var{constructor:i}=t,{value:a}=(o=Object.assign(Object.assign({},o),s),o),c=new r(i),u={decorator:"handler:comm",name:n,key:n,type:e,handler:a};return c.$members.set(n,u),c.$subscriptions.set(n,u),o}}};const{observe:b,observee:m,observer:v,element:p,attr:h,listener:g,message:j}=f},,,,,function(e,t,n){"use strict";var r,s=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},o=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),i={};function a(e,t,n){for(var r=0;r<t.length;r++){var s={css:t[r][1],media:t[r][2],sourceMap:t[r][3]};i[e][r]?i[e][r](s):i[e].push(v(s,n))}}function c(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var s=n.nc;s&&(r.nonce=s)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var i=o(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var u,l=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function d(e,t,n,r){var s=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=l(t,s);else{var o=document.createTextNode(s),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(o,i[t]):e.appendChild(o)}}function f(e,t,n){var r=n.css,s=n.media,o=n.sourceMap;if(s?e.setAttribute("media",s):e.removeAttribute("media"),o&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var b=null,m=0;function v(e,t){var n,r,s;if(t.singleton){var o=m++;n=b||(b=c(t)),r=d.bind(null,n,o,!1),s=d.bind(null,n,o,!0)}else n=c(t),r=f.bind(null,n,t),s=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else s()}}e.exports=function(e,t,n){return(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=s()),e=n.base?e+n.base:e,t=t||[],i[e]||(i[e]=[]),a(e,t,n),function(t){if(t=t||[],"[object Array]"===Object.prototype.toString.call(t)){i[e]||(i[e]=[]),a(e,t,n);for(var r=t.length;r<i[e].length;r++)i[e][r]();i[e].length=t.length,0===i[e].length&&delete i[e]}}}},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var s=(i=r,a=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(c," */")),o=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[n].concat(o).concat([s]).join("\n")}var i,a,c;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r=0;r<e.length;r++){var s=[].concat(e[r]);n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),t.push(s)}},t}},function(e,t,n){"use strict";n.r(t);var r=n(0);n.d(t,"ModalComponent",(function(){return s}));let s=class{constructor(e){this.$=e,this.active="YO!",console.log("@Element({ selector: 'v-modal' })",e),e.content.set('\r\n<div #container id="test" class="vertices modal">\r\n    <div class="id" data-test>\r\n        ...\r\n        <slot name="some-slot">PLACEHOLDER</slot>\r\n        <slot name="some-slot-x">PLACEHOLDER-s-s-x</slot>\r\n        <slot name="some-slot">PLACEHOLDER</slot>\r\n        <hr />\r\n        <span>A <slot>PLACEHOLDER-Y</slot></span>\r\n        <span>B <slot>PLACEHOLDER-Y</slot></span>\r\n    </div>\r\n    <div id="wrap" class="modal container" (click)="handleClique($event, active, \'other\')">\r\n        Modal is active: {{active}} {{test}}\r\n        <p><span><b>Bolder!</b><b>Boulder!</b></span></p>\r\n    </div>\r\n    <input id="{{item.id}}" type="literal" [value]="test" {{key}}="{{value}}" (input)="type($event)" foreach="item of items" />\r\n    <input id="xxx" type="input" value="test" {{key}}="{{value}}" (input)="type($event)" />\r\n</div>\r\n\x3c!-- My Comment has="attr" --\x3e\r\n{{testText}}\r\n<div class="another">...</div>\r\n'),setTimeout(()=>e.publish("OUTPUT",{key:"data-poop",value:"turdz"}),5e3)}handleClique(e,t,n){return console.log("MODAL",t,n),!1}};s=function(e,t,n,r){var s,o=arguments.length,i=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(o<3?s(i):o>3?s(t,n,i):s(t,n))||i);return o>3&&i&&Object.defineProperty(t,n,i),i}([Object(r.d)({selector:"v-modal"})],s)},,,,,,function(e,t,n){n(7),e.exports=n(14)},function(e,t,n){var r=n(5),s=n(15);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[e.i,s,""]]);var o={insert:"head",singleton:!1},i=(r(e.i,s,o),s.locals?s.locals:{});e.exports=i},function(e,t,n){(t=n(6)(!1)).push([e.i,'v-modal{position:fixed;top:8%;bottom:8%;left:8%;right:8%;background-color:transparent;border:solid 1px #444;justify-content:center;overflow:auto}v-modal[active="true"]{display:flex}v-modal .vertices.modal{background-color:#fff;border:solid 1px #444;border-radius:3px}\n',""]),e.exports=t}],[[13,0]]]);
//# sourceMappingURL=v.sdk.modal.bundle.1d4efda64e35d52d2d89.js.map