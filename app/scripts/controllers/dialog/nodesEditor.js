App.NodesEditorController = App.EditorController.extend({

    editorDialogBody : 'dialog/nodeEditorBody',

        editorDialogTabs : 'dialog/nodeEditorTabs',

    title : Ember.I18n.translate("nodeDetails"),


    generalTabActive : function() {

        return this.get('tabsConfig')[0].isActive;

    }.property('tabsConfig.@each.isActive'),

    advancedTabActive : function(key, value) {

        return this.get('tabsConfig')[1].isActive;

    }.property('tabsConfig.@each.isActive'),

    tabsConfig : [
        Ember.Object.create({
            id :'general',
            isActive : true,
            title : Ember.I18n.translate("general_camel_case")
        }),

        Ember.Object.create({
            id :'advanced',
            isActive : false,
            title : Ember.I18n.translate("advanced_camel_case")
        })
    ],

    propertyChanged : function(controller, key) {
        this.set('changedProperties.' + key, this.get(key));

    }.observes('data.name', 'data.node'),

    saveChanges : function() {
        var changedProperties = this.get('changedProperties');

        //TODO: add changedProperties to the url and send request

        this.trigger('close');
    }

});