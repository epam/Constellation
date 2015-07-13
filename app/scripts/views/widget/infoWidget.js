App.InfoWidgetView = App.BasicWidgetView.extend({

    controller: App.InfoWidgetController.create(),

    updateData: function (nodeId) {
        var controller = this.get("controller");

        App.ApiProvider.getNodeById(nodeId, function (nodeData) {
            controller.send("loadData", nodeData);
            controller.set('selectedNode', controller.get('model'));
        });
    },

    didInsertElement: function () {
        App.EventManager.view3dEventManager.on('nodeDataSent', this, this.updateData);
        this._super();
    },

    willDestroyElement: function () {
        App.EventManager.view3dEventManager.off('nodeDataSent', this, this.updateData);
    },

    initWidgetState: function () {
        var controller = this.get("controller");
        controller.send("clearData");
        this._super();
    },

    actions: {
        goToFeatures: function () {
            this.set("controller.isTabActive", true);
            this.set("controller.isTabHide", false);
        },

        goToConfiguration: function () {
            this.set("controller.isTabActive", false);
            this.set("controller.isTabHide", true);
        }
    }

});
