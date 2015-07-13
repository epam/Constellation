App.NavigationMenuView = Ember.View.extend({

    templateName: "navigationMenu/navigationMenu",

    tagName: "span",

    classNames: ["navigation-link"],

    controller: App.NavigationMenuController.create(),


    didInsertElement: function () {
        var controller = this.get("controller");

        Ember.run.scheduleOnce("afterRender", this, function () {

            $(document).ready(function () {

                var langData = [
                    {name: Ember.I18n.translate("english_menu"), action: "change-lang-en"},
                    {name: Ember.I18n.translate("russian_menu"), action: "change-lang-ru"}
                ];

                var menuConfig = {
                    dataTextField: "name",
                    dataValueField: "action",
                    animation: false,
                    dataSource: langData,
                    index: controller.getSelectedLanguageIndex(),
                    change: function (event) {
                        controller.send("menuItemClick", {menuItem: event.sender.value()});
                    }
                };

                $(".navigation-menu .select-lang").kendoDropDownList(menuConfig);


                var themesData = [
                    {name: Ember.I18n.translate("dark_theme_menu"), action: "change-theme-dark"},
                    {name: Ember.I18n.translate("light_theme_menu"), action: "change-theme-light"}
                ];

                menuConfig.dataSource = themesData;

                menuConfig.index = controller.getSelectedThemeIndex();

                $(".navigation-menu .select-theme").kendoDropDownList(menuConfig);
            });

        });


    }

});
