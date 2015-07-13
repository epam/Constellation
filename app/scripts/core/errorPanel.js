if (typeof ErrorPanel === "undefined") {
    ErrorPanel = {

        index : 0,

        context : '',

        show : function(jqxhr, message) {
            if ($('#notification-bar').length) {

                var notificationBar = $('#notification-bar' + this.context);

                $("<div id='error-message-" + this.index++ + "'></div>").appendTo(notificationBar);

                var currentIndex = (this.index - 1), localizedMessage =  "";

                if( jqxhr.responseText && jqxhr.status !== 500 && jqxhr.status !== 401) {
                    localizedMessage = " : " + jqxhr.responseText;
                }

                $("<p>" + message + localizedMessage + "</p>").appendTo('#error-message-' + currentIndex);

                $('<a id="close-panel-button-' + currentIndex + '" class="error-btn-close" ' +
                    'href="#">×</a>').appendTo('#error-message-' + currentIndex);

                notificationBar.show(1, function() {
                    if(jqxhr.status && (jqxhr.status === 500 || jqxhr.status === 401)) {
                        window.location.href = "/";
                    }
                });

                $('#close-panel-button-' + currentIndex).click(function(event) {
                    event.preventDefault();
                    $('#error-message-' + currentIndex ).remove();
                });

            }
        }
    };
}