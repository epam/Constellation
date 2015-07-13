App.EditorController = Ember.ObjectController.extend(Ember.Evented, {

    editorDialogBody : 'dialog/editorBody',

    editorDialogFooter : 'dialog/editorDialogFooter',

    title : Ember.I18n.translate("view_camel_case"),

    tabsConfig : {  },

    data :  {},

    changedProperties : { data : {} },

    setData : function(data) {
        this.set('data', data);
    },

    initTabs : function() {

    },

    saveChanges : function() {

    },

    actions : {

    loadData : function(data) {
        this.setData(data);
    },

    save : function() {
        this.saveChanges();
    }
  }

});