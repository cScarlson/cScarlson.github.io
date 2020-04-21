
import { Utilities, Deferred } from '@motorman/core/utilities';
import { IEventAggregator } from '@motorman/core/eventaggregator.interface';
import { bootstrap, $bootstrap, DefaultDirector, DefaultSandbox, DefaultComponentSandbox, DefaultServicesSandbox } from './defaults';
import { ElementEngine } from './element-engine';


class DOMUtilities {
    
    constructor(protected node: Node) {}
    
    forEach(node: Node): Node {
        // var { isConnected, parentNode: parent, previousSibling: previous, nextSibling: next, firstChild: child } = result;
        
        // // RECURSION
        // if (result !== node) return this.parseNode(result);  // reparse. assume replacement occurred. do not continue for next or child.
        // if (child) this.parseNode(child);  // TCO???
        // if (next) this.parseNode(next);  // TCO???
        // this.dTemplateReady.resolve(true);  // gets fulfilled after last element processed. noop after that.
        
        return node;  // result can still equal node
    }
    
}


type ModuleType = string | 'service'|'element'|'attribute'|'IoT' | ''|'component'|'directive'|'';

interface IModuleMetadata {
    type: ModuleType;
    selector: string;
    Class: any;
    Sandbox?: any;  // sandbox
}

interface IBootstrap {  // Note similarity to The Command Pattern. implementer only needs Instance.execute and not necessarily an "action"
    new(context: Core, action?: string);
    execute(environment: any): any;
}
interface IConfiguration {
    environment: any;
    director: IEventAggregator;  // maybe unnecessary. perhaps sandbox should be provided by V.register(metadata);
    selector: string;
    Sandbox: (typeof DefaultSandbox)|any;  // perhaps sandbox should be provided by V.register(metadata);
    bootstrap: IBootstrap;
}

var director = new DefaultDirector();
var DEFAULT_CONFIG = {  // ... defaults
    director,
    selector: '[data-v]' || '[data-behavior]',
    datasets: '[v-attribute]',  // includes <script type="application/json"> { items: [...] } </scrpt>
    // bootstrap: bootstrap,
    decorators: { services: DefaultServicesSandbox, components: DefaultComponentSandbox, },
};

class Core {
    private dConfiguration: Deferred<any> = new Deferred();
    private pConfiguration: Promise<any> = this.dConfiguration.promise;
    private dInitialization: Deferred<any> = new Deferred();
    private pInitialization: Promise<any> = this.dInitialization.promise;
    private utils: Utilities = new Utilities();
    // private engine: ElementEngine = new ElementEngine(DefaultComponentSandbox, director);
    public $instances: Map<any, any> = new Map();
    public $targets: Map<Node, any> = new Map();
    public modules: any = { };
    public configuration: any = DEFAULT_CONFIG;
    
    constructor() {
        var { pConfiguration, pInitialization } = this;
        
        pConfiguration
            .then( (config) => this.dInitialization.resolve(config) )
            ;
        pInitialization
            .then( (config) => this.bootstrap(config) )
            ;
        return this;
    }
    
    init(options) {
        var { configuration } = this;
        // this.dInitialization.resolve({ ...configuration, options });
        return this;
    }
    
    bootstrap(config: IConfiguration) {
        var { environment, bootstrap } = config;
        bootstrap.execute(this);
    }
    
    configure(config) {
        this.utils.extend(this.configuration, config);
        // this.engine = new ElementEngine(this.configuration.decorators.components, this.configuration.director);
        this.dConfiguration.resolve(this.configuration);
        return this.utils.extend({ }, this.configuration);
    }
    
    register(metadata: IModuleMetadata) {
        var { pConfiguration } = this;
        pConfiguration.then( (config: IConfiguration) => this.registerModule(config, metadata) );
        return this;
    }
    private registerModule(config: IConfiguration, metadata: IModuleMetadata) {
        var { modules } = this;
        var { selector: _selector, Sandbox: _Sandbox } = config;
        var { type, selector = _selector, Class, Sandbox = _Sandbox } = metadata;
        
        if ( !modules[type] ) modules[type] = new Map<string, IModuleMetadata>();
        modules[type].set(selector, { ... metadata, type, selector, Class, Sandbox });
        
        return this;
    }
    
    // define(definition) {
    //     var { name, Class, options } = definition;
    //     var { dConfiguration } = this, { promise: pConfiguration } = dConfiguration;
        
    //     pConfiguration
    //         .then( (config) => this.engine.define(name, Class, options) )
    //         ;
    //     return this;
    // }
    
    arm(options) {  // automatically register modules
        var config = this.configuration
          , bootstrap = config.bootstrap
          , target = options.target
          ;
        
        this.startServices();
        bootstrap.call(config, target, this);
    }
    
    startServices() {
        var { configuration, modules } = this;
        var { service: registry } = modules;
        for (let i = 0, len = registry.length; i < len; i++) this.startService(registry[i], i, registry);
        return this;
    }
    private startService(metadatum: IModuleMetadata, i: number, metadata: IModuleMetadata[]) {
        // ...
        // var { configuration, utils } = this, { director, decorators } = configuration;
        // var { services: ServiceSandbox = DefaultServicesSandbox } = decorators;
        // var Service = _service.Constructor
        //   , sandbox = new ServiceSand?box(utils, director)
        //   , service = new Service(sandbox)
        //   ;
        // service.init();
    }
    
    /**
     * Gets called by this.configuration.bootstrap
     * TODO: Rename `details` to `api` and provide an API for mapping, starting, stopping & destroying (etc) modules.
     */
    bootstrapX(element, data, id) {
        if (!element || !id) return null;
        // if (!this.components[id]) return this.utils.console.warn("Unregistered Component: " + id) && null || null;
        
        var { configuration: config } = this
          , { director, decorators } = config
          , { components: ComponentSandbox = DefaultComponentSandbox } = decorators
          ;
        // var component = this.components[id]
        //   , Component = component.Constructor
        //   , sandbox = new ComponentSandbox(element, director)
        //   , instance = new Component(sandbox)
        //   , data = data || { }
        //   ;
        var details = {
            id: id,
            // instance: instance,
            element: element,
            data: data,
        };
        // instance.init(data);
        
        return details;
    }
    
}

export { Core };
