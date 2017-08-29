var files = require('./../../script/files.json');
const Handlebars = require('handlebars');

Handlebars.registerHelper('listFiles', function(context, options) {

    var ret = [];

    for(var i=0, j=context.length; i<j; i++) {
        var item = context[i];

        if(typeof item == 'string') {
            ret.push(item);
            continue;
        }
        if(item.script) {
            ret.push(
                '<script src="' + item.script + '"></script>'
            );
            continue;
        }
        if(item.link) {
            ret.push(
                '<link href="' + item.link + '" rel="' + item.rel + '" />'
            )
        }
    }
    return ret.join('\n');

});
module.exports = (options, context) => {
    return files;
};