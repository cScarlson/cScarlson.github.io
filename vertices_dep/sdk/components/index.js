
;(function iif(V) {
    'use strict';
    
    var Utils = function Utils() {
        var thus = this;
        
        // export precepts
        this.extend = jQuery.extend.bind(jQuery);
        this.timeout = window.setTimeout.bind(window);
        this.debounce = new Function();
        
        return this;
    };
    
    var EventHub = function EventHub() {
        var thus = this;
        var channels = { };
        
        function publish(channel) {
            // var args = Array.prototype.splice.call(arguments, 0);
            // console.log.apply(console, ['publish'].concat(args));
            return this;
        }
        
        function subscribe(channel, handler) {
            console.log('subscribe', arguments);
            return this;
        }
        
        function unsubscribe(channel, handler) {
            console.log('unsubscribe', arguments);
            return this;
        }
        
        // export precepts
        this.channels = channels;
        this.publish = publish;
        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        
        return this;
    };
    
    var Mediator = function Mediator(EventHub) {
        var thus = this;
        var hub = new EventHub();
        
        function handleDataChanged(channel, data) {
            hub.publish.apply(hub, arguments);
        }
        
        function publish(channel, data) {
            if (!channel) return this.utils.console.warn("Channel " + channel + " is an invalid channel name");
            if (channel in this.publishers) this.publishers.call(this, channel, data);
            else hub.publish.apply(hub, arguments);
            
            return this;
        }
        function subscribe(channel, handler) {
            if (!channel) return this.utils.console.warn("Channel " + channel + " is an invalid channel name");
            if (!handler) return this.utils.console.warn("Handler for " + channel + " is not valid");
            if (channel in this.subscribers) this.subscribers.call(this, channel, data);
            else hub.publish.apply(hub, arguments);
            
            return this;
        }
        function unsubscribe(channel, handler) {
            if (!channel) return this.utils.console.warn("Channel " + channel + " is an invalid channel name");
            if (!handler) return this.utils.console.warn("Handler for " + channel + " is not valid");
            if (channel in this.subscribers) this.subscribers.call(this, channel, data);
            else hub.publish.apply(hub, arguments);
            
            return this;
        }
        
        // export precepts
        this.channels; // required
        this.publishers; // required
        this.subscribers; // required
        this.publish = publish;
        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        
        return this;
    };
    
    var director = new (function Director(Mediator) {
        var thus = this;
        var channels = {
            'DATA:CHANGED': 'data/changed'
        };
        var publishers = {
            'data/changed': handleDataChanged.bind(this),
        };
        var subscribers = { };
        
        function handleDataChanged(channel, data) {
            hub.publish.apply(hub, arguments);
        }
        
        function init() {
            return this;
        }
        
        // export precepts
        Mediator.call(this, EventHub);
        this.init = init;
        this.channels = channels;
        this.publishers = publishers;
        this.subscribers = subscribers;
        
        return this;
    })(Mediator);
    
    var Sandbox = function Sandbox(director) {
        var thus = this;
        
        function publish(channel, data) {
            director.publish.apply(director, arguments);
            return this;
        }
        function subscribe(channel, data) {
            director.subscribe.apply(director, arguments);
            return this;
        }
        function unsubscribe(channel, data) {
            director.unsubscribe.apply(director, arguments);
            return this;
        }
        
        // export precepts
        Utils.call(this);
        this.publish = publish;
        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        
        return this;
    };
    
    var ServiceSandbox = function ServiceSandbox(utils) {
        var thus = this;
        
        // export precepts
        Sandbox.call(this, director);
        this.utils = utils;
        this.http = jQuery.ajax.bind(jQuery);
        
        return this;
    };
    
    var ComponentSandbox = function ComponentSandbox(element) {
        var thus = this;
        
        var Scaffold = function Scaffold(element) {  // Interface
            var thus = this;
            var $element = new jQuery(element);
            
            $element.parent = new Function();
            
            function bootstrap(options) {  // V.bootstrap should only be available to Components
                V.bootstrap(options);
                return this;
            }
            
            function interpolate(string) {
                return V.utils.interpolate(string);
            }
            
            // export precepts
            Sandbox.call(this, director);
            this.target = element;
            this.element = $element;
            this.create = jQuery.bind(jQuery);
            this.bootstrap = bootstrap;
            this.interpolate = interpolate;
            
            return this;  // (f)
        };
        
        var f = Scaffold.call(function f(selector) {  // Default action
            var $element = f.element.find(selector), element = $element[0];
            return new ComponentSandbox(element);
        }, element);
        
        return f;
    };
    
    var DataDecorator = function DataDecorator(data) {
        var data = data || { };
        
        jQuery.extend(this, data);
        this.dataset = data;
        
        return this;
    };
    
    var config = V.config({
        selector: '[data-v]',
        datasets: '[data-attribute]',
        bootstrap: function handleBootstrap(target, core) {
            var element = target;
            var selector = this.selector;
            var data = new DataDecorator(element.dataset);
            var ex = /[\s]+/img;
            var slug = data.v || data.behavior || element.v || '';
            var ids = slug.split(ex);
            var children = element.children;// element.querySelectorAll(selector);
            var components = [ ];
            
            var resolveScope = function resolveScope(parent, child) {
                var isDirectDescendant = (child.parentNode === parent);
                if (isDirectDescendant) handleBootstrap.call(this, child, this);
            }.bind(core, element);
            
            if (!!slug) components = ids.map(core.bootstrap.bind(core, element, data));
            Array.prototype.forEach.call(children, resolveScope);  // TODO: Optimize!!!
            components.forEach( mountComponent.bind(core) );
            
            function mountComponent(component) {
                if (!component) return;
                var instance = component.instance, handleMount = instance.handleMount;
                if (handleMount) handleMount.call(instance);
            }
            
        },
        decorators: {
            services: ServiceSandbox,
            components: ComponentSandbox
        },
    });


    // SERVICES


    V(function TestService($) {
        var thus = this;
        
        function init() {
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });


    // MODULES


    V('vInclude', function VInclude($) {
        var thus = this;
        
        /**
         * @Intention: Handles bootstrapping after partial is loaded.
         * @Variance: A different handler can be used for different types of elements.
         *      * For a full list of elements that support automatic conversion of remote-source-attributes,
         *      * see: https://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
         */
        function handleAnchorTemplate(template) {
            var $template = $('.partial');
            $.element.replaceWith($template.element);
            $.bootstrap({ target: $template.target });
        }
        
        function init(data) {
            $.element.load($.target.href, handleAnchorTemplate);
            $.publish('include:initialized', { datum: true });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });


    V('vJSON', function VJSON($) {
        var thus = this;
        
        function init(data) {
            var json = $.target.innerHTML, dataset = JSON.parse(json);
            $.element.data(dataset);
            $.timeout( $.element.trigger.bind($.element, 'V:JSON', dataset), 0 );
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });


    V('vJSON-get', function VJSONGet($) {
        var thus = this;
        
        function init(data) {
            console.log('@vJSON-get', $.target.src);
            $.element.load($.target.src);
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });


    V('vInterpolate', function VInterpolate($) {  // vInterpolate is used for {variable} bindings
        var thus = this;
        
        function init(data) {
            var template = $.target.innerHTML, $variables = data.dataset.vinterpolate || '{}', variables = JSON.parse($variables);
            var interpolated = $.interpolate(template)(variables);
            
            $.element.html(interpolated);
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });


    V('vRepeat', function VRepeat($) {
        var thus = this;
        
        function repeat(template, item, i) {
            var $element = $.create(template), element = $element[0], $ids = element.dataset.v, json = JSON.stringify(item);
            var _ids = $ids.split(' '), index = _ids.indexOf('vRepeat'), _r = _ids.splice(index, 1), ids = _ids.join(' ');
            
            $element.attr({ 'data-v': ids, 'data-vinterpolate': json, 'data-items': null, 'data-v-repeat': i });
            return element;
        }
        
        function bootstrapElements(element) {
            $.bootstrap({ target: element });
        }
        
        function init(data) {
            var $template = $.element, target = $.target, template = target.outerHTML, items = JSON.parse(target.dataset.vrepeat);
            var $comment = $.create('<!-- vRepeat -->'), elements = items.map( repeat.bind(this, template) );
            
            $.element.replaceWith($comment);
            $comment.after(elements);
            elements.forEach(bootstrapElements);
            
            this.items = items;
            
            return this;
        }
        
        // export precepts
        this.items = [ ];
        this.init = $.timeout.bind(window, init.bind(this));
        
        return this;
    });


    V('vAttributes', function VAttributes($) {  // vAttributes is used for Attribute-Directives
        var thus = this;
        
        function init(data) {
            console.log('@vAttributes');
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });


    // ****


    V('partial', function Partial($) {
        var thus = this;
        
        function handleBackgroundChanged(e, data) {
            if (data.datum) $.element.css({ 'background': 'orangered' });
            e.preventDefault();
        }
        
        function init(data) {
            var $h1 = $('h1');
            // console.log('>--))>', $h1.element);
            
            $.timeout($h1.element.trigger.bind($h1.element, 'change-background'), 4000);
            $.element.on('background-changed', handleBackgroundChanged);
            $.publish('app:initialized', { datum: true });
            console.log('@partial#init');
            return this;
        }
        
        // function init(data) {
        //     console.log('@partial#init');
        // }
        
        function handleMount() {
            console.log('@partial#handleMount');
        }
        
        // export precepts
        this.init = init;
        this.handleMount = handleMount;
        
        return this;
    })
    // Notice V() --> V: V(e)(t)(c);
    ('partial-child', function PartialChild($) {
        var thus = this;
        
        function handleCSS() {
            $.element.css({ 'background-color': '#fff', 'border-left': 'solid 1px orangered', 'color': '#333' });
            $.timeout( $.element.trigger.bind($.element, 'background-changed', { datum: true }), 2000);
        }
        
        function init(data) {
            $.element.on('change-background', handleCSS);
            $.publish('child:initialized', { datum: true });
            console.log('@partial-child#init');
            return this;
        }
        
        // function init(data) {
        //     console.log('@partial-child#init');
        // }
        
        function handleMount() {
            console.log('@partial-child#handleMount');
        }
        
        // export precepts
        this.init = init;
        this.handleMount = handleMount;
        
        return this;
    });


    V('test', function Test($) {
        var thus = this;
        
        function init(data) {
            $.element.css({ 'background-color': '#fff', 'border-left': 'solid 1px orangered', 'color': '#333' });
            $.publish('test:initialized', { datum: true });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });


    director.init();
    window.addEventListener( 'load', V.bootstrap.bind(V, { target: document }) );
    /**
     * RESOURCES:
     *      * https://www.w3schools.com/howto/howto_html_include.asp
     *      * https://www.html5rocks.com/en/tutorials/webcomponents/imports/
     */

    /**
     * CONCEPTS
     */
    // var component = new V('some/path/to/template.html', { selector: 'widget' }, function Component($) {
    //     // ...
    // });

})(window.V);
