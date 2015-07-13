App.WidgetGalleryView = Ember.View.extend({

    templateName: "dialog/widgetGallery",

    classNames: ["widget-gallery", "modal"],

    controller: App.WidgetGalleryController.create(),


    didInsertElement: function () {
        Ember.run.scheduleOnce("afterRender", this, function () {
            $(".jcarousel").jcarousel({
                items: ".widget-template"
            });

            App.Util.initCarouselNavigation();

            var clickHandler = function (event) {
                event.preventDefault();

                $(this).toggleClass('action-button-add');
                $(this).toggleClass('action-button-delete');

                var button = $(this).children('.action-button').children('a');

                button.text(function () {

                    if (button.text() === Ember.I18n.translate('deleteText')) {
                        return Ember.I18n.translate('addText');
                    } else {
                        return Ember.I18n.translate('deleteText');
                    }

                });

            };

            $(".action-button-add").on("click", clickHandler);
            $(".action-button-delete").on("click", clickHandler);

        });

    },


    willInsertElement: function () {

    }


});