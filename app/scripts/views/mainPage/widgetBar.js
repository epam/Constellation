App.LeftWidgetBarView = Em.View.extend({
    templateName: "mainPage/widgetBar",

    classNames: ["left-widget-bar", "widget-bar"],

    didInsertElement: function () {

        var containerView = Ember.View.views.left_widget_bar_container_view;
        containerView.updateWidgets();

    },


});

App.LeftWidgetBarContainerView = Ember.ContainerView.extend({

    tagName: "ul",

    didInsertElement: function () {
        Ember.run.scheduleOnce('afterRender', this, function () {
            App.Util.initWidgetBarCarousel();
        });
    },

    getWidgetViewMap: function () {
        if (!this.get("widgetViewMap")) {
            this.createWidgetViewMap();
        }

        return this.get("widgetViewMap");
    },

    createWidgetViewMap: function () {
        var widgetViewMap = {

            nodesWidget: App.NodesWidgetWrapperView,

            infoWidget: App.InfoWidgetWrapperView,

            legendWidget: App.LegendWidgetWrapperView

        };

        this.set("widgetViewMap", widgetViewMap);
    },

    updateWidgets: function () {

        var configuredWidgets = $.parseJSON(localStorage.getItem("configuredWidgets")),
            container = this;

        container.removeAllChildren();

        configuredWidgets.forEach(function (item, index, enumerable) {

            if (!item.rightSide) {
                var childView = container.createChildView(container.getWidgetViewMap()[item.information.id]);
                container.pushObject(childView);
            }

        });

        Ember.run.scheduleOnce('afterRender', this, function () {
            App.Util.initWidgetBarCarousel();
        });

    }

});

App.RightWidgetBarView = Em.View.extend({

    templateName: "mainPage/rightWidgetBar",

    classNames: ["right-widget-bar", "widget-bar"],

    didInsertElement: function () {

        var containerView = Ember.View.views.right_widget_bar_container_view;
        containerView.updateWidgets();

    },


});

App.RightWidgetBarContainerView = App.LeftWidgetBarContainerView.extend({

    updateWidgets: function () {

        var configuredWidgets = $.parseJSON(localStorage.getItem("configuredWidgets")),
            container = this;

        container.removeAllChildren();

        configuredWidgets.forEach(function (item, index, enumerable) {

            if (item.rightSide) {
                var childView = container.createChildView(container.getWidgetViewMap()[item.information.id]);
                container.pushObject(childView);
            }

        });

        Ember.run.scheduleOnce('afterRender', this, function () {
            App.Util.initWidgetBarCarousel();
        });

    }

});
