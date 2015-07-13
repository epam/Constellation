App.NavigationMenuController = Ember.ObjectController.extend({

    getSelectedThemeIndex : function() {
        var themeIndex = localStorage.getItem("selected-theme") || 0;
        return parseInt(themeIndex, 10);
    },

    getSelectedLanguageIndex : function() {
        var langPrefix = localStorage.getItem("selected-lang") || 0;
        return parseInt(langPrefix, 10);
    },

    changeLocale : function(locale, index) {
        Em.I18n.locale = locale;
        CLDR.defaultLocale = locale;
        localStorage.setItem("Em.I18n.locale", Em.I18n.locale);
        localStorage.setItem("selected-lang", index);

        App.Logger.log("locale changed to  " + locale);
        window.location.reload();
    },

    changeTheme : function(theme, index) {
        var skinSelector = App.SkinSelectorController.create();
        skinSelector.changeThemeTo(theme);
        localStorage.setItem("selected-theme", index);
        this.init();
    },

    actions : {

        menuItemClick : function(action) {
            if(action && action.menuItem) {
                
                switch(action.menuItem) {

                    case "change-theme-dark" : 
                        this.changeTheme("dark", 0);
                        break;

                    case "change-theme-light" :
                        this.changeTheme("light", 1); 
                        break;

                    case "change-lang-ru" :
                        this.changeLocale("ru", 1);
                        break;

                    case "change-lang-en" :
                        this.changeLocale("en", 0);
                        break;
                }

                App.Logger.log(action.menuItem + " clicked");

            } else if(action && action.menu) {
                App.Logger.log(action.menu + " menu clicked");
            }

        }
    }
});