App.NodesWidget = Ember.Object.extend({

});

App.NodesWidgetController = App.BasicWidgetController.extend({

    model : App.NodesWidget.create(),

    contentMarkup: "widget/nodesWidget",

    widgetId: "nodesWidget",

    widgetName:  Ember.I18n.translate("nodes_camel_case"),

    actions : {


    loadData : function() {
        var controller = this;

        App.ApiProvider.getNodeList(function(nodeData) {

            $.each(nodeData, function(index, nodeCondfig) {

                nodeCondfig.node.name = nodeCondfig.node.type + " | " + nodeCondfig.node.id;

            });

            controller.get("model").setProperties({nodes:nodeData, filteredNodes: nodeData});
        });

    },

    selectedNode : function(name) {
        this.setNodeName(name);
        App.EventManager.view3dEventManager.sendTopologyNode(name);
        var nodes = this.get('model').nodes;
        for(var index = 0; index < nodes.length; ++index) {
            if (nodes[index].node.name === name) {
                this.set('selectedNode', nodes[index]);
                break;
            }
        }
    },

    setNodeName: function (name) {
        this.setNodeName(name);
    }

  }

  
});