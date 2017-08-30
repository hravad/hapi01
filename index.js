
const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const HapiSass = require('hapi-sass');
const Vision = require('vision');
const Inert = require('inert');
const server = new Hapi.Server();
const Handlebars = require('handlebars');
const mongoUri = 'mongodb://heroku_pbr4tz5d:aata9jk3m19cv5e418a0g2m3nt@ds111124.mlab.com:11124/heroku_pbr4tz5d';
const mongoose = require('mongoose');

require('./models/users');

const Handlers = require('./lib/handlers');

mongoose.connect(mongoUri, {
    useMongoClient: true
});

const mongooseOptions = {
    bluebird: false,
    uri: 'mongodb://heroku_pbr4tz5d:aata9jk3m19cv5e418a0g2m3nt@ds111124.mlab.com:11124/heroku_pbr4tz5d'
};

server.connection({
    port: process.env.PORT || 3000
});


const sassOptions = {
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


//var db = server.plugins['hapi-mongoose'].connection;
