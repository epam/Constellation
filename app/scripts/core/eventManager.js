App.EventManager =  Ember.Object.extend({});

App.EventManager.reopenClass({

    view3dEventManager  : Ember.Object.extend(Ember.Evented, {

                            sendNodeData: function(data) {
                                this.trigger('nodeDataSent', data);
                            },

                            sendTopologyNode: function(data) {
                                this.trigger('widgetSelectedNode', data);
                            },
                              
                        }).create(),

    flowsEventManager  : Ember.Object.extend(Ember.Evented, {
                            sendFlowsNodeChanged: function(data) {
                                this.trigger('flowsNodeChanged', data);
                            }
                        }).create()


});

App.EventManager.view3dEventManager.on('nodeDataSent', function(nodeData) {
    App.Logger.log(nodeData);
});