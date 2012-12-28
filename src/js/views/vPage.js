"use strict";

define(["text!templates/page.html", "backbone", "handlebars"], function (pageHtml) {
    var Page = Backbone.View.extend({
        initialize: function (app) {
            this.setElement(pageHtml);
            app.on('hideNav', _.bind(this.toggleNav, this, false));
            app.on('showNav', _.bind(this.toggleNav, this, true));
            app.on('show', this.show, this);
        },
        toggleNav: function (show) {
            this.$el.find("#main-navbar .nav").toggle(show);
            this.$el.find("#tagline").toggle(!show);
        },
        show: function (newView) {
            $('body').append(this.$el);
            
            if (this.showingView) {
                this.showingView.trigger("hide");
            }
            
            $('#main').empty();
            $('#main').append(newView.$el);
            
            this.showingView = newView;
            this.showingView.trigger('shown');
        }
    });
    return Page;
});
