Ember.Handlebars.registerHelper('i18n', function (property, options) {
    var params = options.hash,
        self = this;

    // Support variable interpolation for our string
    Object.keys(params).forEach(function (key) {
        params[key] = Em.Handlebars.get(self, params[key], options);
    });


    return Em.I18n.t(Em.I18n.locale + '.' + property, params);
});

Ember.Handlebars.registerHelper('year', function () {
    return new Date().getFullYear();
});

Ember.I18n.translate = function (property, options) {

    var params = options ? options.hash : {};

    return Em.I18n.t(Em.I18n.locale + '.' + property, params);
};

Em.I18n.locale = localStorage.getItem('Em.I18n.locale') || 'en';

CLDR.defaultLocale = localStorage.getItem('Em.I18n.locale') || 'en';