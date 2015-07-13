App.LoginFormController = Ember.ObjectController.extend({

    rememberMe : false,

    actions: {

        login: function() {
            var controller = this;

            $.post("/login", $("#loginForm").serialize()).then(function(body, status, req) {

                $("#loginForm").fadeOut('slow', function() {
                    controller.transitionToRoute("openflow.topology");
                });

                if(controller.get("rememberMe")) {
                    localStorage.setItem('userId', $("#username").val());
                }
                
                localStorage.setItem('userName', $("#username").val());

            }, function(error) {
            }.bind(this));
        }
    }
});

