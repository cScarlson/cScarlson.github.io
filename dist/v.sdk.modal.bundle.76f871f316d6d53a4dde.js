(window.webpackJsonp=window.webpackJsonp||[]).push([[4],[function(e,t,n){"use strict";n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return i})),n.d(t,"d",(function(){return a})),n.d(t,"e",(function(){return c})),n.d(t,"j",(function(){return d})),n.d(t,"k",(function(){return p})),n.d(t,"l",(function(){return f})),n.d(t,"g",(function(){return h})),n.d(t,"f",(function(){return m})),n.d(t,"h",(function(){return b})),n.d(t,"i",(function(){return v}));var r={writable:!0,configurable:!0,enumerable:!0};function o(e,t){var n=Object.assign(Object.assign({},e),{options:t,decorator:"element",members:{}});return function(e){return e.meta=n,Object.assign(Object.assign({},n),{Class:e})}}function s(){}function i(){}function a(){}function c(){}class u{constructor(e){this.klass=e,this.$members=new Map,this.$observedAttributes=new Map,this.$watchers=new Map,this.$elements=new Map,this.$attrs=new Map,this.$listeners=new Map,this.$subscriptions=new Map;var{metadata:t}=e,{$members:n,$observedAttributes:r,$watchers:o,$elements:s,$attrs:i,$listeners:a,$subscriptions:c}=t||{};return this.$members=n||this.$members,this.$observedAttributes=r||this.$observedAttributes,this.$watchers=o||this.$watchers,this.$elements=s||this.$elements,this.$attrs=i||this.$attrs,this.$listeners=a||this.$listeners,this.$subscriptions=c||this.$subscriptions,e.metadata=this,this}}var l=new class extends class{namespace(e,t,n=t.split(".")){for(;n.length;)e[n[0]]||(e[n.shift()]={});return!!new Function(`return constructor.${t};`)()}ensure(e,t,n,r){this.namespace(e,t);var o=new Function("value",`object.${t} = value;`),s=new Function(`return object.${t};`);return o(r),s()}meta(e,t,n){this.namespace(e,"meta.members"),e.meta.members[t]=n}}{constructor(){super(...arguments),this.observe=e=>{var t=this;return function(n,o,s={}){var{constructor:i}=n,{value:a}=s,c=new u(i),l=(s=Object.assign(Object.assign({},s),r),{true:"observer",false:"observee"}[!!a]),d=t[l](e),p=d(...arguments);return c.$members.set(o,p),s}}}observee(e){return function(t,n,r={}){var{constructor:o}=t,{get:s,set:i}=r,a=!!s,c=!!i,l=a||c,d=a&&c,p=new u(o),f={decorator:"attribute:observee",name:e||n,alias:n,hasGet:a,hasSet:c,hasGetOrSet:l,hasGetAndSet:d};return l||(r.writable=!0),p.$members.set(n,f),p.$observedAttributes.set(n,f),f}}observer(e){return function(t,n,o={}){var{constructor:s}=t,{value:i}=(o=Object.assign(Object.assign({},o),r),o),a=new u(s),c={decorator:"attribute:observer",name:n,attr:e,handler:i};return a.$members.set(n,c),a.$watchers.set(e,c),c}}element(e){var t="this"===e;return function(n,o,s={}){var{constructor:i}=n,a=(s=Object.assign(Object.assign({},s),r),new u(i)),c={decorator:"reference:element",name:o,key:o,selector:e,isHost:t};return a.$members.set(o,c),a.$elements.set(o,c),s}}attr(e){var t=new RegExp(/^(.*)\[(.+)\]$/).exec(e),[n,o,s]=t,i="this"===o;return function(t,n,o={}){var{constructor:a}=t,c=(o=Object.assign(Object.assign({},o),r),new u(a)),l={decorator:"reference:attribute",name:s,key:n,selector:e,isHost:i};return c.$members.set(n,l),c.$attrs.set(n,l),o}}listener(e){var t=!e;return function(n,r,o={}){console.log("----------",n,r,o);var{constructor:s}=n,{value:i}=o,a=new u(s),c={decorator:"handler:dom",name:r,key:r,type:e,handler:i,isHost:t};return a.$members.set(r,c),a.$listeners.set(r,c),o}}message(e){return function(t,n,o={}){var{constructor:s}=t,{value:i}=(o=Object.assign(Object.assign({},o),r),o),a=new u(s),c={decorator:"handler:comm",name:n,key:n,type:e,handler:i};return a.$members.set(n,c),a.$subscriptions.set(n,c),o}}};const{observe:d,observee:p,observer:f,element:h,attr:m,listener:b,message:v}=l},,,function(e,t,n){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},s=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),i={};function a(e,t,n){for(var r=0;r<t.length;r++){var o={css:t[r][1],media:t[r][2],sourceMap:t[r][3]};i[e][r]?i[e][r](o):i[e].push(m(o,n))}}function c(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var o=n.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var i=s(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var u,l=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function d(e,t,n,r){var o=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=l(t,o);else{var s=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(s,i[t]):e.appendChild(s)}}function p(e,t,n){var r=n.css,o=n.media,s=n.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),s&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(s))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var f=null,h=0;function m(e,t){var n,r,o;if(t.singleton){var s=h++;n=f||(f=c(t)),r=d.bind(null,n,s,!1),o=d.bind(null,n,s,!0)}else n=c(t),r=p.bind(null,n,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t,n){return(n=n||{}).singleton||"boolean"==typeof n.singleton||(n.singleton=o()),e=n.base?e+n.base:e,t=t||[],i[e]||(i[e]=[]),a(e,t,n),function(t){if(t=t||[],"[object Array]"===Object.prototype.toString.call(t)){i[e]||(i[e]=[]),a(e,t,n);for(var r=t.length;r<i[e].length;r++)i[e][r]();i[e].length=t.length,0===i[e].length&&delete i[e]}}}},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(i=r,a=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(c," */")),s=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[n].concat(s).concat([o]).join("\n")}var i,a,c;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r=0;r<e.length;r++){var o=[].concat(e[r]);n&&(o[2]?o[2]="".concat(n," and ").concat(o[2]):o[2]=n),t.push(o)}},t}},function(e,t,n){"use strict";n.r(t);var r=n(0);n.d(t,"ModalComponent",(function(){return s}));var o=function(e,t,n,r){var o,s=arguments.length,i=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(i=(s<3?o(i):s>3?o(t,n,i):o(t,n))||i);return s>3&&i&&Object.defineProperty(t,n,i),i};let s=class{constructor(e){this.$=e,this.options={},this.test="this is some content",this.onConnected=()=>this.comm.publish(this.comm.channels["ELEMENT:TEMPLATE:FOUND"],'\r\n<div #container id="test" class="vertices modal">\r\n    <div class="id" data-test>\r\n        ...\r\n    </div>\r\n    <div id="wrap" class="modal container" (attributechange)="handleClique($event, active, \'other\')">\r\n        Modal is active: {{active}} {{test}}\r\n        <p><span><b>Bolder!</b><b>Boulder!</b></span></p>\r\n    </div>\r\n    <input id="{{item.id}}" type="literal" [value]="test" {{key}}="{{value}}" (input)="type($event)" *each="item of items" />\r\n    <input id="xxx" type="input" value="test" {{key}}="{{value}}" (input)="type($event)" />\r\n</div>\r\n\x3c!-- My Comment has="attr" --\x3e'),setTimeout(()=>this.attr.addEventListener("change",()=>console.log("GOT CHANGE"),!1),1e3)}get comm(){return this.$.comm}type(e){console.log("######",e)}handleOptionsChange(e,t){console.log("@options-change",e,t)}handleSomeEvent(e){console.log("@ MODEL - LISTENER #.id[data-test]",e.type,e)}handleMutation(e){console.log("HANDLING MUTATION",e)}};o([Object(r.j)("options")],s.prototype,"options",void 0),o([Object(r.g)("this")],s.prototype,"modal",void 0),o([Object(r.g)(".id[data-test]")],s.prototype,"el",void 0),o([Object(r.f)("this[data-test]")],s.prototype,"attr",void 0),o([Object(r.j)("options")],s.prototype,"handleOptionsChange",null),o([Object(r.h)("mutation"),Object(r.f)(".id[data-test]")],s.prototype,"handleSomeEvent",null),o([Object(r.i)("LEFECYCLE:ELEMENT:CREATED")],s.prototype,"onConnected",void 0),o([Object(r.i)("ELEMENT:MUTATION:OBSERVED")],s.prototype,"handleMutation",null),s=o([Object(r.c)({name:"v-modal"})],s)},,,,,,function(e,t,n){n(5),e.exports=n(12)},function(e,t,n){var r=n(3),o=n(13);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var s={insert:"head",singleton:!1},i=(r(e.i,o,s),o.locals?o.locals:{});e.exports=i},function(e,t,n){(t=n(4)(!1)).push([e.i,'v-modal{position:fixed;top:8%;bottom:8%;left:8%;right:8%;background-color:transparent;border:solid 1px #444;justify-content:center}v-modal[active="true"]{display:flex}v-modal .vertices.modal{background-color:#fff;border:solid 1px #444;border-radius:3px}\n',""]),e.exports=t}],[[11,0]]]);
//# sourceMappingURL=v.sdk.modal.bundle.76f871f316d6d53a4dde.js.map