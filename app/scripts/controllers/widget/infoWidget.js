App.InfoWidget = Ember.Object.extend({

});

App.InfoWidgetController = App.BasicWidgetController.extend({

    model : App.InfoWidget.create(),

    isTabActive: true,

    isTabHide: false,

    widgetId: "infoWidget",

    contentMarkup: "widget/infoWidget",

    widgetName:  Ember.I18n.translate("info_camel_case"),

    setNodeName : function() {
        var model = this.get("model");
        var name = model.node.type + " | " + model.node.id;
        this.set("nodeName", name);
    },

        setData : function(_data) {
            // Get capabilities
            var capabilities = [],
                 capName,
                 cap,
                 yes = Ember.I18n.translate('yes'),
                 no = Ember.I18n.translate('no');
            for(capName in App.Constants.ofpCapabilities) {
                cap = App.Constants.ofpCapabilities[capName];
                if((cap.value & _data.properties.capabilities.value) > 0) {
                    capabilities.push(cap.label);
                }
            }
            _data.node.capabilities = capabilities.join(', ');
            // Get Configuration
            // TODO: refactor with OpenFlow 2.0
            var rnd = Math.round(Math.random() * 100);
            _data.configuration = {
                fragment_normal : rnd % 2 === 0 ? yes : no,
                fragment_normal_val : rnd % 2 === 0 ? true : false,
                fragment_drop : rnd % 3 === 0 ? yes : no,
                fragment_drop_val : rnd % 3 === 0 ? true : false,
                fragment_reasemble : rnd % 4 === 0 ? yes : no,
                fragment_reasemble_val : rnd % 4 === 0 ? true : false,
                fragment_mask : rnd % 5 === 0 ? yes : no,
                fragment_mask_val : rnd % 5 === 0 ? true : false
            };

            _data.node.connectedSince = new Date(_data.properties.timeStamp.value).toLocaleString();
            _data.properties.supportedFlowActions.value = _data.properties.supportedFlowActions.value.replace('[', '').replace(']', '');
            this.get("model").setProperties(_data);
            this.setNodeName();
        }

});