App.Logger = {
    info: function(){
        if(Log.Config.CUSTOM_LOGGER_LEVEL === 'DEVELOPMENT'){
            Ember.Logger.info.apply(this, arguments);
        }
    },
    
    log: function(){
        if(Log.Config.CUSTOM_LOGGER_LEVEL === 'DEVELOPMENT'){
            Ember.Logger.log.apply(this, arguments);
        }
    },

    warn: function(){
        if(Log.Config.CUSTOM_LOGGER_LEVEL === 'DEVELOPMENT'){
            Ember.Logger.warn.apply(this, arguments);
        }
    },

    error: function(){
        if(Log.Config.USTOM_LOGGER_LEVEL === 'DEVELOPMENT'){
            Ember.Logger.error.apply(this, arguments);
        }
    },

    debug: function(){
        if(Log.Config.CUSTOM_LOGGER_LEVEL === 'DEVELOPMENT'){
            Ember.Logger.debug.apply(this, arguments);
        }
    }
};