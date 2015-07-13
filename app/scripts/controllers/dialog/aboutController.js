App.BaseModalDialogMixin = Ember.Mixin.create({
    modalDialogHeader : 'dialog/defaultDialogHeader',
    modalDialogFooter : 'dialog/defaultDialogFooter',
    footerVisible: true
});
App.AboutController = Ember.Controller.extend(App.BaseModalDialogMixin,{
    modalDialogBody : 'dialog/aboutBody',
    title : Ember.I18n.translate('modalAbout.title'),
    headquatersTitle : Ember.I18n.translate('modalAbout.headquaters'),
    headquatersText : Ember.I18n.translate('modalAbout.address'),
    phoneFaxText : Ember.I18n.translate('modalAbout.phoneFax'),
    versionTitle: Ember.I18n.translate('modalAbout.versionTitle').split(';'),
    versionText: Ember.I18n.translate('modalAbout.version').split(';'),
    owners: Ember.I18n.translate('contributors.owners').split(';'),
    developers: Ember.I18n.translate('contributors.developers').split(';'),
    footerVisible: false
});