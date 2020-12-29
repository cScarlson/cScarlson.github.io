
class Utilities {
    
    interpolate(str) {
      return (o) => (new Function(`with (this) return \`${str}\`;`) ).call(o);
    }

}

const utils = new Utilities();

export { Utilities, utils };
