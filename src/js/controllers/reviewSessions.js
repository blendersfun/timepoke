define(["app"], function (app) {
    var reviewSessions = {
        route: function () {
        }
    };
    _.extend(reviewSessions, Backbone.Events);
    app.on("route:review-sessions", reviewSessions.route, reviewSessions);
    return reviewSessions;
});
