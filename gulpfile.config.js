
export  default {
    port: 3000,
    server: {
        baseDir: './',
        middleware: function handle(req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            if (req.method === 'OPTIONS') return this['handle:OPTIONS'](req, res, next);
            next();
        },
        ['handle:OPTIONS'](req, res, next) {
            res.statusCode = 200;
            return res.end();
        }
    },
};
