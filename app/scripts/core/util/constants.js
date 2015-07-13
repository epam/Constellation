App.Constants = {

    /**
     * OpenFlow capabilities enum.
     * @type Object
     */
    ofpCapabilities : {
        FLOW_STATS : {
            label : Ember.I18n.translate('node.capabilities.FLOW_STATS'),
            value : 1 << 0
        },
        TABLE_STATS : {
            label : Ember.I18n.translate('node.capabilities.TABLE_STATS'),
            value : 1 << 1
        },
        PORT_STATS : {
            label : Ember.I18n.translate('node.capabilities.PORT_STATS'),
            value : 1 << 2
        },
        GROUP_STATS : {
            label : Ember.I18n.translate('node.capabilities.GROUP_STATS'),
            value : 1 << 3
        },
        IP_REASM : {
            label : Ember.I18n.translate('node.capabilities.IP_REASM'),
            value : 1 << 5
        },
        QUEUE_STATS : {
            label : Ember.I18n.translate('node.capabilities.QUEUE_STATS'),
            value : 1 << 6
        },
        PORT_BLOCKED : {
            label : Ember.I18n.translate('node.capabilities.PORT_BLOCKED'),
            value : 1 << 8
        }
    }

};

