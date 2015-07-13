App.EditorView = Ember.View.extend({

    templateName: 'dialog/basicEditor',

    controller: App.EditorController.create(),

    didInsertElement: function () {
        var view = this;
        this.get('controller').on('close', this, this.closeEditor);

        Ember.run.scheduleOnce("afterRender", this, function () {

            $(document).ready(function () {

                $("#editor-tabs").kendoTabStrip({
                    animation: false
                });

                view.addMask();
            });
        });

    },

    addMask: function () {
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        $('#editor-mask').css({
            'width': maskWidth,
            'height': maskHeight
        });

        $('#editor-mask').fadeTo("slow", 0.2);
    },

    hideMask: function () {
        $('#editor-mask').hide();
    },

    closeEditor: function () {
        this.destroy();
        this.hideMask();
    },

    actions: {

        cancel: function () {
            this.closeEditor();
        }

    }

});










