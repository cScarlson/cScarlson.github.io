// https://html.spec.whatwg.org/multipage/named-characters.html
console.clear();
(function scrape() {
    const { log } = console;
    const div = document.querySelector('#named-character-references-table');
    const table = div.querySelector('table');
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const data = [ ...rows ].map(map);

    function map(row, i) {
        // log(`@map`, i);
        const { children } = row;
        const [ name, characters, glyph ] = children;
        const code = name.querySelector('code').innerHTML;
        const character = glyph.querySelector('span').innerHTML;
        const unicode = characters.innerHTML;
        const data = { character, code, unicode, tags: [] };

        if (!code || !character || !unicode) log(`@MISSING`, data);
        
        return data;
    }

    log('>', JSON.stringify(data));
})();