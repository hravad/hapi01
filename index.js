
const Hapi = require('hapi');
const Path = require('path');
const Hoek = require('hoek');
const HapiSass = require('hapi-sass');
const Vision = require('vision');
const Inert = require('inert');
const Handlers = require('./lib/handlers');
const server = new Hapi.Server();
const Handlebars = require('handlebars');


server.connection({
    port: 3000
});

var sassOptions = {
    src: './style',
    dest: './css',
    force: true,
    debug: false,
    routePath: '/style/{file}.css',
    //includePaths: ['./example/vendor/sass'],
    outputStyle: 'nested',
    sourceComments: false,
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
