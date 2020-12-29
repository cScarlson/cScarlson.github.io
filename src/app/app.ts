
import { V, Bootstrap, Sandbox, Route, Markdown, utils, ready } from '@motorman/vertices';
//
import template from './template.html';
import readme from './README.md';

var app = (function App() {
    
    
    
  
  class HTTP {
    static id = 'http';
  }
  
  // class ServiceSandbox {
  //   static id = 'sandbox';
  
  //   constructor(core) {
  //     console.log('ServiceSandbox', core);
  //   }
  
  // }
  
  function ServiceSandbox($) {
    console.log('ServiceSandbox', $);
  }
  ServiceSandbox.id = 'sandbox';
  
  V.service(class Utils { static id = 'utils'; constructor() { return utils; } });
  V.service('utils', HTTP);
  V.service('core', 'utils', 'http', ServiceSandbox);
  V.service('sandbox', class TestService {
    static id = 'test';
  
    constructor($) {
      console.log('TestService', $);
    }
  
  });
  
  var itemsA = [
    { id: 995, type: 'a', title: 'A' },
    { id: 996, type: 'b', title: 'B' },
    { id: 997, type: 'c', title: 'C' },
  ];
  var stateA = {
    title: 'Title A',
    description: 'Description A',
    content: '',
    selected: itemsA[0],
    items: itemsA,
    getFooterContent() { return 'Footer stuff'; }
  };
  
  var itemsB = [
    { id: 995, type: 'a', title: 'A' },
    { id: 996, type: 'b', title: 'B' },
    { id: 997, type: 'c', title: 'C' },
    { id: 998, type: 'd', title: 'D' },
    { id: 999, type: 'e', title: 'E' },
    { id: 1000, type: 'f', title: 'F' },
  ];
  var stateB = {
    title: 'Title B',
    description: '',
    content: '',
    selected: itemsB[2],
    items: itemsB,
    getFooterContent() { return 'Footer stuff'; }
  };
  
  V(Sandbox, class RootComponent {
    static selector = '[v="vertices"]';
    static template = false;
    markdown = new Markdown();
    html = this.markdown.html(readme);
  
    constructor($) {
      var outlet = $.target.querySelector('[slot="docs"]');
      outlet.innerHTML = this.html;
    }
  
  });
  
  V(Sandbox, class AppComponent {
    static selector =  'app-example';
    static template = template;
    $ = null;
    title = 'Title A';
    description = 'Description A';
    content = '';
    $selections = new Map();
    $items = new Map();
    get target() { return this.$.target }
    get items() { return Array.from( this.$items.values() ) }
    set items(value) { this.$items.clear(); value.forEach( (item) =>  this.$items.set(item.id, item) ); }
  
    constructor($) {
      // console.log('AppComponent', $);
      this.$ = $;
      this.items = itemsB;
      setTimeout( () => this.target.setAttribute('data-test', 'test'), (1000 * 5) );
      // this.$.setState(this).setTemplate(AppComponent.template);
    }
  
    getFooterContent() { return 'Footer stuff'; }
  
    ['mutation:attributes:data-test'](value, old, mutation) {
      console.log('@AppComponent #mutation #attribute', value, old, mutation);
      console.error(`ADD MUTATION HOOKS TO DOUCMENTATION!`);
    }
  
    ['mutation:childList:added'](mutation, node?, ...more) {
      if (!node) return;
      if (more.length) return this['mutation:childList:added'](mutation, ...more);
      if (!{ [Node.ELEMENT_NODE]: true }[ node.nodeType ]) return;
      if ( node.classList.contains('item') ) V(node);
    }
  
    handleSelection(e, item) {
      console.log('...received dispatch for... ', item.id, item.type);
      // this.selected = item;
      this.$selections.set(item.id, item);
      // this.$.publish('selection:changed', item);  // publishing first works...
      // this.$.setState(this);
      this.$.publish('selection:changed', item);  // ...but publishing afterword does not
    }
  
  });
  
  V(Sandbox, class ItemComponent {
    static selector = 'li.list.item';
    static template = '<span class="item title" (click)="handleClick($event, { id, type, title })">${title} (select one)</span>';
    $ = null;
    id = -1;
    type = '';
    title = '';
    get target() { return this.$.target }
  
    constructor($) {
      var { target, dataset } = $;
      var { id, type, title } = dataset;
      
      // console.log('<LI />', title);
      this.$ = $;
      this.id = id;
      this.type = type;
      this.title = title;
      // this.$.setState(this).setTemplate(ItemComponent.template);
      this.$.subscribe('selection:changed', this.handleSelection);
    }
  
    handleClick = (e, item) => {
      console.log('CLICK!', e.type, item);
      var x = new CustomEvent('selection:changed', { detail: { ...this.$.dataset } });
      this.$.target.dispatchEvent(x);
      // this.selectionChange.emit({ ...this.$.dataset });
    };
  
    handleSelection = (e) => {
      if ( this.$.classList.contains('active') ) return;
      var { type: event, detail: item } = e;
      var { id, type, title } = item;
      var cousin = {
        'a': 'f',
        'f': 'a',
        'b': 'e',
        'e': 'b',
        'c': 'd',
        'd': 'c',
      }[ type ];
      
      console.log('SELECTION', this.id, type, cousin);
      if ( cousin === this.type ) this.$.classList.add('active');
      else this.$.classList.remove('active');
  
      if ( this.$.classList.contains('active') ) console.log('DISPATCHING FOR', this.id, this.type, this.target.isConnected);
      if ( this.$.classList.contains('active') ) this.$.target.dispatchEvent(  new CustomEvent('selection:changed', { ...this.$.dataset })  );
    };
  
  });
  
  console.log('-->', V.$components);
  
  ready.then( () => V.use( new Bootstrap() ).bootstrap(document) );
  
  var root = new Route([
    //   { url: '', name: '', component: '', data: {} }
  ]);
  
  
  
  /*
  TODO...
  
  V.
  V(Sandbox, Generic, Specialized, class OneOff {  // uses [].reduce.call(args, Element);
    constructor($) {...}
  });
  V.service(ServiceSandbox, HTTP, class UserService {
    constructor(http) {...}
  });
  -- AND --
  V.service('http', class HTTP { ... });  // Singleton
  V.service({ 'http': HTTP, ... });       // Singletons
  V.service(ServiceSandbox, 'http', class UserService {
    constructor($, http) {...}
  });
  var isolate = new V();
  isolate(Sandbox, class Component { ... });
  isolate.service(ServiceSandbox, class Service { ... });
  ...
  
  */
  
    
  
  
  return { stub: true };
})();

export { app };
