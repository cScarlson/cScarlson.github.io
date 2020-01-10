
import { Utilities } from '@motorman/core/utilities';
import { bootstrap, $bootstrap, DefaultComponentSandbox, DefaultServicesSandbox } from './defaults';


var DEFAULT_CONFIG = {  // ... defaults
    selector: '[data-v]' || '[data-behavior]',
    datasets: '[v-attribute]',  // includes <script type="application/json"> { items: [...] } </scrpt>
    bootstrap: bootstrap,
    decorators: { services: DefaultServicesSandbox, components: DefaultComponentSandbox, },
};

class Core {
    private utils: Utilities = new Utilities();
    private services: any = { };
    private components: any = { };
    private configuration: any = DEFAULT_CONFIG;
    
    constructor() {
        return this;
    }
    
    init(options) {
        if (!options) throw Error("Vertices Core initialized without options");
        this.arm(options);
        // this.registerComponent = this.utils.noop;
        // this.registerService = this.utils.noop;
        
        return this;
    }
    
    configure(config) {
        this.utils.extend(this.configuration, config);
        return this.utils.extend({ }, this.configuration);
    }
    registerService(Service) {
        var id = Service.constructor;
        var service = { id: id, Constructor: Service };
        this.services[id] = this.services[id] || service;
        
        return this;
    }
    registerComponent(id, Component) {
        var component = { id: id, Constructor: Component };
        this.components[id] = this.components[id] || component;
        return this;
    }
    define(name, Class, options?: any) {
        if ( !!customElements.get(name) ) return this;
        customElements.define(name, Class);
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
        var { configuration, utils } = this, { decorators } = configuration;
        var { services: ServiceSandbox = DefaultServicesSandbox } = decorators;
        var Service = _service.Constructor
          , sandbox = new ServiceSandbox(utils)
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
          , { decorators } = config
          , { components: ComponentSandbox = DefaultComponentSandbox } = decorators
          ;
        var component = this.components[id]
          , Component = component.Constructor
          , sandbox = new ComponentSandbox(element)
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
