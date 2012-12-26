define(["app", "text!templates/login.html"], function (app, loginHtml) {
    var Login = Backbone.View.extend({
        template: Handlebars.compile(loginHtml),
        events: {
            "click #signIn":     "signIn",
            "click #createUser": "createUser",
            "click #new":        "routeToNew"
        },
        initialize: function () {
            app.on("route:login", this.route, this);
        },
        route: function (isNew) {
            this.setElement(this.template({
                isNew: !!isNew
            }));
            app.trigger("hideNav");
            app.trigger("show", this);
        },
        setupRedirect: function (redirectArgs) {
            this.redirectArgs = redirectArgs;
        },
        isLoggedIn: function () {
            return !!this.loginInfo;
        },
        
        signIn: function (e) {
            e.preventDefault();
        },
        createUser: function () {
            e.preventDefault();
        },
        routeToNew: function (e) {
            e.preventDefault();
            app.navigate("login/new", { trigger: true });
        }
    });
    var login = new Login();
    return login;
});
