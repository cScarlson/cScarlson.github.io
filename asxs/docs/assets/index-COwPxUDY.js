(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();const X="as:state";function he(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var A=he();function Qe(t){A=t}var E={exec:()=>null};function h(t,e=""){let r=typeof t=="string"?t:t.source,s={replace:(n,o)=>{let a=typeof o=="string"?o:o.source;return a=a.replace(f.caret,"$1"),r=r.replace(n,a),s},getRegex:()=>new RegExp(r,e)};return s}var Qt=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),f={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},Gt=/^(?:[ \t]*(?:\n|$))+/,Wt=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Zt=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,I=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ut=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,ge=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Ge=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,We=h(Ge).replace(/bull/g,ge).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Kt=h(Ge).replace(/bull/g,ge).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),me=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Yt=/^[^\n]+/,be=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Vt=h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",be).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Jt=h(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,ge).getRegex(),U="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",fe=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,er=h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",fe).replace("tag",U).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Ze=h(me).replace("hr",I).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",U).getRegex(),tr=h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Ze).getRegex(),ve={blockquote:tr,code:Wt,def:Vt,fences:Zt,heading:Ut,hr:I,html:er,lheading:We,list:Jt,newline:Gt,paragraph:Ze,table:E,text:Yt},_e=h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",I).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",U).getRegex(),rr={...ve,lheading:Kt,table:_e,paragraph:h(me).replace("hr",I).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",_e).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",U).getRegex()},nr={...ve,html:h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",fe).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:E,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:h(me).replace("hr",I).replace("heading",` *#{1,6} *[^
]`).replace("lheading",We).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},sr=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,or=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ue=/^( {2,}|\\)\n(?!\s*$)/,ar=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,K=/[\p{P}\p{S}]/u,xe=/[\s\p{P}\p{S}]/u,Ke=/[^\s\p{P}\p{S}]/u,ir=h(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,xe).getRegex(),Ye=/(?!~)[\p{P}\p{S}]/u,lr=/(?!~)[\s\p{P}\p{S}]/u,cr=/(?:[^\s\p{P}\p{S}]|~)/u,Ve=/(?![*_])[\p{P}\p{S}]/u,pr=/(?![*_])[\s\p{P}\p{S}]/u,dr=/(?:[^\s\p{P}\p{S}]|[*_])/u,ur=h(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Qt?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Je=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,hr=h(Je,"u").replace(/punct/g,K).getRegex(),gr=h(Je,"u").replace(/punct/g,Ye).getRegex(),et="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",mr=h(et,"gu").replace(/notPunctSpace/g,Ke).replace(/punctSpace/g,xe).replace(/punct/g,K).getRegex(),br=h(et,"gu").replace(/notPunctSpace/g,cr).replace(/punctSpace/g,lr).replace(/punct/g,Ye).getRegex(),fr=h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Ke).replace(/punctSpace/g,xe).replace(/punct/g,K).getRegex(),vr=h(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Ve).getRegex(),xr="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",kr=h(xr,"gu").replace(/notPunctSpace/g,dr).replace(/punctSpace/g,pr).replace(/punct/g,Ve).getRegex(),yr=h(/\\(punct)/,"gu").replace(/punct/g,K).getRegex(),wr=h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),$r=h(fe).replace("(?:-->|$)","-->").getRegex(),_r=h("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",$r).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),j=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,zr=h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",j).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),tt=h(/^!?\[(label)\]\[(ref)\]/).replace("label",j).replace("ref",be).getRegex(),rt=h(/^!?\[(ref)\](?:\[\])?/).replace("ref",be).getRegex(),Tr=h("reflink|nolink(?!\\()","g").replace("reflink",tt).replace("nolink",rt).getRegex(),ze=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,ke={_backpedal:E,anyPunctuation:yr,autolink:wr,blockSkip:ur,br:Ue,code:or,del:E,delLDelim:E,delRDelim:E,emStrongLDelim:hr,emStrongRDelimAst:mr,emStrongRDelimUnd:fr,escape:sr,link:zr,nolink:rt,punctuation:ir,reflink:tt,reflinkSearch:Tr,tag:_r,text:ar,url:E},Sr={...ke,link:h(/^!?\[(label)\]\((.*?)\)/).replace("label",j).getRegex(),reflink:h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",j).getRegex()},re={...ke,emStrongRDelimAst:br,emStrongLDelim:gr,delLDelim:vr,delRDelim:kr,url:h(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",ze).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:h(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",ze).getRegex()},Er={...re,br:h(Ue).replace("{2,}","*").getRegex(),text:h(re.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},N={normal:ve,gfm:rr,pedantic:nr},M={normal:ke,gfm:re,breaks:Er,pedantic:Sr},Cr={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Te=t=>Cr[t];function _(t,e){if(e){if(f.escapeTest.test(t))return t.replace(f.escapeReplace,Te)}else if(f.escapeTestNoEncode.test(t))return t.replace(f.escapeReplaceNoEncode,Te);return t}function Se(t){try{t=encodeURI(t).replace(f.percentDecode,"%")}catch{return null}return t}function Ee(t,e){let r=t.replace(f.findPipe,(o,a,l)=>{let i=!1,p=a;for(;--p>=0&&l[p]==="\\";)i=!i;return i?"|":" |"}),s=r.split(f.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(f.slashPipe,"|");return s}function L(t,e,r){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function Ar(t,e){if(t.indexOf(e[1])===-1)return-1;let r=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])r++;else if(t[s]===e[1]&&(r--,r<0))return s;return r>0?-2:-1}function Pr(t,e=0){let r=e,s="";for(let n of t)if(n==="	"){let o=4-r%4;s+=" ".repeat(o),r+=o}else s+=n,r++;return s}function Ce(t,e,r,s,n){let o=e.href,a=e.title||null,l=t[1].replace(n.other.outputLinkReplace,"$1");s.state.inLink=!0;let i={type:t[0].charAt(0)==="!"?"image":"link",raw:r,href:o,title:a,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,i}function Rr(t,e,r){let s=t.match(r.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(o=>{let a=o.match(r.other.beginningSpace);if(a===null)return o;let[l]=a;return l.length>=n.length?o.slice(n.length):o}).join(`
`)}var F=class{options;rules;lexer;constructor(t){this.options=t||A}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let r=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?r:L(r,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let r=e[0],s=Rr(r,e[3]||"",this.rules);return{type:"code",raw:r,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let r=e[2].trim();if(this.rules.other.endingHash.test(r)){let s=L(r,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(r=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:L(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let r=L(e[0],`
`).split(`
`),s="",n="",o=[];for(;r.length>0;){let a=!1,l=[],i;for(i=0;i<r.length;i++)if(this.rules.other.blockquoteStart.test(r[i]))l.push(r[i]),a=!0;else if(!a)l.push(r[i]);else break;r=r.slice(i);let p=l.join(`
`),c=p.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${p}`:p,n=n?`${n}
${c}`:c;let u=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,o,!0),this.lexer.state.top=u,r.length===0)break;let d=o.at(-1);if(d?.type==="code")break;if(d?.type==="blockquote"){let b=d,m=b.raw+`
`+r.join(`
`),k=this.blockquote(m);o[o.length-1]=k,s=s.substring(0,s.length-b.raw.length)+k.raw,n=n.substring(0,n.length-b.text.length)+k.text;break}else if(d?.type==="list"){let b=d,m=b.raw+`
`+r.join(`
`),k=this.list(m);o[o.length-1]=k,s=s.substring(0,s.length-d.raw.length)+k.raw,n=n.substring(0,n.length-b.raw.length)+k.raw,r=m.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:o,text:n}}}list(t){let e=this.rules.block.list.exec(t);if(e){let r=e[1].trim(),s=r.length>1,n={type:"list",raw:"",ordered:s,start:s?+r.slice(0,-1):"",loose:!1,items:[]};r=s?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=s?r:"[*+-]");let o=this.rules.other.listItemRegex(r),a=!1;for(;t;){let i=!1,p="",c="";if(!(e=o.exec(t))||this.rules.block.hr.test(t))break;p=e[0],t=t.substring(p.length);let u=Pr(e[2].split(`
`,1)[0],e[1].length),d=t.split(`
`,1)[0],b=!u.trim(),m=0;if(this.options.pedantic?(m=2,c=u.trimStart()):b?m=e[1].length+1:(m=u.search(this.rules.other.nonSpaceChar),m=m>4?1:m,c=u.slice(m),m+=e[1].length),b&&this.rules.other.blankLine.test(d)&&(p+=d+`
`,t=t.substring(d.length+1),i=!0),!i){let k=this.rules.other.nextBulletRegex(m),P=this.rules.other.hrRegex(m),R=this.rules.other.fencesBeginRegex(m),$e=this.rules.other.headingBeginRegex(m),jt=this.rules.other.htmlBeginRegex(m),Ft=this.rules.other.blockquoteBeginRegex(m);for(;t;){let V=t.split(`
`,1)[0],q;if(d=V,this.options.pedantic?(d=d.replace(this.rules.other.listReplaceNesting,"  "),q=d):q=d.replace(this.rules.other.tabCharGlobal,"    "),R.test(d)||$e.test(d)||jt.test(d)||Ft.test(d)||k.test(d)||P.test(d))break;if(q.search(this.rules.other.nonSpaceChar)>=m||!d.trim())c+=`
`+q.slice(m);else{if(b||u.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||R.test(u)||$e.test(u)||P.test(u))break;c+=`
`+d}b=!d.trim(),p+=V+`
`,t=t.substring(V.length+1),u=q.slice(m)}}n.loose||(a?n.loose=!0:this.rules.other.doubleBlankLine.test(p)&&(a=!0)),n.items.push({type:"list_item",raw:p,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),n.raw+=p}let l=n.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let i of n.items){if(this.lexer.state.top=!1,i.tokens=this.lexer.blockTokens(i.text,[]),i.task){if(i.text=i.text.replace(this.rules.other.listReplaceTask,""),i.tokens[0]?.type==="text"||i.tokens[0]?.type==="paragraph"){i.tokens[0].raw=i.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),i.tokens[0].text=i.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let p=this.rules.other.listTaskCheckbox.exec(i.raw);if(p){let c={type:"checkbox",raw:p[0]+" ",checked:p[0]!=="[ ]"};i.checked=c.checked,n.loose?i.tokens[0]&&["paragraph","text"].includes(i.tokens[0].type)&&"tokens"in i.tokens[0]&&i.tokens[0].tokens?(i.tokens[0].raw=c.raw+i.tokens[0].raw,i.tokens[0].text=c.raw+i.tokens[0].text,i.tokens[0].tokens.unshift(c)):i.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):i.tokens.unshift(c)}}if(!n.loose){let p=i.tokens.filter(u=>u.type==="space"),c=p.length>0&&p.some(u=>this.rules.other.anyLine.test(u.raw));n.loose=c}}if(n.loose)for(let i of n.items){i.loose=!0;for(let p of i.tokens)p.type==="text"&&(p.type="paragraph")}return n}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let r=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:r,raw:e[0],href:s,title:n}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let r=Ee(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:e[0],header:[],align:[],rows:[]};if(r.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?o.align.push("right"):this.rules.other.tableAlignCenter.test(a)?o.align.push("center"):this.rules.other.tableAlignLeft.test(a)?o.align.push("left"):o.align.push(null);for(let a=0;a<r.length;a++)o.header.push({text:r[a],tokens:this.lexer.inline(r[a]),header:!0,align:o.align[a]});for(let a of n)o.rows.push(Ee(a,o.header.length).map((l,i)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:o.align[i]})));return o}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let r=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:r,tokens:this.lexer.inline(r)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let o=L(r.slice(0,-1),"\\");if((r.length-o.length)%2===0)return}else{let o=Ar(e[2],"()");if(o===-2)return;if(o>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+o;e[2]=e[2].substring(0,o),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],n="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(s);o&&(s=o[1],n=o[3])}else n=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?s=s.slice(1):s=s.slice(1,-1)),Ce(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let s=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[s.toLowerCase()];if(!n){let o=r[0].charAt(0);return{type:"text",raw:o,text:o}}return Ce(r,n,r[0],this.lexer,this.rules)}}emStrong(t,e,r=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&r.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,o,a,l=n,i=0,p=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(p.lastIndex=0,e=e.slice(-1*t.length+n);(s=p.exec(e))!=null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o)continue;if(a=[...o].length,s[3]||s[4]){l+=a;continue}else if((s[5]||s[6])&&n%3&&!((n+a)%3)){i+=a;continue}if(l-=a,l>0)continue;a=Math.min(a,a+l+i);let c=[...s[0]][0].length,u=t.slice(0,n+s.index+c+a);if(Math.min(n,a)%2){let b=u.slice(1,-1);return{type:"em",raw:u,text:b,tokens:this.lexer.inlineTokens(b)}}let d=u.slice(2,-2);return{type:"strong",raw:u,text:d,tokens:this.lexer.inlineTokens(d)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let r=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(r),n=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return s&&n&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:e[0],text:r}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,r=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,o,a,l=n,i=this.rules.inline.delRDelim;for(i.lastIndex=0,e=e.slice(-1*t.length+n);(s=i.exec(e))!=null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o||(a=[...o].length,a!==n))continue;if(s[3]||s[4]){l+=a;continue}if(l-=a,l>0)continue;a=Math.min(a,a+l);let p=[...s[0]][0].length,c=t.slice(0,n+s.index+p+a),u=c.slice(n,-n);return{type:"del",raw:c,text:u,tokens:this.lexer.inlineTokens(u)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let r,s;return e[2]==="@"?(r=e[1],s="mailto:"+r):(r=e[1],s=r),{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let r,s;if(e[2]==="@")r=e[0],s="mailto:"+r;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);r=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let r=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:r}}}},y=class ne{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||A,this.options.tokenizer=this.options.tokenizer||new F,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let r={other:f,block:N.normal,inline:M.normal};this.options.pedantic?(r.block=N.pedantic,r.inline=M.pedantic):this.options.gfm&&(r.block=N.gfm,this.options.breaks?r.inline=M.breaks:r.inline=M.gfm),this.tokenizer.rules=r}static get rules(){return{block:N,inline:M}}static lex(e,r){return new ne(r).lex(e)}static lexInline(e,r){return new ne(r).inlineTokens(e)}lex(e){e=e.replace(f.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let r=0;r<this.inlineQueue.length;r++){let s=this.inlineQueue[r];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,r=[],s=!1){for(this.options.pedantic&&(e=e.replace(f.tabCharGlobal,"    ").replace(f.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(a=>(n=a.call({lexer:this},e,r))?(e=e.substring(n.raw.length),r.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let a=r.at(-1);n.raw.length===1&&a!==void 0?a.raw+=`
`:r.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},r.push(n));continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),r.push(n);continue}let o=e;if(this.options.extensions?.startBlock){let a=1/0,l=e.slice(1),i;this.options.extensions.startBlock.forEach(p=>{i=p.call({lexer:this},l),typeof i=="number"&&i>=0&&(a=Math.min(a,i))}),a<1/0&&a>=0&&(o=e.substring(0,a+1))}if(this.state.top&&(n=this.tokenizer.paragraph(o))){let a=r.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n),s=o.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,r}inline(e,r=[]){return this.inlineQueue.push({src:e,tokens:r}),r}inlineTokens(e,r=[]){let s=e,n=null;if(this.tokens.links){let i=Object.keys(this.tokens.links);if(i.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)i.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,n.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let o;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)o=n[2]?n[2].length:0,s=s.slice(0,n.index+o)+"["+"a".repeat(n[0].length-o-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,l="";for(;e;){a||(l=""),a=!1;let i;if(this.options.extensions?.inline?.some(c=>(i=c.call({lexer:this},e,r))?(e=e.substring(i.raw.length),r.push(i),!0):!1))continue;if(i=this.tokenizer.escape(e)){e=e.substring(i.raw.length),r.push(i);continue}if(i=this.tokenizer.tag(e)){e=e.substring(i.raw.length),r.push(i);continue}if(i=this.tokenizer.link(e)){e=e.substring(i.raw.length),r.push(i);continue}if(i=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(i.raw.length);let c=r.at(-1);i.type==="text"&&c?.type==="text"?(c.raw+=i.raw,c.text+=i.text):r.push(i);continue}if(i=this.tokenizer.emStrong(e,s,l)){e=e.substring(i.raw.length),r.push(i);continue}if(i=this.tokenizer.codespan(e)){e=e.substring(i.raw.length),r.push(i);continue}if(i=this.tokenizer.br(e)){e=e.substring(i.raw.length),r.push(i);continue}if(i=this.tokenizer.del(e,s,l)){e=e.substring(i.raw.length),r.push(i);continue}if(i=this.tokenizer.autolink(e)){e=e.substring(i.raw.length),r.push(i);continue}if(!this.state.inLink&&(i=this.tokenizer.url(e))){e=e.substring(i.raw.length),r.push(i);continue}let p=e;if(this.options.extensions?.startInline){let c=1/0,u=e.slice(1),d;this.options.extensions.startInline.forEach(b=>{d=b.call({lexer:this},u),typeof d=="number"&&d>=0&&(c=Math.min(c,d))}),c<1/0&&c>=0&&(p=e.substring(0,c+1))}if(i=this.tokenizer.inlineText(p)){e=e.substring(i.raw.length),i.raw.slice(-1)!=="_"&&(l=i.raw.slice(-1)),a=!0;let c=r.at(-1);c?.type==="text"?(c.raw+=i.raw,c.text+=i.text):r.push(i);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return r}},Q=class{options;parser;constructor(t){this.options=t||A}space(t){return""}code({text:t,lang:e,escaped:r}){let s=(e||"").match(f.notSpaceStart)?.[0],n=t.replace(f.endingNewline,"")+`
`;return s?'<pre><code class="language-'+_(s)+'">'+(r?n:_(n,!0))+`</code></pre>
`:"<pre><code>"+(r?n:_(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,r=t.start,s="";for(let a=0;a<t.items.length;a++){let l=t.items[a];s+=this.listitem(l)}let n=e?"ol":"ul",o=e&&r!==1?' start="'+r+'"':"";return"<"+n+o+`>
`+s+"</"+n+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",r="";for(let n=0;n<t.header.length;n++)r+=this.tablecell(t.header[n]);e+=this.tablerow({text:r});let s="";for(let n=0;n<t.rows.length;n++){let o=t.rows[n];r="";for(let a=0;a<o.length;a++)r+=this.tablecell(o[a]);s+=this.tablerow({text:r})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${_(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:r}){let s=this.parser.parseInline(r),n=Se(t);if(n===null)return s;t=n;let o='<a href="'+t+'"';return e&&(o+=' title="'+_(e)+'"'),o+=">"+s+"</a>",o}image({href:t,title:e,text:r,tokens:s}){s&&(r=this.parser.parseInline(s,this.parser.textRenderer));let n=Se(t);if(n===null)return _(r);t=n;let o=`<img src="${t}" alt="${_(r)}"`;return e&&(o+=` title="${_(e)}"`),o+=">",o}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:_(t.text)}},ye=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},w=class se{options;renderer;textRenderer;constructor(e){this.options=e||A,this.options.renderer=this.options.renderer||new Q,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ye}static parse(e,r){return new se(r).parse(e)}static parseInline(e,r){return new se(r).parseInline(e)}parse(e){let r="";for(let s=0;s<e.length;s++){let n=e[s];if(this.options.extensions?.renderers?.[n.type]){let a=n,l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){r+=l||"";continue}}let o=n;switch(o.type){case"space":{r+=this.renderer.space(o);break}case"hr":{r+=this.renderer.hr(o);break}case"heading":{r+=this.renderer.heading(o);break}case"code":{r+=this.renderer.code(o);break}case"table":{r+=this.renderer.table(o);break}case"blockquote":{r+=this.renderer.blockquote(o);break}case"list":{r+=this.renderer.list(o);break}case"checkbox":{r+=this.renderer.checkbox(o);break}case"html":{r+=this.renderer.html(o);break}case"def":{r+=this.renderer.def(o);break}case"paragraph":{r+=this.renderer.paragraph(o);break}case"text":{r+=this.renderer.text(o);break}default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}parseInline(e,r=this.renderer){let s="";for(let n=0;n<e.length;n++){let o=e[n];if(this.options.extensions?.renderers?.[o.type]){let l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){s+=l||"";continue}}let a=o;switch(a.type){case"escape":{s+=r.text(a);break}case"html":{s+=r.html(a);break}case"link":{s+=r.link(a);break}case"image":{s+=r.image(a);break}case"checkbox":{s+=r.checkbox(a);break}case"strong":{s+=r.strong(a);break}case"em":{s+=r.em(a);break}case"codespan":{s+=r.codespan(a);break}case"br":{s+=r.br(a);break}case"del":{s+=r.del(a);break}case"text":{s+=r.text(a);break}default:{let l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},O=class{options;block;constructor(t){this.options=t||A}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?y.lex:y.lexInline}provideParser(){return this.block?w.parse:w.parseInline}},Dr=class{defaults=he();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=w;Renderer=Q;TextRenderer=ye;Lexer=y;Tokenizer=F;Hooks=O;constructor(...t){this.use(...t)}walkTokens(t,e){let r=[];for(let s of t)switch(r=r.concat(e.call(this,s)),s.type){case"table":{let n=s;for(let o of n.header)r=r.concat(this.walkTokens(o.tokens,e));for(let o of n.rows)for(let a of o)r=r.concat(this.walkTokens(a.tokens,e));break}case"list":{let n=s;r=r.concat(this.walkTokens(n.items,e));break}default:{let n=s;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(o=>{let a=n[o].flat(1/0);r=r.concat(this.walkTokens(a,e))}):n.tokens&&(r=r.concat(this.walkTokens(n.tokens,e)))}}return r}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(r=>{let s={...r};if(s.async=this.defaults.async||s.async||!1,r.extensions&&(r.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let o=e.renderers[n.name];o?e.renderers[n.name]=function(...a){let l=n.renderer.apply(this,a);return l===!1&&(l=o.apply(this,a)),l}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=e[n.level];o?o.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),r.renderer){let n=this.defaults.renderer||new Q(this.defaults);for(let o in r.renderer){if(!(o in n))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let a=o,l=r.renderer[a],i=n[a];n[a]=(...p)=>{let c=l.apply(n,p);return c===!1&&(c=i.apply(n,p)),c||""}}s.renderer=n}if(r.tokenizer){let n=this.defaults.tokenizer||new F(this.defaults);for(let o in r.tokenizer){if(!(o in n))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let a=o,l=r.tokenizer[a],i=n[a];n[a]=(...p)=>{let c=l.apply(n,p);return c===!1&&(c=i.apply(n,p)),c}}s.tokenizer=n}if(r.hooks){let n=this.defaults.hooks||new O;for(let o in r.hooks){if(!(o in n))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let a=o,l=r.hooks[a],i=n[a];O.passThroughHooks.has(o)?n[a]=p=>{if(this.defaults.async&&O.passThroughHooksRespectAsync.has(o))return(async()=>{let u=await l.call(n,p);return i.call(n,u)})();let c=l.call(n,p);return i.call(n,c)}:n[a]=(...p)=>{if(this.defaults.async)return(async()=>{let u=await l.apply(n,p);return u===!1&&(u=await i.apply(n,p)),u})();let c=l.apply(n,p);return c===!1&&(c=i.apply(n,p)),c}}s.hooks=n}if(r.walkTokens){let n=this.defaults.walkTokens,o=r.walkTokens;s.walkTokens=function(a){let l=[];return l.push(o.call(this,a)),n&&(l=l.concat(n.call(this,a))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return y.lex(t,e??this.defaults)}parser(t,e){return w.parse(t,e??this.defaults)}parseMarkdown(t){return(e,r)=>{let s={...r},n={...this.defaults,...s},o=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let a=n.hooks?await n.hooks.preprocess(e):e,l=await(n.hooks?await n.hooks.provideLexer():t?y.lex:y.lexInline)(a,n),i=n.hooks?await n.hooks.processAllTokens(l):l;n.walkTokens&&await Promise.all(this.walkTokens(i,n.walkTokens));let p=await(n.hooks?await n.hooks.provideParser():t?w.parse:w.parseInline)(i,n);return n.hooks?await n.hooks.postprocess(p):p})().catch(o);try{n.hooks&&(e=n.hooks.preprocess(e));let a=(n.hooks?n.hooks.provideLexer():t?y.lex:y.lexInline)(e,n);n.hooks&&(a=n.hooks.processAllTokens(a)),n.walkTokens&&this.walkTokens(a,n.walkTokens);let l=(n.hooks?n.hooks.provideParser():t?w.parse:w.parseInline)(a,n);return n.hooks&&(l=n.hooks.postprocess(l)),l}catch(a){return o(a)}}}onError(t,e){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+_(r.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(r);throw r}}},C=new Dr;function g(t,e){return C.parse(t,e)}g.options=g.setOptions=function(t){return C.setOptions(t),g.defaults=C.defaults,Qe(g.defaults),g};g.getDefaults=he;g.defaults=A;g.use=function(...t){return C.use(...t),g.defaults=C.defaults,Qe(g.defaults),g};g.walkTokens=function(t,e){return C.walkTokens(t,e)};g.parseInline=C.parseInline;g.Parser=w;g.parser=w.parse;g.Renderer=Q;g.TextRenderer=ye;g.Lexer=y;g.lexer=y.lex;g.Tokenizer=F;g.Hooks=O;g.parse=g;g.options;g.setOptions;g.use;g.walkTokens;g.parseInline;w.parse;y.lex;const $=new class{parse(e){return g.parse(e)}secure(e){const r=this.parse(e);return this.escapeHTML(r)}escapeHTML(e){const r=document.createElement("textarea");return r.textContent=e,r.innerHTML}},v=new class{delay=(e=0)=>new Promise(r=>setTimeout(r,e));escapeHTML=e=>$.escapeHTML(e);uuid(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var r=Math.random()*16|0,s=e=="x"?r:r&3|8;return s.toString(16)})}get(r){var r=r.replace(".","?.");return new Function("o",`return o?.${r};`)}supplant(e){const r=this;return s=>e.replace(/{([^{}]*)}/g,function(o,a){var l=r.get(a)(s);return typeof l=="string"||typeof l=="number"?l:o})}interpolate(e){return r=>new Function(`with (this) return \`${e}\`;`).call(r)}debounce(e,r){let s=-1;return function(...o){const a=this;clearTimeout(s),s=setTimeout(l=>e.call(a,...o),r)}}throttle(e,r=250,s){let n,o;return function(...l){const i=s||this,p=+new Date;n&&p<n+r?(clearTimeout(o),o=setTimeout(function(){n=p,e.apply(i,l)},r)):(n=p,e.apply(i,l))}}};function x(t,e){return function(s){return customElements.get(t)||customElements.define(t,s,e),s}}class J extends Array{template="{MISSING CONTENT}";as=X;context={};constructor(e){typeof e=="number"?super(e):super(...e)}with(e){return this.template=e,this}use(e={},r=this.as){return this.context=e,this.as=r,this}toString(){const{template:e,context:r,as:s}=this,{[X]:n=r}=r,o=(a,l,i)=>{const p={[s]:n,"as:loop":this,"as:index":i},c=Object.assign(l,p);return v.interpolate(`${a}${e}`)(c)};return this.reduce(o,"")}}class qr{constructor(e,r){this.receiver=e,this.action=r}execute=(...e)=>{const{receiver:r,action:s}=this;return r[s](...s)}}const Mr="as:crawler:handler:default";class Lr extends qr{constructor(e,r=Mr){super(e,r)}execute=(e,...r)=>{if(!e)return e;const{receiver:s,action:n}=this,{[n]:o}=s,{dataset:a,children:l=[]}=e,{["[query]"]:i}=a;i&&(s[`as:query:${i}`]=e),o&&o.call(s,e),this.execute(...r),this.execute(...l)}}const{warn:Or}=console;class Br extends HTMLElement{static observedAttributes=[];root=this.shadowRoot;handleEvent(e){const{type:r,target:s}=e,{dataset:n}=s,{[`(${r})`]:o}=n,{[`${r}:${o}`]:a}=this;a?a.call(this,e):Or(`WARNING. Uncaught Event: "${r}" expected handler "${o}".`)}connectedCallback(){this.root=this.createRenderRoot()}disconnectedCallback(){}adoptedCallback(){}connectedMoveCallback(){}attributeChangedCallback(e,r,s){`attr:${e}`in this&&this[`attr:${e}`](s,r)}createRenderRoot(){return this.root?this.root:this.shadowRoot?this.shadowRoot:this.attachShadow({mode:"open"})}update(e){const{root:r}=this,{["as:crawler"]:s,["as:update:handler"]:n}=this,{children:o}=r;r.innerHTML=e,s&&s.execute(...o),n&&n.call(this,e)}}class Ir extends Br{get[X](){return{}}update(e,r=this[X]){const s=v.interpolate(e)(r);super.update(s)}}class Nr extends Ir{connectedCallback(e=super.connectedCallback()){const r=this.render();this.update(r)}disconnectedCallback(){this.innerHTML=""}render(){return this.innerHTML}}class we extends Nr{}var Hr=Object.defineProperty,Xr=Object.getOwnPropertyDescriptor,nt=t=>{throw TypeError(t)},jr=(t,e,r)=>e in t?Hr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Fr=(t,e,r,s)=>{for(var n=s>1?void 0:s?Xr(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n},Qr=(t,e,r)=>jr(t,e+"",r),st=(t,e,r)=>e.has(t)||nt("Cannot "+r),ee=(t,e,r)=>(st(t,e,"read from private field"),r?r.call(t):e.get(t)),Gr=(t,e,r)=>e.has(t)?nt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Wr=(t,e,r,s)=>(st(t,e,"write to private field"),e.set(t,r),r),D;const Zr="as-frameless-slots",Ur="as-red";let B=class extends HTMLElement{constructor(t){super(),Gr(this,D,this);const{meta:e,frame:r,contentDocument:s}=t,{name:n,content:o="shadow"}=e,{[`compose:${n}`]:a}=this,{dataset:l}=r,{enforce:i="shadow"}=l,c=!!customElements.get(n),u={...t,host:this},d=new MessageEvent(B.EVENT_LOADED_RED,{data:u,bubbles:!1});Wr(this,D,this.createRenderRoot(t)),c?this["compose:webcomponent"](t):a&&a.call(this,t),s.dispatchEvent(d)}createRenderRoot(t){return t.meta.content==="shadow"?this.attachShadow({mode:"open"}):t.frame.dataset.content==="shadow"?this.attachShadow({mode:"open"}):this}"compose:webcomponent"(t){const{meta:e,template:r,styles:s,script:n,attributes:o,contentDocument:a,frame:l}=t,{attributes:i}=e,{[0]:p}=i,{value:c}=p,{innerHTML:u,parentElement:d}=l,m=(d?.matches(Zr)?Array.from(d.childNodes):[]).filter(R=>R!==l),k=customElements.get(c),P=new k(t);P.innerHTML=u;for(const R of m)P.appendChild(R);return ee(this,D).appendChild(P),this}"compose:partial"(t){const{meta:e,template:r,styles:s,script:n,attributes:o,contentDocument:a,frame:l}=t,{type:i}=n;return i==="application/json"&&this["compose:partial:json"](t),ee(this,D).appendChild(s),ee(this,D).appendChild(r.content),this}"compose:partial:json"(t){const{meta:e,template:r,styles:s,script:n}=t,{innerHTML:o}=n,{innerHTML:a}=r,{innerHTML:l}=s,i=JSON.parse(o);s.innerHTML=v.interpolate(l)(i),r.innerHTML=v.interpolate(a)(i)}handleEvent(t){}connectedCallback(){}disconnectedCallback(){}};D=new WeakMap;Qr(B,"EVENT_LOADED_RED","red:loaded");B=Fr([x(Ur)],B);var Kr=Object.getOwnPropertyDescriptor,ot=t=>{throw TypeError(t)},Yr=(t,e,r,s)=>{for(var n=s>1?void 0:s?Kr(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n},at=(t,e,r)=>e.has(t)||ot("Cannot "+r),oe=(t,e,r)=>(at(t,e,"read from private field"),e.get(t)),te=(t,e,r)=>e.has(t)?ot("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Vr=(t,e,r)=>(at(t,e,"access private method"),r),G,ae,ie,it;const Jr="as-frameless";let Ae=class extends HTMLIFrameElement{constructor(){super(),te(this,ie),te(this,G,Promise.withResolvers()),te(this,ae,()=>{const{contentDocument:t}=this,{attributes:e}=this,{body:r}=t,{children:s}=r,{[0]:n,[1]:o,[2]:a,[3]:l}=s,i=new B({meta:n,template:o,styles:a,script:l,attributes:e,contentDocument:t,frame:this});this.after(i)}),this.width="0",this.height="0",this.style.border="none",this.style.display="none"}handleEvent(t){if(t.type==="load")return Vr(this,ie,it).call(this,t)}connectedCallback(){const{promise:t}=oe(this,G);t.then(oe(this,ae)),this.addEventListener("load",this,!0)}disconnectedCallback(){this.removeEventListener("load",this,!0)}};G=new WeakMap;ae=new WeakMap;ie=new WeakSet;it=function(t){oe(this,G).resolve(!0)};Ae=Yr([x(Jr,{extends:"iframe"})],Ae);var en=Object.getOwnPropertyDescriptor,lt=t=>{throw TypeError(t)},tn=(t,e,r,s)=>{for(var n=s>1?void 0:s?en(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n},rn=(t,e,r)=>e.has(t)||lt("Cannot "+r),nn=(t,e,r)=>e.has(t)?lt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),sn=(t,e,r)=>(rn(t,e,"access private method"),r),le,ct;const{warn:on}=console,pt="as-typescript";let Pe=class extends HTMLScriptElement{constructor(){super(...arguments),nn(this,le)}connectedCallback(){const{innerHTML:t}=this,e=sn(this,le,ct).call(this,t);this.innerHTML=e}disconnectedCallback(){}};le=new WeakSet;ct=function(t){return on(`@${this.constructor.name} Error ("${pt}"): TypeScript compilation is not yet supported.`),`${t}

 // TYPESCRIPT NOT YET SUPPORTED`};Pe=tn([x(pt,{extends:"script"})],Pe);const an=`\r
as-icon {\r
    --icon: var(--icon-type-placeholder);\r
    --size: var(--size-px-5);\r
    --color: black;\r
    display: inline-block;\r
    width: var(--size);\r
    height: var(--size);\r
    mask-image: var(--icon);\r
    mask-repeat: no-repeat;\r
    mask-position: center;\r
    mask-size: cover;\r
    background-color: var(--color);\r
    &.size {\r
        &.xxs { --size: var(--size-px-3)  }\r
        &.xs  { --size: var(--size-px-4)  }\r
        &.sm  { --size: var(--size-px-5)  }\r
        &.md  { --size: var(--size-px-7)  }\r
        &.lg  { --size: var(--size-px-8)  }\r
        &.xl  { --size: var(--size-px-9)  }\r
        &.xxl { --size: var(--size-px-11) }\r
    }\r
}\r
\r
as-icon {\r
    &:is([type="list"], &[type="menu"], &[type="bars3h"], &[type="hamburger"]) {\r
        --icon: var(--icon-type-list, var(--icon-type-menu, var(--icon-type-bars3h, var(--icon-type-hamburger))));\r
    }\r
}\r
`,ln=`\r
as-icon[strategy="bootstrap-icons"] {\r
    --icon-type-XXXXXXXX: url('data:[<media-type>][;base64],<data>');\r
    --icon-type-XXXXXXXX: url('data:image/svg+xml;charset=UTF-8,XXXXXXXX');\r
    --icon-type-list: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>');\r
}\r
`,cn=`\r
[is="as-button"] {\r
    --color-border: var(--color-bg);\r
    --color-bg: var(--color-light);\r
    --color-text: var(--color-dark);\r
    --padding: var(--size-2) var(--size-3);\r
    --font-size: var(--font-size-1);\r
    display: inline-flex;\r
    justify-content: center;\r
    align-items: center;\r
    gap: var(--size-2);\r
    margin: 0;\r
    box-shadow: var(--shadow-2);\r
    border: solid 1px var(--color-border);\r
    border-radius: var(--radius-2);\r
    padding: var(--padding);\r
    background-color: var(--color-bg);\r
    color: var(--color-text);\r
    text-decoration: none;\r
    font-size: var(--font-size);\r
    font-weight: var(--font-weight-6);\r
    line-height: var(--font-lineheight-1);\r
    cursor: pointer;\r
    &:hover, &:focus {\r
        filter: brightness(92.5%);\r
    }\r
    &.color {\r
        &.primary {\r
            --color-border: var(--color-bg);\r
            --color-bg: var(--color-primary);\r
            --color-text: var(--color-dark);\r
        }\r
        &.secondary {\r
            --color-border: var(--color-bg);\r
            --color-bg: var(--color-secondary);\r
            --color-text: var(--color-dark);\r
        }\r
        &.success {\r
            --color-border: var(--color-bg);\r
            --color-bg: var(--color-success);\r
            --color-text: var(--color-dark);\r
        }\r
        &.info {\r
            --color-border: var(--color-bg);\r
            --color-bg: var(--color-info);\r
            --color-text: var(--color-dark);\r
        }\r
        &.warning {\r
            --color-border: var(--color-bg);\r
            --color-bg: var(--color-warning);\r
            --color-text: var(--color-dark);\r
        }\r
        &.danger {\r
            --color-border: var(--color-bg);\r
            --color-bg: var(--color-danger);\r
            --color-text: var(--color-dark);\r
        }\r
        &.light {\r
            --color-border: var(--color-bg);\r
            --color-bg: var(--color-light);\r
            --color-text: var(--color-dark);\r
        }\r
        &.dark {\r
            --color-border: var(--color-bg);\r
            --color-bg: var(--color-dark);\r
            --color-text: var(--color-light);\r
        }\r
    }\r
    &.size {\r
        &.xxs {\r
            --padding: var(--size-1) var(--size-px-2);\r
            --font-size: var(--font-size-0);\r
        }\r
        &.xs  {\r
            --padding: var(--size-2) var(--size-px-3);\r
            --font-size: var(--font-size-1);\r
        }\r
        &.sm   {\r
            --padding: var(--size-3) var(--size-px-4);\r
            --font-size: var(--font-size-2);\r
        }\r
        &.md  {\r
            --padding: var(--size-4) var(--size-px-5);\r
            --font-size: var(--font-size-3);\r
        }\r
        &.lg   {\r
            --padding: var(--size-5) var(--size-px-6);\r
            --font-size: var(--font-size-4);\r
        }\r
        &.xl  {\r
            --padding: var(--size-6) var(--size-px-7);\r
            --font-size: var(--font-size-5);\r
        }\r
        &.xxl {\r
            --padding: var(--size-7) var(--size-px-8);\r
            --font-size: var(--font-size-6);\r
        }\r
    }\r
    &.block {\r
        display: flex;\r
    }\r
}\r
`,pn=`\r
* { box-sizing: border-box }\r
\r
*:has(> as-tooltip) {\r
    border: solid 1px tomato;\r
    position: relative;\r
    &:hover, &:focus, &:focus-within {\r
        z-index: var(--layer-5);\r
        \r
        > as-tooltip {\r
            scale: 1;\r
            transition: scale 250ms var(--delay) ease-in-out;\r
        }\r
        \r
    }\r
    \r
    > as-tooltip {\r
        --offset: var(--size-1);\r
        --delay: 3000ms;\r
        border: solid 1px tomato;\r
        position: absolute;\r
        top: 50%;\r
        left: 50%;\r
        translate: -50% -50%;\r
        scale: 0;\r
        aspect-ratio: 16 / 9;\r
        display: block;\r
        box-shadow: var(--shadow-3);\r
        border-radius: var(--radius-3);\r
        padding: var(--size-2);\r
        transition: scale 150ms 0ms ease-in-out;\r
        transform-origin: center;\r
        background-color: var(--color-secondary);\r
        cursor: initial;\r
        text-align: initial;\r
        filter: initial;\r
        &:hover, &:focus {\r
            background-color: var(--color-secondary);\r
            filter: brightness(100%);\r
        }\r
        &[position] {\r
            top: unset;\r
            left: unset;\r
        }\r
        &[position="block-start"] {\r
            top: 100%;\r
            left: 50%;\r
            translate: -50% var(--offset);\r
        }\r
        &[position="block-end"] {\r
            bottom: 100%;\r
            left: 50%;\r
            translate: -50% calc(var(--offset) * -1);\r
        }\r
        &[position="inline-start"] {\r
            top: 50%;\r
            right: 100%;\r
            translate: calc(var(--offset) * -1) -50%;\r
        }\r
        &[position="inline-end"] {\r
            top: 50%;\r
            left: 100%;\r
            translate:  var(--offset) -50%;\r
        }\r
    }\r
    \r
}\r
`,dn=`\r
* { box-sizing: border-box }\r
\r
as-popover:has([part="envelope"]) {\r
    position: relative;\r
    display: inline-block;\r
    \r
    [part~="actuator"] {}\r
    \r
    [part~="deactuator"] {\r
        position: absolute;\r
        top: 0;\r
        left: 0;\r
        display: none;\r
    }\r
    \r
    [part~="actuator"], [part~="deactuator"] {\r
        cursor: pointer;\r
    }\r
    \r
    [part~="envelope"] {\r
        --offset: var(--size-px-3);\r
        position: absolute;\r
        top: 100%;\r
        translate: 0 var(--offset);\r
        display: none;\r
        box-shadow: var(--shadow-3);\r
        background-color: var(--color-secondary);\r
        &[position="bottom left"] {\r
            right: 0;\r
        }\r
        &[position="bottom center"] {\r
            left: 50%;\r
            translate: -50% var(--offset);\r
        }\r
        &[position="bottom right"] {}\r
    }\r
    \r
}\r
\r
as-popover:has([part~="envelope"]):focus-within {\r
    \r
    [part~="deactuator"][part~="deactuator"][part~="deactuator"][part~="deactuator"], \r
    [part~="envelope"][part~="envelope"][part~="envelope"][part~="envelope"] \r
    /* FORCE DISPLAY WITH EXTREME SPECIFICITY */\r
    {\r
        display: var(--display, block);\r
    }\r
    \r
}\r
`,un=`\r
* { box-sizing: border-box }\r
\r
dialog[is="as-dialog"], dialog[is="as-dialog-queue"] {\r
    border: none;\r
    box-shadow: var(--shadow-3);\r
    border-radius: var(--radius-2);\r
    &::backdrop {\r
        background-color: var(--color-dark);\r
        opacity: 0.75;\r
    }\r
    &.backdrop {\r
        &.clear {\r
            &::backdrop { background-color: transparent }\r
        }\r
    }\r
    &.size {\r
        &.fullscreen {\r
            width: 100vw;\r
            height: 100vh;\r
            &:not(:modal) {\r
                border-radius: unset;\r
            }\r
        }\r
    }\r
    &:has(.dialog.body) {\r
        padding: 0;\r
        scrollbar-width: thin;\r
        \r
        .dialog.header, .dialog.body, .dialog.footer {\r
            padding: var(--size-px-3);\r
            background-color: inherit;\r
        }\r
        \r
        .dialog.header {\r
            position: sticky;\r
            top: 0;\r
            box-shadow: var(--shadow-2);\r
            \r
            .header.action.close {\r
                position: absolute;\r
                top: 0;\r
                right: 0;\r
                margin: var(--size-px-1);\r
                border: none;\r
                border-radius: 0;\r
                padding: var(--size-px-1) var(--size-px-2);\r
                background-color: inherit;\r
                font-size: var(--font-size-4);\r
                font-weight: var(--font-weight-6);\r
                cursor: pointer;\r
            }\r
            \r
        }\r
        \r
        .dialog.body {}\r
        \r
        .dialog.footer {\r
            position: sticky;\r
            bottom: 0;\r
            border-top: solid 1px var(--gray-1);\r
            \r
            .footer.actionbar {\r
                display: flex;\r
                justify-content: flex-end;\r
                align-items: center;\r
                gap: var(--size-px-1);\r
                \r
                .actionbar.action {}\r
                \r
            }\r
            \r
        }\r
        \r
    }\r
    \r
}\r
`,hn=`\r
* { box-sizing: border-box }\r
\r
dialog[is="as-dialog"][modus="toast"], dialog[is="as-dialog-queue"][modus="toast"] {\r
    top: unset;\r
    left: unset;\r
    bottom: 0;\r
    right: 0;\r
    aspect-ratio: 16 / 9;\r
    min-height: 160px;\r
    margin: var(--font-size-1);\r
    border-radius: var(--radius-1);\r
    transition: scale 250ms 0ms ease-in-out;\r
    transform-origin: bottom right;\r
    overflow: hidden;\r
    &:hover {\r
        scale: 1.25;\r
    }\r
    &:modal {\r
        &::backdrop {\r
            cursor: not-allowed;\r
        }\r
    }\r
    &:has(.dialog.body) {\r
        \r
        .dialog.header, .dialog.body, .dialog.footer {\r
            padding: var(--size-px-1);\r
        }\r
        \r
        .dialog.header {\r
            box-shadow: none;\r
            border-bottom: solid 1px var(--gray-1);\r
            \r
            .header.title, .header.subtitle {\r
                margin-block: var(--size-px-1);\r
            }\r
            \r
            .header.title {\r
                font-size: var(--font-size-3);\r
            }\r
            \r
            .header.subtitle {\r
                font-size: var(--font-size-0);\r
                filter: brightness(25%);\r
            }\r
            \r
        }\r
        \r
    }\r
}\r
`,gn=`\r
* { box-sizing: border-box }\r
\r
dialog[is="as-dialog"][modus="quickview"], dialog[is="as-dialog-queue"][modus="quickview"] {\r
    --min-size: 320px;\r
    inset: unset;\r
    top: 0;\r
    right: 0;\r
    width: 25dvw;\r
    min-height: 100dvh;\r
    max-height: 100dvh;\r
    border-radius: 0;\r
    transition: translate 250ms 0ms ease-in-out, width 250ms 0ms ease-in-out, height 250ms 0ms ease-in-out;\r
    overflow: auto;\r
    &:hover {\r
        width: 90dvw;\r
    }\r
    &:modal {\r
        &::backdrop {\r
            pointer-events: none;\r
        }\r
    }\r
    &[position="inline-end"] {}\r
    &[position="inline-start"] {\r
        right: unset;\r
        left: 0;\r
    }\r
    &[position="block-end"] {\r
        top: unset;\r
        left: unset;\r
        right: unset;\r
        bottom: 0;\r
        width: 100dvw;\r
        height: 25dvh;\r
        min-height: unset;\r
        max-height: unset;\r
        &:hover {\r
            height: 90dvh;\r
        }\r
    }\r
    &[position="block-start"] {\r
        top: unset;\r
        left: unset;\r
        right: unset;\r
        width: 100svw;\r
        height: 25dvh;\r
        min-height: unset;\r
        max-height: unset;\r
        &:hover {\r
            height: 90dvh;\r
        }\r
    }\r
    &[position="inline-start"], &[position="inline-end"] {\r
        min-width: var(--min-size);\r
    }\r
    &[position="block-start"], &[position="block-end"] {\r
        min-height: var(--min-size);\r
    }\r
    &:has(.dialog.body) {\r
        scrollbar-width: none;\r
        \r
        .dialog.header, .dialog.body, .dialog.footer {}\r
        \r
        .dialog.header {\r
            \r
            .header.title, .header.subtitle {\r
                margin-block: var(--size-px-1);\r
            }\r
            \r
            .header.title {\r
                font-size: var(--font-size-3);\r
            }\r
            \r
            .header.subtitle {\r
                font-size: var(--font-size-0);\r
                filter: brightness(25%);\r
            }\r
            \r
        }\r
        \r
    }\r
}\r
`;var mn=Object.getOwnPropertyDescriptor,bn=(t,e,r,s)=>{for(var n=s>1?void 0:s?mn(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n};const fn={"bootstrap-icons":ln,icons:an,buttons:cn,tooltip:pn,popover:dn,dialogs:[un,hn,gn].join(`
`)},vn="as-css-import";let Re=class extends HTMLStyleElement{constructor(){super();const{attributes:t}=this,{target:e}=t,{value:r}=e,{[r]:s}=fn;this.innerHTML=s}};Re=bn([x(vn,{extends:"style"})],Re);const xn=`\r
as-stateful {\r
    /* border: solid 1px tomato; */\r
    position: relative;\r
    display: inline-block;\r
    \r
    [is="state"] {\r
        /* border: solid 1px tomato; */\r
        position: absolute;\r
        inset: 0;\r
        opacity: 0;\r
        cursor: pointer;\r
        z-index: 1;\r
    }\r
    \r
}\r
`;var kn=Object.getOwnPropertyDescriptor,yn=(t,e,r,s)=>{for(var n=s>1?void 0:s?kn(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n};const wn="as-stateful";let De=class extends HTMLElement{constructor(){super();const{innerHTML:t}=this,r=`${`<style>${xn}</style>`}
${t}`;this.innerHTML=r}};De=yn([x(wn)],De);class $n{constructor(e=[]){this.data=e}get size(){return this.data.length}get empty(){return this.isEmpty()}get front(){return this.getFront()}enqueue(e){const{data:r}=this;return r.push(e),this}dequeue(){const{data:e}=this;return e.shift()}getFront(){return this.data[0]}search(e){const{data:r}=this;return r.indexOf(e)}has(e){return!!~this.search(e)}isEmpty(){return!this.size}clear(){return this.data.length=0,this}}var _n=Object.defineProperty,zn=Object.getOwnPropertyDescriptor,Tn=Object.getPrototypeOf,Sn=Reflect.get,dt=t=>{throw TypeError(t)},En=(t,e,r)=>e in t?_n(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Cn=(t,e,r,s)=>{for(var n=s>1?void 0:s?zn(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n},An=(t,e,r)=>En(t,e+"",r),Pn=(t,e,r)=>e.has(t)||dt("Cannot "+r),Rn=(t,e,r)=>e.has(t)?dt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),S=(t,e,r)=>(Pn(t,e,"access private method"),r),Dn=(t,e,r)=>Sn(Tn(t),r,e),z,Y,ut,ht,gt,mt,bt;const qe={type:""},qn="as-dialog-queue";let ce=class extends HTMLDialogElement{constructor(){super(...arguments),Rn(this,z),An(this,"queue",new $n)}showModal(t=qe){const{queue:e}=this;t!==qe&&e.enqueue(t),S(this,z,Y).call(this)}handleEvent(t){if(t.type==="as:dialog:close")return S(this,z,ht).call(this,t);if(t.type==="cancel")return S(this,z,gt).call(this,t);if(t.type==="close")return S(this,z,mt).call(this,t);if(t.type==="as:dialog:request")return S(this,z,bt).call(this,t)}connectedCallback(){this.addEventListener("as:dialog:close",this,!0),this.addEventListener("cancel",this,!0),this.addEventListener("close",this,!0),this.addEventListener("as:dialog:request",this,!0)}disconnectedCallback(){this.removeEventListener("as:dialog:close",this,!0),this.removeEventListener("cancel",this,!0),this.removeEventListener("close",this,!0),this.removeEventListener("as:dialog:request",this,!0)}};z=new WeakSet;Y=function(){const{queue:t}=this,{front:e}=t,{type:r,content:s}=e;r==="string"?this.innerHTML=s:S(this,z,ut).call(this,...s),Dn(ce.prototype,this,"showModal").call(this)};ut=function(...t){this.innerHTML="",this.append(...t)};ht=function(t){const{queue:e}=this;e.dequeue(),e.size?S(this,z,Y).call(this):this.close()};gt=function(t){const{queue:e}=this;e.dequeue(),e.size&&(t.preventDefault(),S(this,z,Y).call(this))};mt=function(t){this.queue.clear()};bt=function(t){const{data:e}=t;this.showModal(e)};ce=Cn([x(qn,{extends:"dialog"})],ce);var Mn=Object.defineProperty,Ln=Object.getOwnPropertyDescriptor,ft=t=>{throw TypeError(t)},On=(t,e,r)=>e in t?Mn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Bn=(t,e,r,s)=>{for(var n=s>1?void 0:s?Ln(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n},In=(t,e,r)=>On(t,e+"",r),vt=(t,e,r)=>e.has(t)||ft("Cannot "+r),Nn=(t,e,r)=>(vt(t,e,"read from private field"),r?r.call(t):e.get(t)),Hn=(t,e,r)=>e.has(t)?ft("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Xn=(t,e,r,s)=>(vt(t,e,"write to private field"),e.set(t,r),r),H;const jn="as-dialog-antitamper";let Me=class extends HTMLDialogElement{constructor(){super(...arguments),Hn(this,H),In(this,"accepted",!1)}accept(){this.accepted=!0}connectedCallback(){const{parentElement:t}=this;Xn(this,H,t)}disconnectedCallback(){this.accepted||Nn(this,H).appendChild(this)}};H=new WeakMap;Me=Bn([x(jn,{extends:"dialog"})],Me);const Fn=`\r
<div class="asxs app">\r
    <header class="app header">\r
        <div class="header branding">\r
            <a class="branding title" href="./">AsXS</a>\r
        </div>\r
        <menu class="header menu">\r
            <li class="menu item"><a class="item action" href="./asxs/docs/#/">Home</a></li>\r
            <li class="menu item"><a class="item action" href="./asxs/docs/#/catalog">Catalog</a></li>\r
        </menu>\r
    </header>\r
    <main class="app body">\r
        <at-home id="/"></at-home>\r
        <at-catalog id="/catalog"></at-catalog>\r
    </main>\r
    <footer class="app footer">\r
        <iframe src="./asxs/docs/v0.0.1/copy.partial.html"></iframe>\r
    </footer>\r
</div>\r
<!-- <p>The \${speed} brown fox jumped over the lazy \${animal}.</p> -->\r
<!-- <iframe src="./v0.0.1/static.red.html" is="as-frameless"></iframe> -->\r
<!-- <iframe src="\${hero}" is="as-frameless"></iframe> -->\r
<!-- <as-frameless-slots> -->\r
    <!-- <iframe src="./v0.0.1/test.red.html" is="as-frameless"> -->\r
        <!-- <p>Default Slot Content</p> -->\r
        <!-- <div>More Default Content</div> -->\r
        <!-- <div slot="named">Named Slot</div> -->\r
    <!-- </iframe> -->\r
    <!-- <p>Default Slot Content 2</p> -->\r
    <!-- <div>More Default Content 2</div> -->\r
    <!-- <div slot="named">Named Slot 2</div> -->\r
<!-- </as-frameless-slots> -->\r
<!-- <iframe src="./v0.0.1/test.red.html" is="as-frameless"> -->\r
    <!-- <p>Default Slot Content</p> -->\r
    <!-- <div>More Default Content</div> -->\r
    <!-- <div slot="named">Named Slot</div> -->\r
<!-- </iframe> -->\r
`,Qn=`\r
:root {\r
    --header-height: var(--size-px-9);\r
}\r
\r
.asxs.app {\r
    \r
    .app.header {\r
        position: sticky;\r
        top: 0;\r
        display: flex;\r
        justify-content: space-between;\r
        align-items: center;\r
        gap: var(--size-px-2);\r
        min-height: var(--header-height);\r
        box-shadow: var(--shadow-3);\r
        padding-inline: var(--size-px-3);\r
        z-index: var(--layer-3);\r
        background-color: var(--indigo-12);\r
        color: var(--gray-0);\r
        \r
        .header.branding {\r
            \r
            .branding.title {\r
                color: var(--gray-0);\r
                text-decoration: none;\r
                text-transform: capitalize;\r
                font-size: var(--size-5);\r
                font-weight: var(--font-weight-8);\r
            }\r
            \r
        }\r
        \r
        .header.menu {\r
            display: flex;\r
            justify-content: space-evenly;\r
            gap: var(--size-px-3);\r
            padding: 0;\r
            list-style: none;\r
            \r
            .menu.item {\r
                \r
                .item.action {\r
                    color: var(--gray-0);\r
                    text-decoration: none;\r
                    text-transform: uppercase;\r
                    font-weight: var(--font-weight-6);\r
                }\r
                \r
            }\r
            \r
        }\r
        \r
    }\r
    \r
    .app.body {\r
        /* padding-block: var(--size-px-3); */\r
    }\r
    \r
    .app.footer {\r
        min-height: 50dvh;\r
        box-shadow: inset 0px 0px 16px -6px black;\r
        border-top: solid 1px var(--gray-7);\r
        padding: var(--size-px-3);\r
        background-color: var(--color-primary);\r
        \r
        .content.copyright {}\r
        \r
    }\r
    \r
}\r
`;var Gn=Object.defineProperty,Wn=Object.getOwnPropertyDescriptor,xt=t=>{throw TypeError(t)},Zn=(t,e,r)=>e in t?Gn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Un=(t,e,r,s)=>{for(var n=s>1?void 0:s?Wn(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n},Kn=(t,e,r)=>Zn(t,e+"",r),Yn=(t,e,r)=>e.has(t)||xt("Cannot "+r),Vn=(t,e,r)=>(Yn(t,e,"read from private field"),r?r.call(t):e.get(t)),Jn=(t,e,r)=>e.has(t)?xt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),pe;const es="at-route";let W=class extends we{constructor(){super(),Jn(this,pe,this.innerHTML),Kn(this,"initial","#/")}createRenderRoot(){return this}render(){return`
            <style>
                ${this.tagName} {
                    display: none;
                    &:target, &:has(:target), &:has(:target) :target {
                        display: block;
                    }
                    &:has([id="${this.initial}"]) {
                        border: solid 10px cyan;
                        display: block;
                    }
                }
            </style>
            ${Vn(this,pe)}
        `}};pe=new WeakMap;W=Un([x(es)],W);const ts="/asxs/docs/assets/hero.red-RPEL82D_.html",rs="/asxs/docs/assets/button.red-BEoK94kK.html",ns="/asxs/docs/assets/frameless.red-BxCv4gKg.html",ss="/asxs/docs/assets/xs.red-Ctwnx5wo.html",os="/asxs/docs/assets/extensible.red-Czq0Umn1.html",as="/asxs/docs/assets/excess.red-BtxTB1gd.html",is="/asxs/docs/assets/accessible.red-BYSBQAjx.html",ls="/asxs/docs/assets/css.red-CtK-onvh.html",cs="/asxs/docs/assets/js.red-CD7ALLNg.html",ps="/asxs/docs/assets/ts.red-B8udLaFi.html",ds="/asxs/docs/assets/footer.rcd-DR3b-oXk.html",us=`\r
<div class="app page home">\r
    <header class="page header"></header>\r
    <div class="page body">\r
        <iframe src="\${hero}" is="as-frameless"></iframe>\r
        <iframe src="\${hook}" is="as-frameless"></iframe>\r
        <iframe src="\${frameless}" is="as-frameless"></iframe>\r
        <iframe src="\${xs}" is="as-frameless"></iframe>\r
        <iframe src="\${extensible}" is="as-frameless"></iframe>\r
        <iframe src="\${excess}" is="as-frameless"></iframe>\r
        <iframe src="\${accessibility}" is="as-frameless"></iframe>\r
        <iframe src="\${css}" is="as-frameless"></iframe>\r
        <iframe src="\${js}" is="as-frameless"></iframe>\r
        <iframe src="\${ts}" is="as-frameless"></iframe>\r
    </div>\r
    <!-- <footer class="page footer" is="home-footer"> -->\r
        <!-- <iframe src="\${footer}"></iframe> -->\r
    <!-- </footer> -->\r
    <home-footer>\r
        <iframe src="\${footer}"></iframe>\r
    </home-footer>\r
</div>\r
`,hs=`\r
.app.page.home {\r
    \r
    .page.header {\r
        padding-inline: var(--offset);\r
        \r
        .header.title {\r
            color: firebrick;\r
        }\r
        \r
    }\r
    \r
    .page.body {\r
        \r
        .body.section {\r
            --body-section-shadow: inset 0 0 16px -6px black;\r
            min-height: 400px;\r
            \r
            .section.header {\r
                background-color: white;\r
            }\r
            \r
            .section.footer {\r
                min-height: 50vh;\r
                background-color: white;\r
                margin-block: var(--size-px-8);\r
            }\r
            \r
            .section.header, .section.article, .section.footer {\r
                padding-inline: var(--offset);\r
            }\r
            \r
        }\r
        \r
    }\r
    \r
    .page.footer {\r
        min-height: 200px;\r
        padding-inline: var(--offset);\r
    }\r
    \r
}\r
`;var gs=Object.getOwnPropertyDescriptor,ms=(t,e,r,s)=>{for(var n=s>1?void 0:s?gs(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n};const{log:bs}=console,kt="at-home";let Le=class extends W{get"as:state"(){return{hero:ts,hook:rs,frameless:ns,xs:ss,extensible:os,excess:as,accessibility:is,css:ls,js:cs,ts:ps,footer:ds}}connectedCallback(t=super.connectedCallback()){bs(`@${kt}`)}render(){return`
            ${super.render()}
            <style>${hs}</style>
            ${us}
        `}};Le=ms([x(kt)],Le);class T extends Object{constructor(e){super(e),Object.assign(this,e)}escape(e){return $.escapeHTML(e)}}const yt=`\r
## Variables\r
AsXS leverages <a href="https://open-props.style" target="_blank">OpenProps</a>, so you get what we get. Additionally, AsXS provides a few shortcuts that you may likely find useful. Moreover, these shortcuts can also be overridden as you would with any other global CSS variables on \`:root\`/\`html\`.\r
\r
### Setup\r
\r
\`\`\`typescript\r
\${setup}\r
\`\`\`\r
\r
<style>\r
    * { box-sizing: border-box }\r
    .shortcuts.example {\r
        position: relative;\r
        display: flex;\r
        justify-content: center;\r
        align-items: center;\r
        height: var(--size-8);\r
        margin-block: var(--size-px-2);\r
        border: solid 5px transparent;\r
        border-radius: var(--radius-2);\r
        background-image: linear-gradient(to right, var(--gray-12), var(--gray-0), var(--gray-0), var(--gray-12));\r
        background-clip: border-box;\r
        background-origin: border-box;\r
        background-repeat: no-repeat;\r
        &::before {\r
            content: attr(data-example);\r
            position: absolute;\r
            top: 0;\r
            left: 0;\r
            display: flex;\r
            justify-content: center;\r
            align-items: center;\r
            width: 100%;\r
            height: 100%;\r
            background-color: inherit;\r
            font-size: var(--font-size-2);\r
            font-weight: var(--font-weight-7);\r
        }\r
    }\r
</style>\r
\r
### Variables\r
<a href="https://open-props.style" target="_blank">https://open-props.style</a>\r
\r
\r
### Shortcuts\r
\r
\${example}\r
\r
\`\`\`html\r
\${ escape(example) }\r
\`\`\`\r
`,fs=`\r
import '@asxs/styles/theme.css';\r
`,vs=`\r
<div class="shortcuts example" style="background-color: var(--color-primary)" data-example="--color-primary">\r
    --color-primary\r
</div>\r
<div class="shortcuts example" style="background-color: var(--color-secondary)" data-example="--color-secondary">\r
    --color-secondary\r
</div>\r
<div class="shortcuts example" style="background-color: var(--color-success)" data-example="--color-success">\r
    --color-success\r
</div>\r
<div class="shortcuts example" style="background-color: var(--color-info)" data-example="--color-info">\r
    --color-info\r
</div>\r
<div class="shortcuts example" style="background-color: var(--color-warning)" data-example="--color-warning">\r
    --color-warning\r
</div>\r
<div class="shortcuts example" style="background-color: var(--color-danger)" data-example="--color-danger">\r
    --color-danger\r
</div>\r
<div class="shortcuts example" style="background-color: var(--color-light)" data-example="--color-light">\r
    --color-light\r
</div>\r
<div class="shortcuts example" style="background-color: var(--color-dark); color: var(--color-primary)" data-example="--color-dark">\r
    --color-dark\r
</div>\r
`,de=Object.freeze(Object.defineProperty({__proto__:null,docs:yt,example:vs,setup:fs},Symbol.toStringTag,{value:"Module"})),wt=`\r
## Icons\r
\`as-icon[strategy="{strategy}"]\`\r
\r
### Setup\r
\r
\${setuphtml}\r
\r
\`\`\`html\r
\${ escape(setuphtml) }\r
\`\`\`\r
\r
OR, simply use \`target="icons"\` and import the your strategy file in JavaScript:\r
\r
\`\`\`html\r
\${ escape(setupts) }\r
\`\`\`\r
\r
<style>\r
    .usage.example {\r
        display: flex;\r
        margin-block: var(--size-px-1);\r
        padding: var(--size-px-2);\r
        background-color: var(--gray-5);\r
    }\r
</style>\r
\r
\r
### Usage\r
\r
<div class="usage example">\r
    \${example}\r
</div>\r
\r
\`\`\`html\r
\${ escape(example) }\r
\`\`\`\r
> _Icons leverage tagging and fallbacks. That is, each icon type looks at multiple values and, if not found, does its best to provide the icon it believes you are expecting._\r
\r
### Colors\r
\r
<div class="usage example">\r
    \${colors}\r
</div>\r
\r
\`\`\`html\r
\${ escape(colors) }\r
\`\`\`\r
> _Icons leverage CSS \`mask-image\` so, naturally, the way to change the color is by using \`background-color\`._\r
\r
\r
### Icon \`Strategy\`\r
These examples use \`strategy="bootstrap-icons"\`. However, any icon set can be used if you prefer a different set. In fact, you can even mix & match different strategies. In other words, you can even use the same icon \`type\` with a different strategy.\r
\r
#### Example\r
\`\`\`html\r
<as-icon type="list" strategy="bootstrap-icons"></as-icon>\r
<as-icon type="list" strategy="material"></as-icon>\r
<as-icon type="list" strategy="iconbuddy.com"></as-icon>\r
<as-icon type="list" strategy="ascii"></as-icon>\r
\`\`\`\r
> _Using \`strategy="ascii"\` can leverage ASCII codes as a \`::before\` or \`::after\` pseudo-element's \`content\`, even using CSS \`attr(type)\` to render the desired icon._\r
\r
> _NOTE: each icon strategy must be supported through Pull Requests that implement such support -- OR -- literally through your own definitions for any specific website or webapp. This, as always, allows AsXS to provide opt-in and opt-out functionality, where the implementer can jailbreak any \`strategy\`, without significant overhead._\r
`,xs=`\r
<style is="as-css-import" target="icons"></style>\r
<style is="as-css-import" target="bootstrap-icons"></style>\r
`,ks=`\r
import '@asxs/icon/strategies/bootstrap-icons/variables.css';\r
`,ys=`\r
<as-icon type="list"        strategy="bootstrap-icons"></as-icon>\r
<as-icon type="menu"        strategy="bootstrap-icons"></as-icon>\r
<as-icon type="bars3h"      strategy="bootstrap-icons"></as-icon>\r
<as-icon type="hamburger"   strategy="bootstrap-icons"></as-icon>\r
`,ws=`\r
<as-icon type="list" strategy="bootstrap-icons" style="background-color: var(--red-8)"></as-icon>\r
<as-icon type="list" strategy="bootstrap-icons" style="background-color: var(--gray-1)"></as-icon>\r
<as-icon type="list" strategy="bootstrap-icons" style="background-color: var(--blue-8)"></as-icon>\r
`,$s=Object.freeze(Object.defineProperty({__proto__:null,colors:ws,docs:wt,example:ys,setuphtml:xs,setupts:ks},Symbol.toStringTag,{value:"Module"})),$t='\r\n## Buttons\r\n`*[is="as-button"].color.{style}.size.{size}`\r\n\r\n### Setup\r\n\r\n${setup}\r\n\r\n```html\r\n${ escape(setup) }\r\n```\r\n\r\n### Types\r\n`[is="as-button"]:is(button, a, label, *)`\r\n\r\n${types}\r\n\r\n```html\r\n${ escape(types) }\r\n```\r\n\r\n### Basic\r\n`*[is="as-button"].color.{style}`\r\n\r\n${basic}\r\n\r\n```html\r\n${ escape(basic) }\r\n```\r\n\r\n### Sizes\r\n`*[is="as-button"].size.{xxs | xs | sm | md | lg | xl | xxl}`\r\n\r\n${sizes}\r\n\r\n```html\r\n${ escape(sizes) }\r\n```\r\n\r\n### Block\r\n`*[is="as-button"].block`\r\n\r\n${block}\r\n\r\n```html\r\n${ escape(block) }\r\n```\r\n\r\n## Stateful\r\n`as-stateful > [is="state"][type="{type}"]:is(*)`\r\n\r\n### Setup\r\nNone\r\n\r\n### Checkbox\r\n`as-stateful > input[is="state"][type="checkbox"]`\r\n\r\n${stateful.checkbox}\r\n\r\n```html\r\n${ escape(stateful.checkbox) }\r\n```\r\n\r\n### Radio\r\n`as-stateful > input[is="state"][type="radio"][name="{name}"]`\r\n\r\n${stateful.radio}\r\n\r\n```html\r\n${ escape(stateful.radio) }\r\n```\r\n\r\n### File Upload\r\n`as-stateful > input[is="state"][type="file"]`\r\n\r\n${stateful.files}\r\n\r\n```html\r\n${ escape(stateful.files) }\r\n```\r\n\r\n### Reflecting State\r\n`*[is="as-button"].color.{style}.size.{x}`\r\n\r\n${stateful.reflections}\r\n\r\n```html\r\n${ escape(stateful.reflections) }\r\n```\r\n',_s=`\r
<style is="as-css-import" target="buttons"></style>\r
`,zs=`\r
<button class="color primary" is="as-button">Primary</button>\r
<button class="color secondary" is="as-button">Secondary</button>\r
<button class="color success" is="as-button">Success</button>\r
<button class="color info" is="as-button">Info</button>\r
<button class="color warning" is="as-button">Warning</button>\r
<button class="color danger" is="as-button">Danger</button>\r
<button class="color light" is="as-button">Light</button>\r
<button class="color dark" is="as-button">Dark</button>\r
`,Ts=`\r
<button class="color secondary block" is="as-button">Block</button>\r
`,Ss=`\r
<button class="color secondary size xxs" is="as-button">XXS</button>\r
<button class="color secondary size xs"  is="as-button">XS</button>\r
<button class="color secondary size sm"  is="as-button">SM</button>\r
<button class="color secondary size md"  is="as-button">MD</button>\r
<button class="color secondary size lg"  is="as-button">LG</button>\r
<button class="color secondary size xl"  is="as-button">XL</button>\r
<button class="color secondary size xxl" is="as-button">XXL</button>\r
`,Es=`\r
<button is="as-button">Button</button>\r
<a is="as-button" href="javascript: 0">Anchor</a>\r
<label is="as-button">Label</label>\r
`,Cs="\r\n${element}\r\n\r\n```html\r\n${example}\r\n```\r\n",As=`\r
<as-stateful>\r
    <input is="state" type="checkbox" />\r
    <button class="color secondary" is="as-button">Checkbox</button>\r
</as-stateful>\r
`,Ps=`\r
<as-stateful>\r
    <input is="state" type="radio" name="group" />\r
    <button class="color secondary" is="as-button">Radio Group</button>\r
</as-stateful>\r
<as-stateful>\r
    <input is="state" type="radio" name="group" />\r
    <button class="color secondary" is="as-button">Radio Group</button>\r
</as-stateful>\r
<as-stateful>\r
    <input is="state" type="radio" name="group" />\r
    <button class="color secondary" is="as-button">Radio Group</button>\r
</as-stateful>\r
`,Rs=`\r
<as-stateful style="border: dashed 1px black; border-radius: var(--radius-3); overflow: hidden;">\r
    <input is="state" type="file" />\r
    <button class="color secondary size xxl" is="as-button" style="border-style: dashed;">Upload</button>\r
</as-stateful>\r
`,Ds=`\r
<style>\r
    as-stateful [is="state"]:checked ~ * {\r
        background-color: var(--color-primary);\r
        color: var(--color-dark);\r
    }\r
</style>\r
`,qs=Object.freeze(Object.defineProperty({__proto__:null,checkbox:As,docs:Cs,files:Rs,radio:Ps,reflections:Ds},Symbol.toStringTag,{value:"Module"})),Ms=Object.freeze(Object.defineProperty({__proto__:null,basic:zs,block:Ts,docs:$t,setup:_s,sizes:Ss,stateful:qs,types:Es},Symbol.toStringTag,{value:"Module"})),_t=`\r
## Tooltips\r
\`* > as-tooltip[position="(block | inline)-(start | end)"][style="--delay: {delay}"]\`\r
\r
### Setup\r
\r
\${setup}\r
\r
\`\`\`html\r
\${ escape(setup) }\r
\`\`\`\r
\r
### Positioning & Delay\r
\r
\${example}\r
\r
\`\`\`html\r
\${ escape(example) }\r
\`\`\`\r
`,Ls=`\r
<style is="as-css-import" target="tooltip"></style>\r
`,Os=`\r
<button is="as-button">\r
    inline-end\r
    <as-tooltip position="inline-end" style="min-width: 320px; --delay: 0ms">\r
        <h1>Tooltip</h1>\r
        <p>Tooltips can also display any other elements you want, like a Call To Action.</p>\r
    </as-tooltip>\r
</button>\r
<button is="as-button">\r
    block-start\r
    <as-tooltip position="block-start" style="min-width: 320px; --delay: 500ms">\r
        <h1>Tooltip</h1>\r
        <p>Tooltips can also display any other elements you want, like a Call To Action.</p>\r
    </as-tooltip>\r
</button>\r
<button is="as-button">\r
    block-end\r
    <as-tooltip position="block-end" style="min-width: 320px; --delay: 1000ms">\r
        <h1>Tooltip</h1>\r
        <p>Tooltips can also display any other elements you want, like a Call To Action.</p>\r
    </as-tooltip>\r
</button>\r
<button is="as-button">\r
    inline-start\r
    <as-tooltip position="inline-start" style="min-width: 320px">\r
        <h1>Tooltip</h1>\r
        <p>Tooltips can also display any other elements you want, like a Call To Action.</p>\r
    </as-tooltip>\r
</button>\r
<button is="as-button">\r
    :not([position])\r
    <as-tooltip style="min-width: 320px">\r
        <h1>Tooltip</h1>\r
        <p>Tooltips can also display any other elements you want, like a Call To Action.</p>\r
        <a is="as-button" class="color primary" href="javascript: 0" tabindex="-1">OK</a>\r
    </as-tooltip>\r
</button>\r
`,zt=Object.freeze(Object.defineProperty({__proto__:null,docs:_t,example:Os,setup:Ls},Symbol.toStringTag,{value:"Module"})),Tt=`\r
## Popovers\r
\`as-popover:has([part~="envelope"])\`\r
\r
### Setup\r
\r
\${setup}\r
\r
\`\`\`html\r
\${ escape(setup) }\r
\`\`\`\r
\r
<style>\r
    .catalog.popover {\r
        .popover.example.action {\r
            --size: var(--size-px-9);\r
            --display: flex;\r
            display: var(--display);\r
            justify-content: center;\r
            align-items: center;\r
            width: var(--size);\r
            height: var(--size);\r
            border-radius: var(--radius-2);\r
            background-color: var(--color-primary);\r
            font-size: var(--font-size-5);\r
            &[part~="deactuator"] {\r
                display: none;\r
            }\r
        }\r
        .popover.example.envelope {\r
            min-width: 320px;\r
        }\r
    }\r
</style>\r
\r
### Autodismiss\r
\`as-popover:has([part~="actuator"]):has([part~="envelope"])\`\r
\r
<div style="display: flex; justify-content: space-between; padding: var(--size-px-3)">\r
    \${autodismiss}\r
</div>\r
\r
<br />\r
<br />\r
<br />\r
<br />\r
<br />\r
<br />\r
<br />\r
<br />\r
\r
\`\`\`html\r
\${ escape(autodismiss) }\r
\`\`\`\r
\r
#### Discoverable\r
\`as-popover:has([part~="envelope"])\`\r
\r
This type of popover is exactly the same as the autodismiss, however, it has no visible actuator. Instead, the user can tab into the popover canvas, triggering its display. When \`as-popover\` has no \`:focus-within\`, it autodismisses itself the same as it otherwise would. This can be useful for content that you only want displayed when tabbing out of a container, or useful Easter Egg content such as for specific environments.\r
\r
### Toggleable\r
\`as-popover:has([part~="actuator"]):has([part~="envelope"]):has([part~="deactuator"])\`\r
\r
<div style="display: flex; justify-content: space-between; padding: var(--size-px-3)">\r
    \${toggleable}\r
</div>\r
\r
\`\`\`html\r
\${ escape(toggleable) }\r
\`\`\`\r
> _Notice that the deactuator is not a tabbable element. This allows the deactuator to simply absorb the click action, blurring any elements within the popover that would have provided \`:focus-within\`._\r
\r
#### Stateful\r
\`as-stateful > [is="state"] ~ [part~="envelope"]\`\r
\r
A stateful popover that remains open when blurred is easily achieved by making the actuator a stateful button. The only thing left to do from there is simply use a sibling selector to show & hide the popover canvas, based on the state of the stateful button.\r
\r
\`\`\`css\r
as-stateful {\r
    [is="state"]:checked ~ [part~="envelope"] {\r
        display: block;\r
    }\r
}\r
\`\`\`\r
> _See "Buttons" for more information on stateful elements._\r
`,Bs=`\r
<style is="as-css-import" target="popover"></style>\r
`,Is=`\r
<as-popover class="catalog popover">\r
    <span class="popover example action" part="actuator" tabindex="0">&vellip;</span>\r
    <div class="popover example envelope" part="envelope">\r
        <h1 tabindex="0">Bottom Right</h1>\r
        <p>Same as :not([position])</p>\r
    </div>\r
</as-popover>\r
<as-popover class="catalog popover">\r
    <span class="popover example action" part="actuator" tabindex="0">&vellip;</span>\r
    <div class="popover example envelope" part="envelope" position="bottom center">\r
        <h1 tabindex="0">Bottom Center</h1>\r
        <p>[position="bottom center"]</p>\r
    </div>\r
</as-popover>\r
<as-popover class="catalog popover">\r
    <span class="popover example action" part="actuator" tabindex="0">&vellip;</span>\r
    <div class="popover example envelope" part="envelope" position="bottom left">\r
        <h1 tabindex="0">Bottom Left</h1>\r
        <p>[position="bottom left"]</p>\r
    </div>\r
</as-popover>\r
`,Ns=`\r
<as-popover class="catalog popover">\r
    <span class="popover example action" part="actuator" tabindex="0">&vellip;</span>\r
    <div class="popover example envelope" part="envelope">\r
        <h1 tabindex="0">Toggleable</h1>\r
    </div>\r
    <span class="popover example action" part="deactuator">&times;</span>\r
</as-popover>\r
`,St=Object.freeze(Object.defineProperty({__proto__:null,autodismiss:Is,docs:Tt,setup:Bs,toggleable:Ns},Symbol.toStringTag,{value:"Module"})),Et=`\r
## Dialogs\r
\`dialog[is="as-{type}"]\`\r
\r
\r
### Setup\r
<style is="as-css-import" target="dialogs"></style>\r
\r
\`\`\`html\r
\${ escape(setuphtml) }\r
\`\`\`\r
\r
\r
### Normal\r
\`dialog[is="as-dialog"]\`\r
\r
\${normal}\r
\r
\`\`\`html\r
\${ escape(normal) }\r
\`\`\`\r
\r
\r
### Backdrops\r
\`dialog[is="as-dialog"].backdrop.clear\`\r
\r
\${backdrop}\r
\r
\`\`\`html\r
\${ escape(backdrop) }\r
\`\`\`\r
\r
\r
### Fullscreen\r
\`dialog[is="as-dialog"].size.fullscreen\`\r
\r
\${fullscreen}\r
\r
\`\`\`html\r
\${ escape(fullscreen) }\r
\`\`\`\r
\r
\r
### Conventional\r
\`dialog[is="as-dialog"] > .dialog.body\`\r
\r
\${conventional}\r
\r
\`\`\`html\r
\${ escape(conventional) }\r
\`\`\`\r
> _Works with Popover style dialogs as well_.\r
\r
#### Conventions & Patterns\r
Patterns generally follow the _Class Domain-Chaining_ (CDC) pattern (see more in "Styleguides").\r
\r
##### \`dialog[is="as-dialog"] > *\`\r
 - header: \`position: sticky; top: 0\`\r
 - footer: \`position: sticky; bottom: 0\`\r
 - body: \`HTMLFormElement\`\r
 \r
\r
##### \`dialog[is="as-dialog"] > .dialog.header .header.action.close\`\r
If added, automatically receives focus and can be used for manual dismission of the dialog.\r
\r
##### \`dialog[is="as-dialog"] > .dialog.body[method="dialog"]:is(form)\`\r
Conventionally, the dialog body is a form element. This allows \`button[type="submit"]\` actions to be wired up to the form to automatically dismiss the dialog when the action is performed. See below for more information.\r
\r
##### \`dialog[is="as-dialog"] > * button[type="submit"][formaction="{type}"]\`\r
All submission buttons tied to the dialog's form will automatically dismiss the dialog. However, you can use \`formaction\`s to signal to a submission handler which action was performed. In cases where you want to preserve the dialog (not exit), your handler can simply implement \`SubmitEvent.prototype.preventDefault\` method to prevent its dismissal.\r
\r
\r
### Queued Dialog\r
\`dialog[is="as-dialog-queue"]\`\r
\r
Queued Dialogs leverage a \`Queue\` data-structure so that the first message to display always remains present until the dialog has been dismissed. Once dismissed, the Queued Dialog simply calls \`dequeue\` on the queue to show the next message until to queue is empty, at which point it finally closes.\r
\r
Queued Modals are excellent for implementing Singleton Modals, reducing the DOM footprint by encouraging usage of less dialog instances.\r
\r
#### Setup\r
\r
\`\`\`typescript\r
\${ escape(setupts) }\r
\`\`\`\r
\r
\${queued}\r
\r
\`\`\`html\r
\${ escape(queued) }\r
\`\`\`\r
\r
##### Sending Requests\r
\`\`\`javascript\r
\${ escape(script) }\r
\`\`\`\r
> _On click, generates 5 dialog requests (of type "\`'as:dialog:request\`") and dispatches each one on the dialog instance._\r
\r
> _NOTE, however, that instead of dispatching an event, in this instance we may as well have called \`dialog.showModal(message)\`._\r
\r
> _The Event-Driven dialog request is generally preferred as you may have descendent elements that also trigger a dialog request; in which case, Event Bubbling is a simpler approach to normalize against as it leverages weaker coupling. Also note, the \`as-dialog-queue\` element's class (\`DialogElement\`) can be extended to customize its behavior, such as leveraging an EventBus or a Mediator to send dialog requests to the instance._\r
\r
The Queued Dialog is a great example of how AsXS brings hyper-extensibility to your development flow by preserving the developer's right to opt-in and opt-out when necessary. By simply importing the Custom Element definition, the developer gains additional functionality. This functionality can be easily inherited to subclasses that make it more powerful for your own use-cases. As always, you reserve the option to jailbreak the default behavior of the AsXS SDK and simply define your own element to instantly bootstrap your own desired results. There is no Product Lock-In when it is fully native, hyper-extensible, and always provides an escape hatch.\r
`,Hs=`\r
<style is="as-css-import" target="dialogs"></style>\r
`,Xs=`\r
import '@asxs/dialog/dialog.element';\r
`,js=`\r
<button is="as-button" popovertarget="normalDialogPopover">dialog[is="as-dialog"][popovertarget]</button>\r
<button is="as-button" command="show-modal" commandfor="normalDialogCommand">dialog[is="as-dialog"][command]</button>\r
\r
<dialog id="normalDialogPopover" is="as-dialog" popover>\r
    <h1>Normal Dialog</h1>\r
    <p>Tantamount to <code>HTMLDialogElement.prototype.show()</code></p>\r
</dialog>\r
\r
<dialog id="normalDialogCommand" is="as-dialog">\r
    <h1>Normal Dialog</h1>\r
    <p>Tantamount to <code>HTMLDialogElement.prototype.showModal()</code></p>\r
    <div>\r
        <button is="as-button" command="close" commandfor="normalDialogCommand">Close</button>\r
    </div>\r
</dialog>\r
`,Fs=`\r
<button class="queued dialog actuator" is="as-button">Request Dialog</button>\r
<dialog id="queuedDialogCommand" is="as-dialog-queue" closedby="closerequest"></dialog>\r
`,Qs=`\r
export function execute() {\r
    const actuator = this.querySelector('.queued.dialog.actuator');\r
    const dialog = this.querySelector('#queuedDialogCommand');\r
    actuator.addEventListener('click', e => handleEvent(e, dialog), true);\r
};\r
\r
function handleEvent(e, dialog) {\r
    const requests = ['One', 'Two', 'Three', 'Four', 'Five'].map(create);\r
    for (const event of requests) dialog.dispatchEvent(event);\r
}\r
\r
function create(id) {\r
    const message = {\r
        type: 'string',  // can also be type 'node' where 'content' is a NodeList or any other iterable of Node[]\r
        content: [\r
            '<header>', '<h1>', 'Request', ' - ', id, '</h1>', '</header>',\r
            '<div>', 'Body for ', id, '</div>',\r
            '<footer>',\r
                '<h3>Footer</h3>',\r
                '<button is="as-button" onclick="this.dispatchEvent( new MessageEvent(\\'as:dialog:close\\') )">Request Close</button>',\r
                ' ',\r
                '<button is="as-button" command="close" commandfor="queuedDialogCommand">Dismiss All</button>',\r
            '</footer>'\r
        ].join(''),\r
    };\r
    \r
    return new MessageEvent('as:dialog:request', { data: message });\r
}\r
`,Gs=`\r
<button is="as-button" popovertarget="normalDialogBackdropClearPopover">dialog[is="as-dialog"][popovertarget]</button>\r
<button is="as-button" command="show-modal" commandfor="normalDialogBackdropClearCommand">dialog[is="as-dialog"][command]</button>\r
\r
<dialog id="normalDialogBackdropClearPopover" class="backdrop clear" is="as-dialog" popover>\r
    <h1>Fullscreen Popover Style</h1>\r
    <p>Tantamount to <code>HTMLDialogElement.prototype.show()</code></p>\r
</dialog>\r
\r
<dialog id="normalDialogBackdropClearCommand" class="backdrop clear" is="as-dialog">\r
    <h1>Fullscreen Modal Style</h1>\r
    <p>Tantamount to <code>HTMLDialogElement.prototype.showModal()</code></p>\r
    <div>\r
        <button is="as-button" command="close" commandfor="normalDialogBackdropClearCommand">Close</button>\r
    </div>\r
</dialog>\r
`,Ws=`\r
<button is="as-button" popovertarget="normalDialogPopoverSizeFullscreen">dialog[is="as-dialog"][popovertarget]</button>\r
<button is="as-button" command="show-modal" commandfor="normalDialogCommandSizeFullscreen">dialog[is="as-dialog"][command]</button>\r
\r
<dialog id="normalDialogPopoverSizeFullscreen" class="size fullscreen" is="as-dialog" popover>\r
    <h1>Fullscreen Popover Style</h1>\r
    <p>Tantamount to <code>HTMLDialogElement.prototype.show()</code></p>\r
</dialog>\r
\r
<dialog id="normalDialogCommandSizeFullscreen" class="size fullscreen" is="as-dialog">\r
    <h1>Fullscreen Modal Style</h1>\r
    <p>Tantamount to <code>HTMLDialogElement.prototype.showModal()</code></p>\r
    <div>\r
        <button is="as-button" command="close" commandfor="normalDialogCommandSizeFullscreen">Close</button>\r
    </div>\r
</dialog>\r
`,Zs=`\r
<button is="as-button" command="show-modal" commandfor="normalDialogConventional">dialog[is="as-dialog"][command]</button>\r
<dialog id="normalDialogConventional" class="backdrop clear" is="as-dialog">\r
    <header class="dialog header">\r
        <h1 class="header title">Header Title</h1>\r
        <h1 class="header subtitle">Header Subtitle</h1>\r
        <button class="header action close" type="submit" form="contentional" formaction="close">&times;</button>\r
    </header>\r
    <form id="contentional" class="dialog body" method="dialog">\r
        <p>Tantamount to <code>HTMLDialogElement.prototype.showModal()</code></p>\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
    </form>\r
    <footer class="dialog footer">\r
        <p>Modal footer text</p>\r
        <div class="footer actionbar">\r
            <button class="actionbar action" is="as-button" type="submit" form="contentional" formaction="ok">OK</button>\r
            <button class="actionbar action" is="as-button" type="submit" form="contentional" formaction="cancel">Cancel</button>\r
            <button class="actionbar action" is="as-button" command="close" commandfor="normalDialogConventional">Dismiss</button>\r
        </div>\r
    </footer>\r
</dialog>\r
`;function Us(){const t=this.querySelector(".queued.dialog.actuator"),e=this.querySelector("#queuedDialogCommand");t.addEventListener("click",r=>Ks(r,e),!0)}function Ks(t,e){const r=["One","Two","Three","Four","Five"].map(Ys);for(const s of r)e.dispatchEvent(s)}function Ys(t){const e={type:"string",content:["<header>","<h1>","Request"," - ",t,"</h1>","</header>","<div>","Body for ",t,"</div>","<footer>","<h3>Footer</h3>",`<button is="as-button" onclick="this.dispatchEvent( new MessageEvent('as:dialog:close') )">Request Close</button>`," ",'<button is="as-button" command="close" commandfor="queuedDialogCommand">Dismiss All</button>',"</footer>"].join("")};return new MessageEvent("as:dialog:request",{data:e})}const{init:Vs}=new class{init=t=>{Us.call(t)}},Ct=Object.freeze(Object.defineProperty({__proto__:null,backdrop:Gs,conventional:Zs,docs:Et,fullscreen:Ws,init:Vs,normal:js,queued:Fs,script:Qs,setuphtml:Hs,setupts:Xs},Symbol.toStringTag,{value:"Module"})),At=`\r
## Toast Dialogs\r
\`dialog[is="as-dialog"][modus="toast"]\`\r
\r
AsXS Toasts (A.K.A. "Notífs") piggyback on AsXS Dialogs. Therefrom, you can leverage the same patterns to achieve what you need, including making them a Queued Dialog.\r
\r
### Setup\r
\r
\${setuphtml}\r
\r
\`\`\`html\r
\${ escape(setuphtml) }\r
\`\`\`\r
\r
#### Queued\r
\`\`\`typescript\r
\${ escape(setupts) }\r
\`\`\`\r
\r
### Basic\r
\`dialog[is="as-dialog"][modus="toast"]\`\r
\r
\${basic}\r
\r
\`\`\`typescript\r
\${ escape(basic) }\r
\`\`\`\r
\r
#### Queued\r
\`dialog[is="as-dialog-queue"][modus="toast"]\`\r
\r
`,Js=`\r
<style is="as-css-import" target="dialogs"></style>\r
`,eo=`\r
import '@asxs/dialog/dialog.element';\r
`,to=`\r
<button is="as-button" popovertarget="toastBasicPopover">Popover Notíf</button>\r
<button is="as-button" command="show-modal" commandfor="toastBasicCommand">Command Notíf</button>\r
\r
<dialog id="toastBasicPopover" class="backdrop clear" is="as-dialog" modus="toast" popover>\r
    <header class="dialog header">\r
        <h1 class="header title">Popover Notíf</h1>\r
        <h2 class="header subtitle">A small description to set the tone</h2>\r
    </header>\r
    <form id="toastBasicBodyPopover" class="dialog body" method="dialog">\r
        <p>You qualify for a FREE subscription deal!</p>\r
    </form>\r
    <footer class="dialog footer">\r
        <div class="footer actionbar">\r
            <button class="size xxs" is="as-button" type="submit" form="toastBasicBodyPopover" formaction="/toast/info">More Info</button>\r
            <button class="size xxs" is="as-button" type="submit" form="toastBasicBodyPopover" formaction="/toast/mute">Got It</button>\r
        </div>\r
    </footer>\r
</dialog>\r
\r
<dialog id="toastBasicCommand" class="backdrop clear" is="as-dialog" modus="toast">\r
    <header class="dialog header">\r
        <h1 class="header title">Command Notíf</h1>\r
        <h2 class="header subtitle">A small description to set the tone</h2>\r
    </header>\r
    <form id="toastBasicBodyCommand" class="dialog body" method="dialog">\r
        <p>You qualify for a FREE subscription deal!</p>\r
    </form>\r
    <footer class="dialog footer">\r
        <div class="footer actionbar">\r
            <button class="size xxs" is="as-button" type="submit" form="toastBasicBodyCommand" formaction="/toast/info">More Info</button>\r
            <button class="size xxs" is="as-button" type="submit" form="toastBasicBodyCommand" formaction="/toast/mute">Got It</button>\r
        </div>\r
    </footer>\r
</dialog>\r
`,Pt=Object.freeze(Object.defineProperty({__proto__:null,basic:to,docs:At,setuphtml:Js,setupts:eo},Symbol.toStringTag,{value:"Module"})),Rt=`\r
## Quickview Dialogs\r
\`dialog[is="as-dialog"][modus="quickview"]\`\r
\r
AsXS Quickviews (A.K.A. "Offcanvas Views") piggyback on AsXS Dialogs. Therefrom, you can leverage the same patterns to achieve what you need, including making them a Queued Dialog.\r
\r
### Setup\r
\r
\${setuphtml}\r
\r
\`\`\`html\r
\${ escape(setuphtml) }\r
\`\`\`\r
\r
#### Queued\r
\`\`\`typescript\r
\${ escape(setupts) }\r
\`\`\`\r
\r
### Basic\r
\`dialog[is="as-dialog"][modus="quickview"]\`\r
\r
\${basic}\r
\r
\`\`\`typescript\r
\${ escape(basic) }\r
\`\`\`\r
> _These examples use \`.backdrop.clear\` as a preference._\r
\r
> _\`[position]\` can be used with both Popover style and Command style triggers._\r
\r
#### Queued\r
\`dialog[is="as-dialog-queue"][modus="quickview"]\`\r
\r
`,ro=`\r
<style is="as-css-import" target="dialogs"></style>\r
`,no=`\r
import '@asxs/dialog/dialog.element';\r
`,so=`\r
<button is="as-button" popovertarget="quickviewBasicPopover">Popover Quickview</button>\r
<button is="as-button" command="show-modal" commandfor="quickviewBasicCommand">Command Quickview</button>\r
<br />\r
<br />\r
<button is="as-button" popovertarget="quickviewBasicPopoverEast">East</button>\r
<button is="as-button" popovertarget="quickviewBasicPopoverWest">West</button>\r
<button is="as-button" popovertarget="quickviewBasicPopoverSouth">South</button>\r
<button is="as-button" popovertarget="quickviewBasicPopoverNorth">North</button>\r
\r
<dialog id="quickviewBasicPopover" class="backdrop clear" is="as-dialog" modus="quickview" popover>\r
    <header class="dialog header">\r
        <h1 class="header title">Popover Quickview</h1>\r
        <h2 class="header subtitle">A small description to set the tone</h2>\r
    </header>\r
    <form id="quickviewBasicBodyPopover" class="dialog body" method="dialog">\r
        <p>You qualify for a FREE subscription deal!</p>\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
    </form>\r
    <footer class="dialog footer">\r
        <p>Dismission for Popover style dialogs only occurs by blurring focus of the modal or using the Escape key.</p>\r
    </footer>\r
</dialog>\r
\r
<dialog id="quickviewBasicCommand" class="backdrop clear" is="as-dialog" modus="quickview">\r
    <header class="dialog header">\r
        <h1 class="header title">Command Quickview</h1>\r
        <h2 class="header subtitle">A small description to set the tone</h2>\r
        <button class="header action close" is="as-button" type="submit" form="quickviewBasicBodyCommand" formaction="/quickview/exit">&times;</button>\r
    </header>\r
    <form id="quickviewBasicBodyCommand" class="dialog body" method="dialog">\r
        <p>You qualify for a FREE subscription deal!</p>\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
        <br />\r
        <br />\r
        <br />\r
        <br />\r
        <hr />\r
    </form>\r
    <footer class="dialog footer">\r
        <div class="footer actionbar">\r
            <button class="size xxs" is="as-button" type="submit" form="quickviewBasicBodyCommand" formaction="/quickview/info">More Info</button>\r
            <button class="size xxs" is="as-button" type="submit" form="quickviewBasicBodyCommand" formaction="/quickview/mute">Got It</button>\r
        </div>\r
    </footer>\r
</dialog>\r
\r
<dialog id="quickviewBasicPopoverEast" class="backdrop clear" is="as-dialog" modus="quickview" position="inline-end" popover>\r
    <header class="dialog header">\r
        <h1 class="header title">Popover Quickview</h1>\r
        <h2 class="header subtitle">A small description to set the tone</h2>\r
    </header>\r
    <form id="quickviewBasicBodyPopover" class="dialog body" method="dialog">\r
        <p>[position="inline-end"]</p>\r
    </form>\r
    <footer class="dialog footer">\r
        <p>Dismission for Popover style dialogs only occurs by blurring focus of the modal or using the Escape key.</p>\r
    </footer>\r
</dialog>\r
\r
<dialog id="quickviewBasicPopoverWest" class="backdrop clear" is="as-dialog" modus="quickview" position="inline-start" popover>\r
    <header class="dialog header">\r
        <h1 class="header title">Popover Quickview</h1>\r
        <h2 class="header subtitle">A small description to set the tone</h2>\r
    </header>\r
    <form id="quickviewBasicBodyPopover" class="dialog body" method="dialog">\r
        <p>[position="inline-start"]</p>\r
    </form>\r
    <footer class="dialog footer">\r
        <p>Dismission for Popover style dialogs only occurs by blurring focus of the modal or using the Escape key.</p>\r
    </footer>\r
</dialog>\r
\r
<dialog id="quickviewBasicPopoverSouth" class="backdrop clear" is="as-dialog" modus="quickview" position="block-end" popover>\r
    <header class="dialog header">\r
        <h1 class="header title">Popover Quickview</h1>\r
        <h2 class="header subtitle">A small description to set the tone</h2>\r
    </header>\r
    <form id="quickviewBasicBodyPopover" class="dialog body" method="dialog">\r
        <p>[position="block-end"]</p>\r
    </form>\r
    <footer class="dialog footer">\r
        <p>Dismission for Popover style dialogs only occurs by blurring focus of the modal or using the Escape key.</p>\r
    </footer>\r
</dialog>\r
\r
<dialog id="quickviewBasicPopoverNorth" class="backdrop clear" is="as-dialog" modus="quickview" position="block-start" popover>\r
    <header class="dialog header">\r
        <h1 class="header title">Popover Quickview</h1>\r
        <h2 class="header subtitle">A small description to set the tone</h2>\r
    </header>\r
    <form id="quickviewBasicBodyPopover" class="dialog body" method="dialog">\r
        <p>[position="block-start"]</p>\r
    </form>\r
    <footer class="dialog footer">\r
        <p>Dismission for Popover style dialogs only occurs by blurring focus of the modal or using the Escape key.</p>\r
    </footer>\r
</dialog>\r
`,oo=Object.freeze(Object.defineProperty({__proto__:null,basic:so,docs:Rt,setuphtml:ro,setupts:no},Symbol.toStringTag,{value:"Module"})),ao=`\r
import type { ToDo } from '@asxs/core/types';\r
import { customElement } from '@asxs/core';\r
\r
const { log } = console;\r
\r
export const TAGNAME = 'as-dialog-antitamper';\r
export @customElement(TAGNAME, { extends: 'dialog' }) class AntitamperDialogElement extends HTMLDialogElement {\r
    #parent!: Element;\r
    accepted: boolean = false;\r
    \r
    accept() {\r
        this.accepted = true;\r
    }\r
    \r
    connectedCallback() {\r
        const { parentElement } = this;\r
        this.#parent = parentElement as Element;\r
    }\r
    \r
    disconnectedCallback() {\r
        if (!this.accepted) this.#parent.appendChild(this);\r
    }\r
    \r
};\r
`,Dt=`\r
## Antitamper Dialogs\r
Antitamper Dialogs follow a simple pattern that can be employed for any component. AsXS provides this as a type of Dialog because it is a more likely scenario where you may need this type of behavior. Oftentimes, this manifests as a "TAC" (Terms And Conditions) dialog or a Paywall, thought it can be any element you would like to facilitate stronger enforcement for the prevention of abuse of your website or webapp.\r
\r
### The Antitamper Pattern\r
\r
#### Participants\r
##### TamperGuard (\`AntitamperDialogElement\`)\r
\r
\`\`\`typescript\r
\${code}\r
\`\`\`\r
\r
### Example\r
\r
\${example}\r
`,io=`\r
<style is="as-css-import" target="dialogs"></style>\r
`,lo=`\r
import '@asxs/dialog/antitamper/antitamper.element';\r
`,co=`\r
<dialog is="as-dialog-antitamper" open style="position: relative">\r
    <form class="dialog body" method="dialog">\r
        <h3>Reproduction</h3>\r
        <ol>\r
            <li>Open Webkit Devtools Element Inspector.</li>\r
            <li>Right-Click on this dialog in the Element Inspector's DOM Tree.</li>\r
            <li>Select "Delete Element".</li>\r
        </ol>\r
        <h3>Expectation</h3>\r
        <p>The dialog is persistent and resists tampering by deleting it from the DOM.</p>\r
        <h3>Observation</h3>\r
        <p>The dialog is persistent and resists tampering by deleting it from the DOM &check;</p>\r
    </form>\r
</dialog>\r
`,qt=Object.freeze(Object.defineProperty({__proto__:null,code:ao,docs:Dt,example:co,setuphtml:io,setupts:lo},Symbol.toStringTag,{value:"Module"})),po="/catalog/variables",uo="/catalog/icons",ho="/catalog/buttons",go="/catalog/tooltip",mo="/catalog/popover",bo="/catalog/dialogs",fo="/catalog/toasts",vo="/catalog/quickviews",xo="/catalog/antitamper",ko=v.interpolate($.parse(yt))(new T(de)),yo=v.interpolate($.parse(wt))(new T($s)),wo=v.interpolate($.parse($t))(new T(Ms)),$o=v.interpolate($.parse(_t))(new T(zt)),_o=v.interpolate($.parse(Tt))(new T(St)),zo=v.interpolate($.parse(Et))(new T(Ct)),To=v.interpolate($.parse(At))(new T(Pt)),Oe=v.interpolate($.parse(Rt))(new T(oo)),So=v.interpolate($.parse(Dt))(new T(qt)),Mt=[{id:po,title:"Variables",docs:ko,module:de},{id:uo,title:"Icons",docs:yo,module:{}},{id:ho,title:"Buttons",docs:wo,module:de},{id:go,title:"Tooltips",docs:$o,module:zt},{id:mo,title:"Popovers",docs:_o,module:St},{id:bo,title:"Dialogs",docs:zo,module:Ct},{id:fo,title:"Toasts",docs:To,module:Pt},{id:vo,title:"Quickviews",docs:Oe,module:Oe},{id:xo,title:"Antitamper",docs:So,module:qt}].reduce((t,e)=>t.set(e.id,e),new Map),Lt=[...Mt.values()],Ot=[...Mt.values()].map(({id:t,title:e})=>({id:t,title:e})),Eo=`\r
<div class="content section">\r
   <as-catalog-docs id="\${id}" class="section document" tabindex="-1">\${docs}</as-catalog-docs>\r
</div>\r
`,Co=`\r
<li class="submenu option">\r
    <a class="option control" href="./asxs/docs/#\${id}">\${title}</a>\r
</li>\r
`,Ao=`\r
<div class="app catalog">\r
    <footer class="catalog footer"></footer>\r
    <div class="catalog body" data-active="#/catalog/section/icons">\r
        <div class="body content">\r
            \${documentation}\r
        </div>\r
    </div>\r
    <header class="catalog header">\r
        <div class="header main">\r
            <h1 class="main title">Catalog</h1>\r
            <menu class="main menu">\r
                \${menu}\r
                <li class="menu item more">\r
                    <as-popover class="item popover">\r
                        <span class="popover control" for="more" part="actuator" tabindex="0">&vellip;</span>\r
                        <ul class="popover submenu" part="envelope" position="bottom left">\r
                            \${more}\r
                        </ul>\r
                    </as-popover>\r
                </li>\r
            </menu>\r
        </div>\r
        <div class="header alert">\r
            <p class="alert caption">\r
                All examples are "Breathing Documentation" so that any changes to the code example get reflected in the rendered output.\r
            </p>\r
        </div>\r
    </header>\r
</div>\r
`,Po=`\r
* { box-sizing: border-box }\r
\r
.app.catalog {\r
    display: flex;\r
    flex-direction: column-reverse;\r
    \r
    .catalog.header {\r
        position: sticky;\r
        top: var(--header-height);\r
        box-shadow: var(--shadow-3);\r
        margin-block: var(--size-px-5);\r
        padding-block: var(--size-px-3);\r
        padding-inline: var(--offset);\r
        background-color: var(--color-primary);\r
        \r
        .header.main {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            gap: var(--size-px-2);\r
            \r
            .main.title {\r
                margin: 0;\r
            }\r
            \r
            .main.menu {\r
                display: flex;\r
                justify-content: flex-end;\r
                align-items: center;\r
                gap: var(--size-px-2);\r
                margin: 0;\r
                padding: 0;\r
                list-style-type: none;\r
                \r
                .menu.item {\r
                    &.more {\r
                        padding: 0;\r
                    }\r
                    \r
                    .item.control {\r
                        display: block;\r
                        border-radius: var(--radius-2);\r
                        padding: var(--size-px-2);\r
                        background-color: var(--color-dark);\r
                        color: var(--color-primary);\r
                        text-decoration: none;\r
                        text-transform: capitalize;\r
                        font-weight: var(--font-weight-6);\r
                        cursor: pointer;\r
                        &:hover, &:focus {\r
                            filter: brightness(92.5%);\r
                        }\r
                    }\r
                                \r
                    .item.popover {\r
                        \r
                        .popover.control {\r
                            --size: var(--size-px-7);\r
                            display: flex;\r
                            justify-content: center;\r
                            align-items: center;\r
                            min-width: var(--size);\r
                            border-radius: var(--radius-2);\r
                            padding: var(--size-px-2);\r
                            background-color: var(--color-dark);\r
                            font-weight: var(--font-weight-6);\r
                            color: var(--color-primary);\r
                        }\r
                        \r
                        .popover.submenu {\r
                            min-width: 320px;\r
                            border-radius: var(--radius-2);\r
                            padding: var(--size-px-1);\r
                            list-style-type: none;\r
                            background-color: var(--color-dark);\r
                            \r
                            .submenu.option {\r
                                margin-block: var(--size-px-1);\r
                                padding: var(--size-px-1);\r
                                &:hover, &:focus {\r
                                    filter: brightness(92.5%);\r
                                }\r
                                \r
                                .option.control {\r
                                    color: var(--color-primary);\r
                                    text-transform: capitalize;\r
                                    text-decoration: none;\r
                                    font-weight: var(--font-weight-6);\r
                                    cursor: pointer;\r
                                }\r
                                \r
                            }\r
                            \r
                        }\r
                        \r
                    }\r
                    \r
                }\r
                \r
            }\r
            \r
        }\r
        \r
        .header.alert {\r
            background-color: var(--color-light);\r
            \r
            .alert.caption {\r
                padding: var(--size-px-2) var(--size-px-3);\r
                font-size: var(--font-size-0);\r
                font-style: italic;\r
            }\r
            \r
        }\r
        \r
    }\r
    \r
    .catalog.body {\r
        \r
        .body.content {\r
            \r
            .content.section {\r
                \r
                .section.control {\r
                    display: none;\r
                }\r
                \r
                .section.document {\r
                    scroll-margin-block-start: var(--size-px-11);\r
                    \r
                    .section.content {\r
                        \r
                        .content.menu {\r
                            list-style-type: none;\r
                            \r
                            .menu.item {\r
                                \r
                                .item.control {\r
                                    cursor: pointer;\r
                                }\r
                                \r
                            }\r
                            \r
                        }\r
                        \r
                    }\r
                    \r
                }\r
                \r
            }\r
            \r
        }\r
        \r
    }\r
    \r
    .catalog.footer {}\r
}\r
`,Ro=`\r
<div class="catalog example">\r
    <header class="example header"></header>\r
    <header class="example body">\r
        <slot class="body content"></slot>\r
    </header>\r
    <footer class="example footer"></footer>\r
</div>\r
`,Do=`\r
* { box-sizing: border-box }\r
\r
:host {\r
    display: block;\r
    padding-inline: var(--offset);\r
    \r
    .catalog.example {\r
        \r
        .example.header {}\r
        \r
        .example.body {\r
            \r
            .body.content {\r
                &::slotted(pre) {\r
                    background-color: var(--gray-8);\r
                    color: var(--blue-3);\r
                    padding: var(--size-px-1) var(--size-px-3);\r
                    overflow-x: auto;\r
                }\r
            }\r
            \r
        }\r
        \r
        .example.footer {}\r
        \r
    }\r
    \r
}\r
\r
:host(:focus-within) {\r
    border-color: var(--color-info);\r
}\r
`;var qo=Object.getOwnPropertyDescriptor,Mo=(t,e,r,s)=>{for(var n=s>1?void 0:s?qo(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n};const Lo="as-catalog-docs";let Be=class extends we{get"as:state"(){return{}}render(){return`
            <style>${Do}</style>
            ${Ro}
        `}};Be=Mo([x(Lo)],Be);var Oo=Object.defineProperty,Bo=Object.getOwnPropertyDescriptor,Bt=t=>{throw TypeError(t)},Io=(t,e,r)=>e in t?Oo(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,No=(t,e,r,s)=>{for(var n=s>1?void 0:s?Bo(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n},Ie=(t,e,r)=>Io(t,typeof e!="symbol"?e+"":e,r),Ho=(t,e,r)=>e.has(t)||Bt("Cannot "+r),Xo=(t,e,r)=>e.has(t)?Bt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),It=(t,e,r)=>(Ho(t,e,"access private method"),r),Ne,He,Z,Nt,Ht;const Xe="as:query:variables",jo=Ot.slice(0,5),Fo=Ot.slice(5),Qo={dialogs:"Queued Modal",toasts:"Toasts",quickviews:"Quickviews",antitamper:"Antitamper"},Go="at-catalog";let je=class extends(He=W,Ne=Xe,He){constructor(){super(...arguments),Xo(this,Z),Ie(this,"as:crawler",new Lr(this)),Ie(this,Ne,document.createElement("input"))}get"as:state"(){const{id:t}=this;return{id:t,menu:new J(jo).with('<li class="menu item"><a class="item control" href="./asxs/docs/#${id}">${title}</a></li>'),more:new J(Fo).with(Co).use(Qo,"titles"),documentation:new J(Lt).with(Eo)}}"change:menu:item"(t){const{target:e}=t,{id:r}=e;this.querySelector(`.content.section .section.control[id="${r}"] + .section.document`).scrollIntoView({behavior:"smooth"})}"as:update:handler"(t){const{[Xe]:e}=this;e.checked=!0}connectedCallback(t=super.connectedCallback()){It(this,Z,Nt).call(this),this.addEventListener("change",this,!0)}disconnectedCallback(t=super.disconnectedCallback()){this.removeEventListener("change",this,!0)}render(){return`
            ${super.render()}
            <style>${Po}</style>
            ${Ao}
        `}};Z=new WeakSet;Nt=function(){for(const t of Lt)It(this,Z,Ht).call(this,t)};Ht=function(t){if(!t?.module?.init)return;const{module:e}=t;e.init(this)};je=No([x(Go)],je);var Wo=Object.defineProperty,Zo=Object.getOwnPropertyDescriptor,Uo=(t,e,r)=>e in t?Wo(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Ko=(t,e,r,s)=>{for(var n=s>1?void 0:s?Zo(e,r):e,o=t.length-1,a;o>=0;o--)(a=t[o])&&(n=a(n)||n);return n},Yo=(t,e,r)=>Uo(t,e+"",r);const{log:Fe}=console,Vo="as-app";let ue=class extends we{get"as:state"(){return{hero:"",speed:"quick",animal:"dog"}}"attr:test"(t){Fe("@app.attr.test",t)}connectedCallback(t=super.connectedCallback()){Fe("CONNECTED!...")}createRenderRoot(){return this}render(){return`
            <style>${Qn}</style>
            ${Fn}
        `}};Yo(ue,"observedAttributes",["test"]);ue=Ko([x(Vo)],ue);const{log:Jo}=console,Xt=document.querySelector("as-app");setTimeout(t=>Xt.setAttribute("test","aaaaaaaaaaaaa"),1e3*3);Jo(">...",Xt);
