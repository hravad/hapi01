/**
 * Created by havard on 02.11.2016.
 */
const Handlers = require('./handlers');

const routes = [

    //Pages

    { method:'GET', path: '/', handler: Handlers.home},


    // Files

    { method: 'GET', path: '/script/{file*}', handler: Handlers.script},
    { method: 'GET', path: '/images/{file*}', handler: Handlers.images}

];

module.exports = routes;