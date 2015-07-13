App.BasicWidget = Ember.Object.extend({

});

App.BasicWidgetController = Ember.ObjectController.extend({

    model : App.BasicWidget.create(),

    widgetFooter : "widget/widgetFooter",

    isOpened: true,

    selectedNode: {},

    nodeName : null,

    setNodeName : function(name) {

        this.set("nodeName", name);
        localStorage.setItem("nodeName", name);

    },

    isNodeSelected : function() {

        return this.get("nodeName") !== null;

    }.property("nodeName"),

    setData : function(_data) {
        this.get("model").setProperties(_data);
        this.setNodeName();
    },

    actions: {
        loadData: function(data) {
        this.setData(data);
    },

    clearData: function(data) {
        this.get("model").setProperties({});
    },

    viewFlows : function() {

        if(!Ember.isEmpty(this.get("nodeName"))) {

            var name = this.get("nodeName"), href = window.location.href;

            localStorage.setItem("nodeName", name);

            var url = href.substring(0, href.lastIndexOf('/'));

            window.location.href = url + "/flows";

        }

    },

    edit: function() {
        if (Object.keys(this.get('selectedNode')).length) {
            var nodesEditor = App.__container__.lookup('view:nodesEditor');
            nodesEditor.append();
            nodesEditor.get('controller').send('loadData', this.get('selectedNode'));
        }
    }

    }
});
