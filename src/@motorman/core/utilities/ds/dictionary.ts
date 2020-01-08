
/**
 * @name:
 * @intention
 *  * 
 */
class Dictionary extends Map {
        
    constructor(map) {
        super();
        return this;
    }
    
    private serialize(object) {
        var json = JSON.stringify(object);
        return json;
    }
    private deserialize(json) {
        var object = JSON.parse(json);
        return object;
    }
    private copy(object) {
        var json = this.serialize(object), object = this.deserialize(json);
        return object;
    }
    private static fromMap(map: any) {
        var keys = Object.keys(map), pairs = keys.reduce( pair.bind(this, map), [] );
        
        function pair(map, pairs, key, i, keys) {
            var value = map[key], pair = [ key, value ];
            pairs.push(pair);
            return pairs;
        }
        
        return pairs;
    }
    private toMap(entries) {
        var map = { };
        for (let [ key, value ] of entries) map[key] = value;
        return map;
    }
    
    toJSON() {
        return this.valueOf();
    }
    toString() {
        var json = this.serialize( this.valueOf() );
        return json;
    }
    valueOf() {
        return this.toMap( this.entries() );
    }
    
}

export { Dictionary };
