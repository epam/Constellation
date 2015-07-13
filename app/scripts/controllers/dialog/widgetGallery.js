App.WidgetGalleryController =  Ember.ObjectController.extend({


    availableWidgets : [],

    configuredWidgets : [],

    templateName : "widgetGallery",

    localizeConfig: function(arrayOfWidgets) {

        $.each(arrayOfWidgets, function(index, widget) {
            if(!Ember.isNone(widget)) {
                widget.title_localized = Ember.I18n.translate(widget.title);
                widget.description_localized = Ember.I18n.translate(widget.description);
                widget.documentation_localized = Ember.I18n.translate(widget.documentation);
            }
        });

        return arrayOfWidgets;

    },

    actions : {


        addWidget : function(widgetId) {

            var configuredWidgets =  $.parseJSON(localStorage.getItem("configuredWidgets")),

            availableWidgets = $.parseJSON(localStorage.getItem("availableWidgets")),

            addedWidgets = availableWidgets.filter(function(item, itemIndex, enumerable) {
                return item.information.id === widgetId;
            });

            if(configuredWidgets.contains(addedWidgets[0]) || addedWidgets.length === 0) {
                this.send("deleteWidget", widgetId);
            } else {

                configuredWidgets.push(addedWidgets[0]);

                localStorage.setItem("configuredWidgets", JSON.stringify(configuredWidgets));

                localStorage.setItem("availableWidgets",  JSON.stringify(availableWidgets.without(addedWidgets[0])));
            }
        }, 

        deleteWidget : function(widgetId) {

            var configuredWidgets =  $.parseJSON(localStorage.getItem("configuredWidgets")),

            availableWidgets = $.parseJSON(localStorage.getItem("availableWidgets")),

            deletedWidgets = configuredWidgets.filter(function(item, index, enumerable) {
                return item.information.id === widgetId;
            });

            if(availableWidgets.contains(deletedWidgets[0]) || deletedWidgets.length === 0) {
                this.send("addWidget", widgetId);
            } else {

                availableWidgets.push(deletedWidgets[0]);

                localStorage.setItem("configuredWidgets", JSON.stringify(configuredWidgets.without(deletedWidgets[0])));

                localStorage.setItem("availableWidgets",  JSON.stringify(availableWidgets));
            }

        },

        initModel : function() {

            this.set("availableWidgets", this.localizeConfig($.parseJSON(localStorage.getItem("availableWidgets"))) );

            this.set("configuredWidgets", this.localizeConfig($.parseJSON(localStorage.getItem("configuredWidgets"))) );

        }

    }



});