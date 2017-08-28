/**
 * Created by havard on 02.11.2016.
 */

module.exports = {

    //Pages

    home: (request, reply) => {
        console.log(reply);
        reply.view('index', {
            page: 'home',
            bodyClass: 'home-page',
            items: require('../views/helpers/items.js')({count:4})
        }, {layout:'layout'})
    },

    //Files

    script: { directory: { path: 'script', lookupCompressed: true}},
    images: { directory: { path: 'images', lookupCompressed: true}}

};

