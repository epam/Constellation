App.PrivacyPolicyController = Ember.Controller.extend(App.BaseModalDialogMixin,{
    title : Ember.I18n.translate('modalPolicyTitle'),
    modalDialogBody : 'dialog/privacyPolicyBody',
    policyText  : Ember.I18n.translate('modalPolicyText'),
    footerVisible: false
});