/**
 * Created by havard on 02.11.2016.
 */

const userPage = (vars) => {

    var config = {
        title: vars.title || '',
        htmlClass: vars.htmlClass || '',
        files: require('../views/helpers/files.js')()
    };

    return (request, reply)=> {

        reply.view(vars.htmlFile, config, {layout:vars.layout || 'template-user'})
    }
};

module.exports = {

    //Pages

    index: userPage({
        htmlFile: 'index',
        htmlClass: 'home-page',
        title: 'Testing Hapi'
    }),

    //Files

    script: { directory: { path: 'script', lookupCompressed: true}},
    images: { directory: { path: 'images', lookupCompressed: true}}

};

