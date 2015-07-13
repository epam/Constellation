App.GridView = Ember.View.extend({

    templateName: "grid/gridTemplate",

    controller: App.Grid.create(),

    didInsertElement: function () {

        var controller = this.get("controller");

        controller.send("loadData");
    }

});