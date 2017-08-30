
const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const HapiSass = require('hapi-sass');
const Vision = require('vision');
const Inert = require('inert');
const Handlers = require('./lib/handlers');
const server = new Hapi.Server();
const Handlebars = require('handlebars');
const mongoose = require('mongoose');

const mongo = 'mongodb://heroku_pbr4tz5d:aata9jk3m19cv5e418a0g2m3nt@ds111124.mlab.com:11124/heroku_pbr4tz5d';

mongoose.connect(mongo, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + mongo + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + mongo);
    }
});

server.connection({
    port: process.env.PORT || 3000
});

var sassOptions = {
    src: './style',
    dest: './css',
    force: true,
    debug: true,
    routePath: '/style/{file}.css',
    //includePaths: ['./example/vendor/sass'],
    outputStyle: 'nested',
    sourceComments: true,
    sourceMaps: true,
    srcExtension: 'scss'
};

server.register([Vision, Inert, {
    register: HapiSass,
    options: sassOptions
}], (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: Handlebars
        },
        layout: 'layout',
        relativeTo: __dirname,
        path:'./views',
        partialsPath:'./views/partials',
        layoutPath: Path.join(__dirname, 'views/layout'),
        helpersPath: './views/helpers',
        isCached: false
    });

    server.start((err) => {

        Hoek.assert(!err, err);

        server.route(require('./lib/routes'));

        console.log('server running at ' + server.info.uri);

    });
});
