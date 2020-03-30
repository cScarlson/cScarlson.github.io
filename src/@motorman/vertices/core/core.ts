
import { Utilities, Deferred } from '@motorman/core/utilities';
import { bootstrap, $bootstrap, DefaultDirector, DefaultComponentSandbox, DefaultServicesSandbox } from './defaults';
import { ElementEngine } from './element-engine';

var director = new DefaultDirector();
var DEFAULT_CONFIG = {  // ... defaults
    director,
    selector: '[data-v]' || '[data-behavior]',
    datasets: '[v-attribute]',  // includes <script type="application/json"> { items: [...] } </scrpt>
    bootstrap: bootstrap,
    decorators: { services: DefaultServicesSandbox, components: DefaultComponentSandbox, },
};

class Core {
    private dConfiguration: Deferred<any> = new Deferred();
    private pConfiguration: Promise<any> = this.dConfiguration.promise;
    private dInitialization: Deferred<any> = new Deferred();
    private pInitialization: Promise<any> = this.dInitialization.promise;
    private utils: Utilities = new Utilities();
    private engine: ElementEngine = new ElementEngine(DefaultComponentSandbox, director);
    private services: any = { };
    private components: any = { };
    private elements: any = { };
    private modules: any = { };
    private configuration: any = DEFAULT_CONFIG;
    
    constructor() {
        var { pInitialization, elements } = this;
        
        pInitialization
            .then( (options) => console.log('INIT', options) )
            ;
        this.pConfiguration
            .then( (config) => this.dInitialization.resolve({ target: document }) )
            ;
        return this;
    }
    
    init(options) {
        if (!options) throw Error("Vertices Core initialized without options");
        this.arm(options);
        // this.registerComponent = this.utils.noop;
        // this.registerService = this.utils.noop;
        // this.dInitialization.resolve(options);
        
        return this;
    }
    
    configure(config) {
        this.utils.extend(this.configuration, config);
        this.engine = new ElementEngine(this.configuration.decorators.components, this.configuration.director);
        this.dConfiguration.resolve(this.configuration);
        return this.utils.extend({ }, this.configuration);
    }
    registerService(Service) {
        var id = Service.constructor;
        var service = { id, Constructor: Service };
        this.services[id] = this.services[id] || service;
        
        return this;
    }
    registerComponent(id, Component) {
        var component = { id, Constructor: Component };
        this.components[id] = this.components[id] || component;
        return this;
    }
    define(definition) {
        var { name, Class, options } = definition;
        var { dConfiguration } = this, { promise: pConfiguration } = dConfiguration;
        
        pConfiguration
            .then( (config) => this.engine.define(name, Class, options) )
            ;
        return this;
    }
    
    arm(options) {  // automatically register modules
        var config = this.configuration
          , bootstrap = config.bootstrap
          , target = options.target
          ;
        
        this.startServices();
        bootstrap.call(config, target, this);
    }
    
    startServices() {
        var config = this.configuration, decorators = config.decorators;
        for (var id in this.services) this.startService(this.services[id], id, this.services);
        return this;
    }
    private startService(_service, id, services) {
        var { configuration, utils } = this, { director, decorators } = configuration;
        var { services: ServiceSandbox = DefaultServicesSandbox } = decorators;
        var Service = _service.Constructor
          , sandbox = new ServiceSandbox(utils, director)
          , service = new Service(sandbox)
          ;
        service.init();
    }
    
    /**
     * Gets called by this.configuration.bootstrap
     * TODO: Rename `details` to `api` and provide an API for mapping, starting, stopping & destroying (etc) modules.
     */
    bootstrap(element, data, id) {
        if (!element || !id) return null;
        if (!this.components[id]) return this.utils.console.warn("Unregistered Component: " + id) && null || null;
        
        var { configuration: config } = this
          , { director, decorators } = config
          , { components: ComponentSandbox = DefaultComponentSandbox } = decorators
          ;
        var component = this.components[id]
          , Component = component.Constructor
          , sandbox = new ComponentSandbox(element, director)
          , instance = new Component(sandbox)
          , data = data || { }
          ;
        var details = {
            id: id,
            instance: instance,
            element: element,
            data: data,
        };
        instance.init(data);
        
        return details;
    }
    
}

export { Core };
