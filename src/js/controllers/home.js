define(["app"], function (app) {
    var home = {
        route: function () {
            console.log(this);
        }
    };
    _.extend(home, Backbone.Events);
    app.on("route:home", home.route, home);
    return home;
});
