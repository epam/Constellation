App.FlowsEditorController = App.EditorController.extend({

    editorDialogBody : 'dialog/flowEditorBody',

    editorDialogTabs : 'dialog/flowEditorTabs',

    title : Ember.I18n.translate("view_camel_case"),


    propertyChanged : function(controller, key) {
        this.set('changedProperties.' + key, this.get(key));

    }.observes('data.name', 'data.node'),

    saveChanges : function() {
        var changedProperties = this.get('changedProperties');

        //TODO: add changedProperties to the url and send request

        this.trigger('close');
    },


    setData: function(data) {
        data.node.name = data.node.type + ' | ' + data.node.id;

        data.tableId = 0;

        this.set('data', data);
    }

});