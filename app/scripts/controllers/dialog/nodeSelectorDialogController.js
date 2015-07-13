App.NodeSelectorDialogController = App.EditorController.extend({

    editorDialogBody : 'dialog/nodeSelectorDialogBody',

    editorDialogFooter : 'dialog/nodeSelectorDialogFooter',

    title : Ember.I18n.translate("selectNodeText"),

    model : App.NodesWidget.create(),

    saveChanges : function() {
        this.trigger('saveNode');
    },

    actions: {

        
        loadData : function() {
            var controller = this;

            App.ApiProvider.getNodeList(function(nodeData) {

                $.each(nodeData, function(index, nodeCondfig) {

                    nodeCondfig.node.name = nodeCondfig.node.type + " | " + nodeCondfig.node.id;

                });


                controller.get("model").setProperties({nodes:nodeData, filteredNodes: nodeData});
            });

        }

        

    }

});