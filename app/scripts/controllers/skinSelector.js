App.SkinSelectorController = Ember.ObjectController.extend({
   
    changeThemeTo: function (action) {

        switch(action.toLowerCase()) {
            case "light" : this.applyCssSkin("themes/light/main.css"); 
                break;
            case "dark" : this.applyCssSkin("themes/main/main.css");
                break;
        }
    },

    applyCssSkin: function(cssLinkValue) {

        if(typeof(Storage) === "undefined") {
            return;
        }

        var storedCssLink = localStorage.getItem("user-defined-skin");

        if(!storedCssLink) {
            localStorage.setItem("user-defined-skin", "themes/main/main.css");
        }

        var skinRefference = cssLinkValue || localStorage.getItem("user-defined-skin");

        localStorage.setItem("user-defined-skin", skinRefference);

        var cssLink = $("#css-skin");

        if(cssLink.length === 0) {
            cssLink = $("<link id='css-skin' rel='stylesheet'>");
            $("head").append(cssLink);
        }

        cssLink.attr("href", skinRefference);
    }
});