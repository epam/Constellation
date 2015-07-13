$.ajaxSetup({

    beforeSend: function() {
        $('#loader').show();
    },

    complete: function() {
        // $('#loader').hide();
    }

});

$( document ).ajaxStop(function() {
    $('#loader').hide();
});

$( document ).ajaxSend(function( event, jqxhr, settings ) {
    App.Logger.log("request settings: params = '" + settings.data +"', type = " + settings.type +
        ", url = " + settings.url); 
});

$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {

    if(settings.url ==="/login" && jqxhr.status === 500 && 
        !Ember.none($.parseJSON(jqxhr.responseText)) && $.parseJSON(jqxhr.responseText).status === "fail") {
        $(".login-error").show();
    }

    if(ErrorPanel) {
        ErrorPanel.context = settings.errorPanelContext ? settings.errorPanelContext : '';
        ErrorPanel.show(jqxhr, thrownError);
    }
    
    App.Logger.log(thrownError);
});