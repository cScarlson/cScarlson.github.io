
var creational = require('./creational');
var structural = require('./structural');
var behavioral = require('./behavioral');
var other = require('./other');

module.exports = {
    creational, ...creational,
    structural, ...structural,
    behavioral, ...behavioral,
    other, ...other,
};
