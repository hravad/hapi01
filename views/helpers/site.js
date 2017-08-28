/**
 * Created by havard on 08.11.2016.
 */

const site = {
        title: 'eppO'
    };

module.exports = (options, context) => {
    return site[options] ? decodeURIComponent(site[options]) : 'Undefined site prop';
};