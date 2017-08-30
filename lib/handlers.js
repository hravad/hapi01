/**
 * Created by havard on 02.11.2016.
 */
const mongoose = require('mongoose');
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

var users = mongoose.model('users');

module.exports = {

    //Pages

    index: userPage({
        htmlFile: 'index',
        htmlClass: 'home-page',
        title: 'Testing Hapi'
    }),

    users_get: (request, reply)=> {

        users.find((err, users) => {
            reply(users)
        });
    },

    users_post: (request, reply)=> {

        var data = request.payload;

        if(data.firstName && data.lastName) {

            var name = data.firstName + ' ' + data.lastName;

            var user = new users({ name: name });

            user.save(function (err) {
                if (err) return 'noooo';
            });

            reply({
                status: 'success',
                inserted: name
            });
        }else {

            reply('fail');
        }
    },

    //Files

    script: { directory: { path: 'script', lookupCompressed: true}},
    images: { directory: { path: 'images', lookupCompressed: true}}

};

