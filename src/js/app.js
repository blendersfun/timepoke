"use strict";

define (["views/vPage"], function (Page) {
    var App = Backbone.Router.extend({
        start: function () {
            this._view = new Page(app);
            
            var controllers = _.map(this.controllers, function (name) {
                return "controllers/" + name;
            });
            require(controllers, function () {
                Backbone.history.start();
                var login = require("controllers/cLogin");
                if (login.isLoggedIn()) {
                    app.initialRoute();
                }
                else if (!window.location.hash.match(/^#login/)) {
                    app.navigate('#login', { trigger: true });
                }
            });
        },
        initialRoute: function (redirectArgs) {
            app.trigger("showNav");
            if (redirectArgs && !redirectArgs[0].match(/^login/)) {
                app.navigate.apply(app, redirectArgs);
            }
            else {
                app.navigate('#home', { trigger: true });
            }
        },
        navigate: function (fragment) {
            // this would be circular if required at the top
            var login = require("controllers/cLogin");
            
            if (login.isLoggedIn() || fragment.match(/^login/)) {
                Backbone.Router.prototype.navigate.apply(this, arguments);
            }
            else {
                login.setupRedirect(arguments);
                Backbone.Router.prototype.navigate.apply(this, ["login", { trigger: true }]);
            }
        },
        routes: {
            "login(/:new)":    "login",
            "logout":          "logout",
            "home":            "home",
            "review-sessions": "reviewSessions"
        },
        controllers: [
            'cLogin',
            'cHome',
            'cReviewSessions'
        ]
    });
    var app = new App();
    return app;
});
