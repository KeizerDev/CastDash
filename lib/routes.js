//routes
var index = require('../routes/index');
var pleer = require('../routes/pleer');

var routes = function(app) {
    //define the routes with their functions.
    app.use('/', index);
    app.use('/pleer/', pleer);
};


module.exports = routes;