App.LegendWidget = Ember.Object.extend({

});

App.LegendWidgetController = App.BasicWidgetController.extend({

    model : App.LegendWidget.create(),

    widgetFooter : "widget/legendWidgetFooter",
    
    widgetId: "legendWidget",

    contentMarkup: "widget/legendWidget",

    widgetName:  Ember.I18n.translate("legend_camel_case")

});