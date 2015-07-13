App.NodeSelectorView = Ember.View.extend({

    controller: App.NodeSelectorController.create(),

    templateName: "mainPage/nodeSelector",


    updateNodeName: function (name) {
        var controller = this.get("controller");
        controller.set("name", name);
    },

    didInsertElement: function () {
        App.EventManager.flowsEventManager.on('flowsNodeChanged', this, this.updateNodeName);
        this.updateNodeName(localStorage.getItem("nodeName"));
    },

    willDestroyElement: function () {
        App.EventManager.flowsEventManager.off('flowsNodeChanged', this, this.updateNodeName);
    }

});