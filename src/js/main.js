"use strict";

/* The configuration file for require.js module loading.
 * Also launches the application.
 */
 
var libBase = "../../../lib/";

requirejs.config({
    baseUrl: "src/js",
    paths: {
        "jquery":     libBase + "jquery-1.8.3",
        "backbone":   libBase + "backbone",
        "underscore": libBase + "underscore",
        "handlebars": libBase + "handlebars-1.0.rc.1",
        "text":       libBase + "require-text",
        "domReady":   libBase + "require-domReady",
        "bootstrap":  libBase + "bootstrap/js/bootstrap"
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ["underscore"],
            exports: "Backbone"
        },
        "handlebars": {
            exports: "Handlebars"
        },
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});

require([
    "app", 
    "domReady", 
    "jquery", 
    "backbone", 
    "handlebars", 
    "bootstrap"
], function (app, domReady) {
    domReady(_.bind(app.start, app));
});
