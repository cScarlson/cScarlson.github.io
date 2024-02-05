
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox, translate } from '/src/app/core.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/banner/banner.html',
    styles: './src/app/children/banner/banner.css',
};

f('my-banner', metadata, Sandbox, new class {
    call = async ($) => ({
        metadata: $.interpolate({
            title: await translate('BANNER:FEATURE:TITLE'),
            subtitle: await translate('BANNER:FEATURE:SUBTITLE'),
            content: await translate('BANNER:FEATURE:CONTENT'),
            action: await translate('BANNER:FEATURE:ACTION:CONTACT'),
        }),
        sm: `responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people`,
        taxa: 'responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people more mobile responsive site audience create website mobile brand website responsive web audience web expand site responsive yours web more personal brand yourself responsive opportunity get more mobile impress people personal yourself impress yourself mobile yours audience yourself design web audience impact responsive people more yourself brand site create make web brand mobile responsive yourself web mobile responsive web create web app presence personal audience brand web mobile more create revenue responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people more mobile responsive site audience create website mobile brand website responsive web audience web expand site responsive yours web more personal brand yourself responsive opportunity get more mobile impress people personal yourself impress yourself mobile yours audience yourself design web audience impact responsive people more yourself brand site create make web brand mobile responsive yourself web mobile responsive web create web app presence personal audience brand web mobile more create revenue responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people more mobile responsive site audience create website mobile brand website responsive web audience web expand site responsive yours web more personal brand yourself responsive opportunity get more mobile impress people personal yourself impress yourself mobile yours audience yourself design web audience impact responsive people more yourself brand site create make web brand mobile responsive yourself web mobile responsive web create web app presence personal audience brand web mobile more create revenue responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people more mobile responsive site audience create website mobile brand website responsive web audience web expand site responsive yours web more personal brand yourself responsive opportunity get more mobile impress people personal yourself impress yourself mobile yours audience yourself design web audience impact responsive people more yourself brand site create make web brand mobile responsive yourself web mobile responsive web create web app presence personal audience brand web mobile more create revenue responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people more mobile responsive site audience create website mobile brand website responsive web audience web expand site responsive yours web more personal brand yourself responsive opportunity get more mobile impress people personal yourself impress yourself mobile yours audience yourself design web audience impact responsive people more yourself brand site create make web brand mobile responsive yourself web mobile responsive web create web app presence personal audience brand web mobile more create revenue responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people more mobile responsive site audience create website mobile brand website responsive web audience web expand site responsive yours web more personal brand yourself responsive opportunity get more mobile impress people personal yourself impress yourself mobile yours audience yourself design web audience impact responsive people more yourself brand site create make web brand mobile responsive yourself web mobile responsive web create web app presence personal audience brand web mobile more create revenue responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people more mobile responsive site audience create website mobile brand website responsive web audience web expand site responsive yours web more personal brand yourself responsive opportunity get more mobile impress people personal yourself impress yourself mobile yours audience yourself design web audience impact responsive people more yourself brand site create make web brand mobile responsive yourself web mobile responsive web create web app presence personal audience brand web mobile more create revenue responsive mobile website design web presence brand personal app flyer site market yourself expand audience make more revenue create opportunity grow business yours today impact customers impress get people more mobile responsive site audience create website mobile brand website responsive web audience web expand site responsive yours web more personal brand yourself responsive opportunity get more mobile impress people personal yourself impress yourself mobile yours audience yourself design web audience impact responsive people more yourself brand site create make web brand mobile responsive yourself web mobile responsive web create web app presence personal audience brand web mobile more create revenue',
        connectedCallback() {
            const { taxa } = this;
            const { shadow } = $;
            const textground = shadow.querySelector('.banner.textground');
            
            textground.innerHTML = taxa;
        },
        generate() {
            const { sm } = this;
            const array = sm.split(' ');
            const mixed = this.mix(100, array);
            const output = mixed.join(' ');
            const eight = `${output} ${output} ${output} ${output} ${output} ${output} ${output} ${output}`;
            
            return eight;
        },
        mix(limit, words) {
            if (words.length === limit) return words;
            if (words.length > limit) return this.mix(limit, words.pop());
            const random = Math.floor( Math.random() * words.length );
            const word = words.at(random);
            
            if (words[words.length - 1] !== word) words.push(word);
            if (words.length < limit) return this.mix(limit, words);
            return words;
        }
    })
});
