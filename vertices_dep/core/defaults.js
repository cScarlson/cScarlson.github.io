
function bootstrap(target) {
    var element = target;
    var selector = this.selector;
    var data = element.dataset || {};
    var ex = /[\s]+/img;
    var slug = data.behavior || element.v || '';
    var components = slug.split(ex);
    var children = element.children;// element.querySelectorAll(selector);
    (this, document, data, slug, components, children);
    
    var resolveScope = function resolveScope(parent, child) {
        var isDirectDescendant = (child.parentNode === parent);
        if (isDirectDescendant) bootstrap.call(this, child);
    }.bind(this, element);
    
    // components.forEach(this.bootstrap.bind(this, element));
    // Array.prototype.forEach.call(children, resolveScope);
    
    // ... or? ...
    
    Array.prototype.forEach.call(children, resolveScope);  // TODO: Optimize!!!
    if (!!slug) components.forEach(this.bootstrap.bind(this, element));
}

function $bootstrap(root, medium) {
    var scopeSelector = '[data-behavior]'
      , $root = $(root)
      , $parent = $root.find(scopeSelector)
      , hasBehavior = $root.is(scopeSelector)
      ;
    var slug = $root.attr('data-behavior')
      , formattedSlug = slug && slug.replace(/^[,;\s]+|[,;\s]+$/g, '').replace(/[,;\s]+/g, '|').replace(/[|]+$/g, '') || ''
      , moduleIds = $.unique(formattedSlug.split('|')).sort()
      , scopeId = moduleIds.join(' ')
      ;
    var childMedium = medium.$spawn(new function ChildScope() { this.element = root; });
    

    var resolveBehavior = function resolveBehavior(scope, behavior, i, a) {
        var scope = ($root.is('html')) ? document : scope;
        this.start(behavior, scope, scopeId, childMedium);
    }.bind(this, $root[0]);

    var resolveChildren = function resolveChildren(i, scope) {
        var $firstScope = $(scope);
        if (!$($firstScope.parent()).is($parent)) {
            autoRegisterModules.call(this, $firstScope, childMedium);
        }

    }.bind(this);

    moduleIds.forEach(resolveBehavior);
    $parent.each(resolveChildren);

}

class DefaultDirector {}

function DefaultSandbox(anything) { return anything; }  // see The Decorator Pattern @GoF
function DefaultServicesSandbox(utils) { return utils; }
function DefaultNodeSandbox(element) { return element; }

export { bootstrap, $bootstrap, DefaultDirector, DefaultSandbox, DefaultServicesSandbox, DefaultNodeSandbox as DefaultComponentSandbox };
