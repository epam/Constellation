App.LoginFormView = Ember.View.extend({

    didInsertElement: function () {
        Ember.run.scheduleOnce("afterRender", this, function () {

            $(document).ready(function () {
                if (localStorage.getItem('userId')) {
                    $('#username').val(localStorage.getItem('userId'));
                }

            });
        });
    }

});