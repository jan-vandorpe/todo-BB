/* 
 RequireJS entry point voor Todo app
 */
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    
    paths: {
        app             : '../app',
        jquery          : 'jquery-2.0.3.min',
        'underscore'    : 'underscore-amd/underscore-min', // AMD support
        'backbone'      : 'backbone-amd/backbone-min', // AMD support,
        'localstorage'  : 'backbone-amd/backbone.localstorage-min'// AMD support
       }
});
console.log('main.js gestart')
  
require(['domReady!','app/todo'],
    function   (doc, todo) {
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