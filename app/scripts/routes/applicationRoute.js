App.ApplicationRoute = Ember.Route.extend({

    currentViewControllerName: "",

    sendEventToController: function (event) {

        var controllerInstance = this.controllerFor(this.currentViewControllerName);

        switch (this.currentViewControllerName) {


            case "widgetGallery" :
                controllerInstance.send("initModel");

                if ("close" === event) {

                    var containerView = Ember.View.views.left_widget_bar_container_view;

                    if (!Ember.isNone(containerView)) {
                        containerView.updateWidgets(controllerInstance);
                    }

                    containerView = Ember.View.views.right_widget_bar_container_view;

                    if (!Ember.isNone(containerView)) {
                        containerView.updateWidgets(controllerInstance);
                    }

                }

                break;

            default:
                return;

        }

    },

    addMask: function (isConfirmation) {
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
        $('#mask').css({
            'width': maskWidth,
            'height': maskHeight
        });
        $('#mask').fadeTo("slow", 0.2);
        var activeRoute = this;
        if (!isConfirmation) {
            $('#mask').on("click", function () {
                $(this).hide();
                activeRoute.send('close');
            });
        }
    },

    actions: {
        open: function (controller, templateToRender, isConfirmation) {

            this.currentViewControllerName = controller;

            this.sendEventToController("open");

            var templateName = templateToRender || "dialog/basicModalDialog";

            this.addMask(isConfirmation);

            return this.render(templateName, {
                into: this.controller.currentRouteName,
                outlet: 'modal',
                controller: controller
            });

        },

        close: function () {
            this.sendEventToController("close");
            if ($('#mask').length) {
                $('#mask').hide();
            }
            return this.disconnectOutlet({
                outlet: 'modal',
                parentView: this.controller.currentRouteName
            });

        }


    }
});
