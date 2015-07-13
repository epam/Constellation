App.TopologyPageNavigationMenuController = App.NavigationMenuController.extend({

    userName : function() {
        
        return localStorage.getItem('userName');

    }.property(),


    logout : function() {

        window.location.href = "/";

        $.get("/logout").then(function(body, status, req) {
           
        }, function(error) {
            
        }.bind(this));
    },

    showProfile : function() {

    },

    actions : {

        logout : function() {
            this.logout();
        },

        menuItemClick : function(action) {
            this._super(action);

            if(action && action.menuItem) {

                App.Logger.log(action.menuItem + " clicked");

            } else if(action && action.menu) {

                switch(action.menu) {

                    case "logout" : 
                        this.logout();
                        break;

                    case "profile" :
                        this.showProfile(); 
                        break;
                }

                App.Logger.log(action.menu + " menu clicked");
            }

            return false;
        }
    }
});