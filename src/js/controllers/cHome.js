define(["app"], function (app) {
    var home = {
        route: function () {
            var View = Backbone.View.extend();
            var view = new View();
            view.setElement($('<div>Woot town.</div>'));
            app.trigger("show", view);
        }
    };
    _.extend(home, Backbone.Events);
    app.on("route:home", home.route, home);
    return home;
});
