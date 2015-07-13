App.NodeSelectorDialogView = Ember.View.extend({

    controller: App.NodeSelectorDialogController.create(),

    templateName: 'dialog/basicEditor',

    didInsertElement: function () {
        this.get('controller').on('close', this, this.closeEditor);
        this.get('controller').on('nodeSelected', this, this.selectNode);
        this.get('controller').on('saveNode', this, this.saveNode);

        this.get('controller').send('loadData');

        this.addMask();

        var view = this;

        var input = $('.editor-tabs').children('.node-selector-body').children(".widget-search").children("input");

        input.on('keyup', function (event) {
            var startExpression = $(this).val();
            view.updateNodeList(startExpression);
        });

        input.on("input", function (event) {
            var nodeFound = view.findNode($(this).val(), true);

            if (nodeFound) {
                view.markSelectedNode($(this).val());
            }
        });

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

    findNode: function (nodeData, sendEvent) {
        var nodes = this.get("controller").get('model').nodes;

        for (var index = 0; index < nodes.length; ++index) {
            if (nodes[index].node.name === nodeData) {
                return true;
            }
        }

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


    addMask: function () {
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        $('#editor-mask').css({
            'width': maskWidth,
            'height': maskHeight
        });

        $('#editor-mask').fadeTo("slow", 0.2);
    },

    hideMask: function () {
        $('#editor-mask').hide();
    },

    selectNode: function (name) {
        $('.editor-tabs').children('.node-selector-body').children(".widget-search").children("input").val(name);
        this.markSelectedNode(name);
    },

    saveNode: function () {

        if (this.$()) {

            var editorBody = $('.editor-tabs').children('.node-selector-body');

            if (editorBody) {
                var name = editorBody.children(".widget-search").children("input").val();

                App.EventManager.flowsEventManager.sendFlowsNodeChanged(name);
            }
        }

        this.closeEditor();
    },


    closeEditor: function () {
        this.destroy();
        this.hideMask();
    },

    actions: {

        cancel: function () {
            this.closeEditor();
        },

        selectedNode: function (name) {
            this.selectNode(name);
        }

    }


});