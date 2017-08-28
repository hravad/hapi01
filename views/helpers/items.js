/**
 * Created by havard on 08.11.2016.
 */

const Handlebars = require('handlebars');

Handlebars.registerHelper('listItems', function(context, options) {

    var ret = "<ul class='items'>";
    for(var i=0, j=context.length; i<j; i++) {
        ret = ret + "<li class='item'>" + options.fn(context[i]) + "</li>";
    }
    return ret + "</ul>";
});

const items = [
    {id: 1, name:' helmet', price: 3300},
    {id: 2, name:' helmet'},
    {id: 3, name:' helmet'},
    {id: 4, name:' helmet'},
    {id: 5, name:' helmet'},
    {id: 6, name:' helmet'}
];

module.exports = (context, options) => {
    var ret = [];
    context = context || {};
    if(context.count) {
        var len = Math.min(context.count, items.length);
        for(var i = 0; i < len; i++) {
            ret.push(items[i])
        }
        return ret
    }else {
        return items
    }
};