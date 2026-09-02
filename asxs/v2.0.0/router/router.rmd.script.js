
const { log } = console;
const { top } = window;
const { location } = top;
const { pathname, search, hash } = location;
const { dataset } = document.querySelector('script#redirect');
const { root } = dataset;
const uri = `${pathname}${search}${hash}`;
const redirect = encodeURIComponent(uri);
const params = new URLSearchParams({ redirect });
const url = `${root}?${params}`;

log(`@ASXS ROUTER REDIRECT from "${uri}" to "${url}"`);
location.assign(url);
