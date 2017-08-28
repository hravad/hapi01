/**
 * Created by havard on 02.11.2016.
 */

module.exports = {

    //Pages

    index: (request, reply) => {
        reply.view('index', {
            page: 'home',
            htmlClass: 'home-page'
            //items: require('../views/helpers/items.js')({count:4})
        }, {layout:'template-user'})
    },

    //Files

    script: { directory: { path: 'script', lookupCompressed: true}},
    images: { directory: { path: 'images', lookupCompressed: true}}

};

