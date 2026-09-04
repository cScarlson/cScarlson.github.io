
class Environment {
    type = 'prd';
    worker = './service.worker.js';
    manifest = new Manifest();
    
    constructor(options = {}) {
        const { type, worker, manifest } = { ...this, ...options };
        
        this.type = type;
        this.worker = worker;
        this.manifest = new Manifest(manifest);
        
        return this;
    }
    
};

class Manifest {
    host = '[error]';
    platform = '[error]';
    version = '[error]';
    source = new HostSource();
    
    constructor(options = {}) {
        const { host, platform, version, source } = { ...this, ...options };
        
        this.host = host;
        this.platform = platform;
        this.version = version;
        this.source = new HostSource(source);
        
        return this;
    }
    
}

class HostSource {
    host = '[error]';
    version = '[error]';
    
    constructor(options = {}) {
        const { host, version } = { ...this, ...options };
        this.host = host;
        this.version = version;
    }
    
}

export { Environment, Manifest, HostSource };
