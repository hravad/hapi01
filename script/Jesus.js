


var Events = function(thisArg) {
    this.t = thisArg;
    this.handlers = {
        //'someEvent': [fn, fn, fn]
    };
    this.counter = 0;
};

Events.prototype = {
    constructor: Events,
    addListener: function(eventLabel, fn) {
        var id = 'fn'+(this.counter ++);
        if(!this.handlers[eventLabel]) {
            this.handlers[eventLabel] = [];
        }
        this.handlers[eventLabel].push(fn);
        return fn
    },
    removeListener:function (eventLabel, fn) {
        var arr = this.handlers[eventLabel];
        var index = arr.indexOf(fn);
        index > -1 ? arr.splice(index, 1): false;
    },
    fireEvent: function (eventLabel, vars, thisArg) {
        var scope = thisArg || window;
        for(var fn in this.handlers[eventLabel]) {
            if(!this.handlers[eventLabel].hasOwnProperty(fn)) continue;
            this.handlers[eventLabel][fn].call(scope, vars)
        }
    }
};



var Jesus, J;
Jesus = J = (function () {


    var events = new Events(),
    _templates = {},
    _widgets = {};

    //TODO: Do something with Arrays
    function toArray(o) {
        for (var a = [], l=o.length; l--;) a[l] = o[l];
        return a;
    }

    // Query ////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    var query = function (q, array, r) {

        r = r || document;

        if (
            q.indexOf(' ') > -1 ||
            q.indexOf('[') > -1 ||
            q.indexOf('>') > -1 ||
            q.indexOf('+') > -1 ||
            q.indexOf(':') > -1 ||
            (q.indexOf('#') > - 1 && q.indexOf ('.') > -1) ||
            q.startsWith('.') && !array
        ) {
            return array ? toArray(r.querySelectorAll(q)) : r.querySelector(q);
        }

        if(q.startsWith('.')) {

            return toArray(r.getElementsByClassName(q.replace('.','')));
        }

        if (q.startsWith('#')) {

            return document.getElementById(q.replace('#',''));
        }

        return array ? toArray(r.getElementsByTagName(q)) : r.querySelector(q);

    };

    // Templating ///////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////


    var render = function (template, data) {

        return Mustache.render(template, data)
    };


    // Element //////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    var createElem = function (tagName, attrs, vars) {

        if(tagName == 'fragment') {return document.createDocumentFragment()}

        vars = vars || {};
        var el = document.createElement(tagName);

        if(attrs) {

            for(var attr in attrs) {
                el.setAttribute(attr, attrs[attr]);
            }
        }
        return el;
    };

    // Inline Script handling ///////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    function widgetWatcher(mutation) {

        events.fireEvent('widgetmutation', mutation)
    }

    function registerTemplate(template, name) {

        template = template instanceof Element ? template.innerHTML : template;
        Mustache.parse(template);
        _templates[name] = template;
    }

    function registerWidget(instance) {

        if(instance.rootElement) {

            var root = instance.rootElement;
            var fn;
            var widgetObserver = new MutationObserver(widgetWatcher);
            widgetObserver.observe(instance.rootElement.parentElement, {childList: true});

            fn = function(mutations) {

                for(var i = 0; i < mutations.length; i++)  {

                    var m = mutations[i];
                    m.removedNodes.forEach(function (n) {
                        if(n == root) {
                            instance.destroy();
                            widgetObserver.disconnect();
                            J.removeListener('widgetmutation', fn);
                            console.log(instance);
                        }
                    });
                }
            };

            events.addListener('widgetmutation', fn);
        }
    }

    //Hmmmm
    function tell (vars) {

        var script = document.currentScript,
            el = script.parentElement,
            type = el.dataset.type;

        el.innerHTML = '';

        switch (type) {

            case 'template':

                var template = el.innerHTML,
                    name = el.dataset.name;

                _templates[name] = template;
                break;

            case 'render':

                //$.getJSON(el.dataset.url, function(data){
                //    console.log(data);
                //    el.RemoveClass('J').InnerHTML = render(vars.template, data);
                //});
                break;
        }
    }

    // Element Prototype ////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    var EP = Element.prototype;

    Object.defineProperty(EP, 'InnerHTML', {

        set: function (v) {

            this.innerHTML = v;
            events.fireEvent('innerhtml', {
                target: this,
                html: v
            })
        },

        get: function () {

            return this.innerHTML;
        }
    });

    EP.Cache =  function(storage, name){
        storage instanceof Array ? storage.push(this) : storage[name] = this;
        return this;
    };

    EP.Call = function(fn, thisArg) {

        fn.call(thisArg ? thisArg : this);
        return this;
    };

    EP.Append = function(el, vars) {

        if (typeof el == 'string') {

            el = createElem(el, vars);
            this.appendChild(el);

            console.log(this);
            return this;
        }

        for(var i = 0; i < arguments.length; i++) {

            if(arguments[i] === null || arguments[i] === this.null) continue;
            this.appendChild(arguments[i]);
        }

        return this;
    };

    EP.AppendTo = function(target) {

        target.appendChild(this);
        return this;
    };

    EP.Prepend = function(el) {

        for(var i = arguments.length-1; i > -1; i--) {
            this.insertBefore(arguments[i], this.firstChild);
        }
        return this;
    };

    EP.PrependTo =function(target) {

        target.insertBefore(this, target.firstChild);
        return this;
    };

    EP.Create = function (tagName, vars) {

        return createElem(tagName, vars);
    };

    EP.AddClass = function (c) {

        if(typeof c == 'string') { c = c.split(' ') }

        for(var i = 0; i < c.length; i++) {

            this.classList.add(c[i]);
        }
        return this
    };

    EP.RemoveClass = function (c) {

        if(typeof c == 'string') { c = c.split(' ') }

        for(var i = 0; i < c.length; i++) {

            this.classList.remove(c[i]);
        }
        return this
    };

    EP.RemoveClass = function (c) {

        this.classList.toggle(c);
        return this
    };

    EP.Html = function (v) {

        this.InnerHTML = v;
        return this
    };

    EP.Q = function (q,array) {

        return query.apply(null, [q,array, this])
    };


    // API //////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////


    var API = function () {
        //Hmmmmmm
    };

    Object.defineProperty(API, 'templates', {
        get: function () {
            return _templates;
        }
    });
    API.Q = API.pray = query;
    API.create = createElem;
    API.render = render;
    API.registerWidget = registerWidget;
    API.registerTemplate = registerTemplate;
    API.tell = tell;
    API.addListener = events.addListener.bind(events);
    API.removeListener = events.removeListener.bind(events);
    API.fireEvent = events.fireEvent.bind(events);

    return API

})();
var Q = J.Q;
var C = J.create;


// var a = Jesus.create('div').Html('Mø').AddClass('ku')
//     .Append(
//         J.create('a').Html('Kjøttdeig'),
//         J.create('a').Html('Biff'),
//         J.create('a').Html('Burger')
//             .Append(
//                 J.create('span').Html(' Tilbud!')
//             ),
//         J.create('a').Html('Mørbrad')
//     );


// E.create('div',{class:'lol'}).append(
//
//     function () {
//         var elements = [];
//         for (var i = 0; i < 10; i++) {
//             elements.push(E.create(
//                     a, {href: '#'}
//                 ).Html('i')
//             )
//         }
//         return elements;
//     }
//
// );















