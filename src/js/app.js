"use strict";

define (["views/page"], function (Page) {
    var App = Backbone.Router.extend({
        start: function () {
            this._view = new Page(app);
            
            var controllers = _.map(_.uniq(_.values(this.routes)), function (name) {
                return "controllers/" + name;
            });
            require(controllers, function () {
                Backbone.history.start();
            });
        },
        navigate: function (fragment) {
            // this would be circular if required at the top
            var login = require("controllers/login");
            
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
            "home":            "home",
            "review-sessions": "reviewSessions"
        }
    });
    var app = new App();
    return app;
});
