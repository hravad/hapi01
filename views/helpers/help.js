/**
 * Created by havard on 05.11.2016.
 */
module.exports = (options, context) => {
    var help = {
        norwegian: 'Hjelp!',
        english: 'Help!',
        spanish: 'Ayuda!'
    };
    return help[options] ? decodeURIComponent(help[options]) : 'No help here';
};