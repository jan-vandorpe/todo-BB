/* 
 RequireJS entry point voor Todo app
 */
requirejs.config({
    //laadt standaard elke module uit deze baseUrl
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        jquery: 'jquery-2.0.3.min',
        //  'underscore'    : 'underscore-amd/underscore-min',          // AMD fork http://github.com/amdjs/backbone
        // 'backbone'      : 'backbone-amd/backbone-min',              // AMD fork ,
        // 'localstorage'  : 'backbone-amd/backbone.localstorage-min',  // AMD compatible, https://github.com/jeromegn/Backbone.localStorage 
        'underscore': 'underscore/underscore-min', // non_AMD met Shim
        'backbone': 'backbone/backbone-min', // non_AMD met Shim
        'backbone.localstorage': 'backbone/backbone.localstorage-min'  // AMD compatible
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.localStorage': {
            deps: ['backbone'],
            exports: 'Backbone'
        }
    }
});
console.log('main.js gestart')

require(['domReady!', 'app/todo'],
        function(doc, todo) {
            todo.start(); //start de app
        });

//helper function
function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
//met Git