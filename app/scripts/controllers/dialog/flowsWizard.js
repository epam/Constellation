App.FlowsWizardController = App.WizardController.extend({

    editorDialogBody : 'dialog/flowWizardBody',

    editorDialogTabs : 'dialog/flowWizardTabs',

    title : Ember.I18n.translate('add_flow'),


    propertyChanged : function(controller, key) {
        this.set('changedProperties.' + key, this.get(key));

    }.observes('data.name', 'data.node', 'data.ingressPort', 'data.priority', 'data.hardTimeout', 'data.idleTimeout', 
      'data.cookie', 'data.etherType', 'data.vlanId', 'data.vlanPriority', 'data.dlSrc', 'data.dlDst', 'data.nwSrc',
      'data.nwDst', 'data.tosBits', 'data.tpSrc', 'data.tpDst', 'data.protocol', 'data.installInHw'),

    saveChanges : function() {
        var changedProperties = this.get('changedProperties');


        if($.inArray('SET_DL_DST', changedProperties.data.actions) > -1) {

            var actions = [];
        
            $.each(changedProperties.data.actions, function( index, value ) {
                if(value === 'SET_DL_DST') {
                    value = value + '=' + $('#SETDLDST-mac-address').val();
                }
                actions.push(value);
            });

            changedProperties.data.actions = actions;
        }

        if(!changedProperties.data.nodeId) {
            changedProperties.data.nodeId = $('#node-list-select').val();
        }

        var controller = this, nodeConfig = changedProperties.data.nodeId.split('|');

        changedProperties.data.node = { type : nodeConfig[0], id : nodeConfig[1] };

        delete changedProperties.data.nodeId;

        App.ApiProvider.addFLowToNode(nodeConfig[1], nodeConfig[0], changedProperties.data.name, 
        JSON.stringify(changedProperties.data), 
        function() {
            controller.trigger('close');
            $("#flows_list").trigger( 'reloadGrid' );
        }, '-wizard');
        
    },


    setData: function(data) {

        this.set('changedProperties', { data : {}});

        this.initDefaultValues(data);

    },


    initDefaultValues : function(node) {

        var data = {

            ingressPort : "1",
            
            nwSrc : "9.9.1.1",

            installInHw : "false",

            etherType : '0x800',

            priority : "500",

            nodeId : node.nodeType + "|" + node.nodeId,

            actions: []

        };

        this.set('data', data);

        this.set('changedProperties.data', data);


    }

});