
const Utilities = class Utilities {
    
    interpolate(str) {
      return (o) => (new Function(`with (this) return \`${str}\`;`) ).call(o);
    }

}, utils = new Utilities();

export { utils as default, utils, Utilities };
