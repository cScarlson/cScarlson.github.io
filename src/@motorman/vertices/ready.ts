
var pDocumentReady = new Promise(exe);

function exe(res, rej) {
  window.addEventListener( 'load', () => res(), false );
  if ( { 'complete': true, 'interactive': true }[ document.readyState ] ) res();
}

export { pDocumentReady as ready };
