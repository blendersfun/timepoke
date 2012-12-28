"use strict";

define(["app", "text!templates/login.html"], function (app, loginHtml) {
    var Login = Backbone.View.extend({
        template: Handlebars.compile(loginHtml),
        events: {
            "click #signIn":     "signIn",
            "click #createUser": "createUser",
            "click #new":        "routeToNew",
            "click #back":       "routeBack",
            
            "keyup input":       "validate",
            "blur input":        "dirtyAndValidate"
        },
        render: function (isNew) {
            this.isNew = !!isNew;
            this.setElement(this.template({
                isNew: this.isNew
            }));
        },
        
        signIn: function (e) {
            e.preventDefault();
            var user = $('#inputUsername').val();
            var pass = $('#inputPassword').val();
            
            if (this.validate(true)) {
                this.trigger("signIn", user, pass);
            }
        },
        createUser: function (e) {
            e.preventDefault();
            var user = $('#inputUsername').val();
            var pass = $('#inputPassword').val();
            var confirmPass = $('#inputConfirmPassword').val();
            
            if (this.validate(true)) {
                this.trigger("createUser", user, pass);
            }
        },
        routeToNew: function (e) {
            e.preventDefault();
            app.navigate("login/new", { trigger: true });
        },
        routeBack: function (e) {
            e.preventDefault();
            app.navigate("login", { trigger: true });
        },
        
        dirtyAndValidate: function (e) {
            var el = $(e.currentTarget);
            if (el.val() != '') {
                el.data("dirty", true);
            }
            
            return this.validate();
        },
        validate: function (soilAll) {
            soilAll = soilAll === true;
            
            var user = $("#inputUsername");
            var pass = $("#inputPassword");
            var confirmPass = $("#inputConfirmPassword");
            
            if (soilAll) {
                user.data("dirty", true);
                pass.data("dirty", true);
                confirmPass.data("dirty", true);
            }
            
            var userVal, passVal, confirmPassVal;
            var result = true;
            
            if (this.isNew) {
                if (user.data("dirty")) {
                    userVal = user.val();
                    result = this.processRule(user, userVal.length >= 2, "More than two characters.") && result;
                    result = this.processRule(user, userVal.length <= 25, "Less than twenty-five characters.") && result;
                    result = this.processRule(user, _.indexOf(this.usernameBlacklist, userVal) == -1, "Username already exists.") && result;
                }
                if (pass.data("dirty")) {
                    passVal = pass.val();
                    result = this.processRule(pass, passVal.length >= 4, "More than four characters.") && result;
                    result = this.processRule(pass, passVal.length <= 25, "Less than twenty-five characters.") && result;
                }
                if (confirmPass.data("dirty")) {
                    confirmPassVal = confirmPass.val();
                    result = this.processRule(confirmPass, passVal == confirmPassVal, "Does not match password.") && result;
                }
            }
            
            return result;
        },
        processRule: function (input, passed, message) {
            if (!passed) {
                this.errorMessage(input, message);
            }
            else {
                this.clearErrorMessage(input, message);
            }
            return passed;
        },
        errorMessage: function (input, message) {
            var group = input.parents(".control-group");
            
            // if there is already an error on this control group, do not print another
            if (group.find(".errorMsg").length) {
                return;
            }
            
            group.addClass("error");
            group.removeClass("success");
            var errorSpan = input.data("error message: " + message);
            if (!errorSpan) {
                errorSpan = $("<span class='help-inline errorMsg'>" + message + "</span>");
                input.data("error message: " + message, errorSpan);
                input.after(errorSpan);
            }
        },
        clearErrorMessage: function (input, message) {
            var group = input.parents(".control-group");
            var errorSpan = input.data("error message: " + message);
            if (errorSpan) {
                errorSpan.remove();
                input.data("error message: " + message, null);
            }
            
            // if, after clearing this error, there is still an error on the control,
            // do not clear the error status
            if (!group.find(".errorMsg").length) {
                group.addClass("success");
                group.removeClass("error");
            }
        },
        
        usernameBlacklist: [],
        addToUsernameBlacklist: function (username) {
            this.usernameBlacklist.push(username);
        },
        
        getLoginTimeframe: function () {
            if (this.$el.find("#loginForever").is(":checked")) {
                return "FOREVER";
            }
            return "SESSION";
        }
    });
    return Login;
});
