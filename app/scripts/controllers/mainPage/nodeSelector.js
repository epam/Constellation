App.NodeSelectorController = Ember.ObjectController.extend({



    name : function(key, value) {

        if(value) {
            localStorage.setItem("nodeName", value);
        }

        return localStorage.getItem("nodeName");
    }.property(),

    actions: {
        launchSelector: function(data) {

            var nodeSelectorDialog = App.__container__.lookup('view:nodeSelectorDialog');
            nodeSelectorDialog.append();
            nodeSelectorDialog.get('controller').send('loadData');
          
        },

        clearData: function(data) {

        }
    }
});
