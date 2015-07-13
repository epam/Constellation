App.FlowsWizardView = App.WizardView.extend({

    controller: App.FlowsWizardController.create(),


    didInsertElement: function () {
        this._super();

        var controller = this.get('controller');

        Ember.run.scheduleOnce('afterRender', this, function () {


            App.ApiProvider.getNodeList(function (nodeData) {

                var selectOptions = [];

                $.each(nodeData, function (index, nodeCondfig) {

                    selectOptions.push(nodeCondfig.node.type + '|' + nodeCondfig.node.id);

                });


                $('#node-list-select').kendoDropDownList({

                    dataSource: selectOptions,

                    height: 'auto',

                    change: function (event) {
                        var node = this.value();

                        controller.set('data.nodeId', node);

                        // 		App.ApiProvider.getNodeOptionsById(node, function(options) {
                        // 			var data = [];

                        //  		$.each(options, function(id, name) {
                        //  			data.push( { id : id, name : name } );
                        //  		});

                        //  		var dataSource = new kendo.data.DataSource({
                        // 	data: data
                        // });

                        // var dropdownlist = $('#action-list-select').data('kendoDropDownList');
                        // dropdownlist.setDataSource(dataSource);
                        // 		});
                    }
                });

                var dropdownlist = $('#node-list-select').data("kendoDropDownList");

                dropdownlist.select(function (dataItem) {
                    return dataItem === controller.data.nodeId;
                });

            });

            $('#action-list-select').kendoDropDownList({
                dataTextField: 'name',
                dataValueField: 'id',
                height: 'auto',

                change: function (event) {
                    var action = this.value();

                    var actionItem = this.dataItem();

                    if ('DUMMY_ID_CHOOSE_ONE' !== action && $.inArray(action, controller.get('changedProperties.data.actions')) === -1) {
                        controller.get('changedProperties.data.actions').push(action);

                        $('<div/>', {
                            text: actionItem.name
                        }).appendTo('#selected-actions-list');

                        if (action === 'SET_DL_DST') {
                            $('<input type="text" value="00:00:00:00:00:01" id="SETDLDST-mac-address"/>').appendTo('#selected-actions-list');
                        }
                    }

                },

                dataSource: [
                    {id: 'DUMMY_ID_CHOOSE_ONE', name: 'Choose one'},
                    {id: 'FLOOD_ALL', name: 'Flood All'},
                    {id: 'FLOOD', name: 'Flood'},
                    {id: 'SET_DL_DST', name: 'Set Datalayer Destination Address'}
                ]
            });


        });

    }


});