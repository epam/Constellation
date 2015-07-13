App.InfoWidgetWrapperView = App.BasicWidgetWrapperView.extend({

    classNames: ["widget-wrapper tabbed-widget"],

    controller: App.InfoWidgetController.create(),

    templateName: "widget/infoWidgetWrapper"

});