"use strict";

define(["app", "views/vLogin", "jquery.cookie"], function (app, LoginView) {
    var login = {
        initialize: function () {
            _.extend(this, Backbone.Events);
            this._view = new LoginView();
            
            app.on("route:login", this.route, this);
            app.on("route:logout", this.logout, this);
            this._view.on("createUser", this.createUser, this);
            this._view.on("signIn", this.signIn, this);
        },
        route: function (isNew) {
            if (this.isLoggedIn()) {
                app.initialRoute(this.redirectArgs);
                return;
            }
            this._view.render(isNew);
            
            app.trigger("hideNav");
            app.trigger("show", this._view);
        },
        setupRedirect: function (redirectArgs) {
            this.redirectArgs = redirectArgs;
        },
        isLoggedIn: function () {
            return $.cookie("user") && $.cookie("passHash");
        },
        
        signIn: function (user, pass) {
            var self = this;
            $.ajax({
                url: "src/php/ajax.php?action=login",
                contentType: 'application/json',
                type: "post",
                data: JSON.stringify({ user: user, pass: pass }),
                success: function (data) {
                    self.cacheCredentials(data.user, data.passHash);
                    app.initialRoute(self.redirectArgs);
                },
                error: function (data) {
                    console.log('error:', data);
                }
            });
        },
        createUser: function (user, pass) {
            var self = this;
            $.ajax({
                url: "src/php/ajax.php?action=createUserAndLogin",
                type: "post",
                data: JSON.stringify({ user: user, pass: pass }),
                success: function (data) {
                    if (!data.error) {
                        self.cacheCredentials(data.user, data.passHash);
                        app.initialRoute(self.redirectArgs);
                    }
                    else {
                        if (data.error == "USER_EXISTS") {
                            self._view.addToUsernameBlacklist(user);
                            self._view.validate();
                        }
                    }
                },
                error: function (data) {
                    console.log('error:', data);
                }
            });
        },
        cacheCredentials: function (user, passHash) {
            // delete existing cookies
            $.cookie("user", null);
            $.cookie("passHash", null);
            
            // set new cookies
            var loginTimeframe = this._view.getLoginTimeframe();
            var options = {};
            if (loginTimeframe == "FOREVER") {
                options.expires = 365 * 500; // 500 years, effectively forever
            }
            $.cookie("user", user, options);
            $.cookie("passHash", passHash, options);
        },
        logout: function () {
            $.cookie("user", null);
            $.cookie("passHash", null);
            app.initialRoute();
        }
    };
    login.initialize();
    
    return login;
});
