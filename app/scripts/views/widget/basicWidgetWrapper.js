App.BasicWidgetWrapperView = Ember.View.extend({

    tagName: "li",

    classNames: ["widget-wrapper"],

    actions: {
        toggleWidget: function () {
            this.toggleProperty("controller.isOpened");
            App.Util.initWidgetBarCarousel();
        },

        deleteWidget: function (widgetId) {

            var configuredWidgets = $.parseJSON(localStorage.getItem("configuredWidgets")),

                availableWidgets = $.parseJSON(localStorage.getItem("availableWidgets")),

                deletedWidgets = configuredWidgets.filter(function (item, index, enumerable) {
                    return item.information.id === widgetId;
                });

            availableWidgets.push(deletedWidgets[0]);

            localStorage.setItem("configuredWidgets", JSON.stringify(configuredWidgets.without(deletedWidgets[0])));

            localStorage.setItem("availableWidgets", JSON.stringify(availableWidgets));

            var containerView = Ember.View.views.left_widget_bar_container_view;

            if (!Ember.isNone(containerView)) {
                containerView.updateWidgets();
            }

            containerView = Ember.View.views.right_widget_bar_container_view;

            if (!Ember.isNone(containerView)) {
                containerView.updateWidgets();
            }

            App.Util.initWidgetBarCarousel();

        },
    }
});