
/**
 * @deviations 
 *  * @param #this: key
 *  *   * Demarcates a given datum to use as an instance's "state".
 *  * @param #this: observation
 *  *   * Provides convenience for getting an instance's state based upon `key`.
 *  *   * @reasoning
 *  *   *   * The key-name `state` is common between problem-domains; as so, objects such as an Address may 
 *  *   *   * naturally encapsulate a datum named `state`. This allows the subclass to override `get key() {}` 
 *  *   *   * to provide that of their own. The words "key" & "observation" are assumed to 
 *  *   *   * be less common than "state", and preferred over [modified] words like "$state". In the case
 *  *   *   * that `this` is to be returned as "state", omitting `key` from the constructor provides the
 *  *   *   * implementor opportunity to define `get undefined() { return this; }` (accommodated by setter)
 *  *   *   * because, in which case,
 *  *   *   * `get observation() { return this[this.key]; }`
 *  *   *   * `===`
 *  *   *   * `get observation() { return this.undefined; }`
 *  *   *   * `===`
 *  *   *   * `get undefined() { return this; }`
 *  * @param #attach(): notify
 *  *   *   Type: Boolean
 *  *   *   Allows for any given Observer to declare whether or not it's `update()` method should be invoked
 *  *   *   upon attachment, in order to obtain the Subject's current state.
 */
class Subject {
    private $key: any = undefined;
    private observers = [ ];
    get key() { return this.$key; }  // for subclass overrides
    set key(value) { this.$key = value; }  // for subclass overrides
    get observation() { return this[this.key]; }  // (aliases Observer Pattern "state" datum) uses given datum for state
    set observation(value) { this[this.key] = value; this.notify(); }  // manually sets state & notifies observers
    
    constructor(key) {
        this.key = key;
    }
    
    attach(observer, notify) {
        this.observers.push(observer);
        if (notify) observer.update(this.observation);
        return this;
    }
    
    detach(observer) {
        var { observers } = this;
        for (let i = observers.length; i--;) if (observers[i] === observer) observers.splice(i, 1);
        return this;
    }
    
    notify(state?: any) {
        var { observers } = this, state = state || this.observation;
        for (let i = 0, len = observers.length; i < len; i++) observers[i].update(state);
        return this;
    }
    
}

export { Subject };
