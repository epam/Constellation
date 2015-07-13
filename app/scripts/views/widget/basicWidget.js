App.BasicWidgetView = Ember.View.extend({

    templateName: "widget/basicWidget",

    classNames: ["widget"],


    controller: App.BasicWidgetController.create(),

    didInsertElement: function () {

        Ember.run.scheduleOnce('afterRender', this, function () {
            this.initWidgetState();
        });

        this.initEvents();
    },

    initWidgetState: function () {
    },

    initEvents: function () {

    }


});
