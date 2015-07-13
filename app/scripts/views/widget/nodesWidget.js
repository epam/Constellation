App.NodesWidgetView = App.BasicWidgetView.extend({

    controller: App.NodesWidgetController.create(),

    sendSelectedNodeData: function (nodeData, sendEvent) {
        var nodes = this.get("controller").get('model').nodes;

        for (var index = 0; index < nodes.length; index++) {
            if (nodes[index].node.name === nodeData) {
                if (sendEvent) {
                    this.get("controller").send("selectedNode", nodes[index].node.name);
                } else {
                    this.get("controller").set('selectedNode', nodes[index]);
                    this.get("controller").send("setNodeName", nodes[index].node.name);
                }

                return true;
            }
        }

        this.get("controller").set('nodeName', null);

        return false;

    },

    markSelectedNode: function (name) {
        var nodes = $('#nodes-list > span');
        nodes.removeClass('selected-node');

        $.each(nodes, function (index, node) {
            if ($(node).text().indexOf(name) >= 0) {
                $(node).addClass('selected-node');
                return false;
            }
        });

    },

    updateSearchField: function (nodeData) {

        this.$().children(".widget-content").children(".widget-search").children("input").val(nodeData);

        this.sendSelectedNodeData(nodeData);

    },

    updateNodeList: function (filter) {

        var nodes = this.get("controller").get('model').nodes, view = this,
            parts = filter.split("*"), pattern = '';

        $.each(parts, function (index, val) {
            pattern += val + ((index !== parts.length - 1) ? '(.)*' : '');
        });

        var filterRegexp = new RegExp("^" + pattern, "i");

        var filteredNodes = $.grep(nodes, function (nodeConfig) {
            return filterRegexp.test(nodeConfig.node.name);
        });

        setTimeout(function () {
            view.get("controller").get('model').set('filteredNodes', filteredNodes);
        }, 250);

    },

    willDestroyElement: function () {
        App.EventManager.view3dEventManager.off('nodeDataSent', this, this.updateSearchField);
    },

    didInsertElement: function () {
        var view = this;
        view.get("controller").send("loadData");

        Ember.run.scheduleOnce("afterRender", this, function () {

            var input = this.$().children(".widget-content").children(".widget-search").children("input");

            input.val(view.get("controller").get("nodeName"));

            input.on('keyup', function (event) {
                var startExpression = $(this).val();
                view.updateNodeList(startExpression);

            });

            input.on("input", function (event) {
                var nodeFound = view.sendSelectedNodeData($(this).val(), true);

                if (nodeFound) {
                    view.markSelectedNode($(this).val());
                }

            });
        });

        App.EventManager.view3dEventManager.on('nodeDataSent', this, this.updateSearchField);
        this._super();
    },

    actions: {
        selectedNode: function (name) {

            this.markSelectedNode(name);

            this.get("controller").send("selectedNode", name);

            this.$().children(".widget-content")
                .children(".widget-search").children("input").val(name);

        }
    }

});