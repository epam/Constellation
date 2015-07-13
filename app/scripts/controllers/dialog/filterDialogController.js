App.FilterDialogController = Ember.ArrayController.extend(App.BaseModalDialogMixin,{
  
    title : Ember.I18n.translate('filterDialogTitle'),
    modalDialogBody : 'dialog/filterDialogBody',
    modalDialogFooter : 'dialog/filterDialogFooter',
    itemController: 'filterItem',
    filterNamePrompt: Ember.I18n.translate("filterNameSelectPrompt"), 
    filterOperatorPrompt: Ember.I18n.translate("filterOperatorSelectPrompt"),
    filterValuePrompt: Ember.I18n.translate("filterValueSelectPrompt"),
    content: null,
    filterSetName: null,

    init: function() {
        var self = this;
        var store = this.store;
        var filterValueRecord = store.createRecord('filterValue', {
            id: 'action',
            items: ['Pass', 'Drop']
        });

        var filterValuePromise = filterValueRecord.save();
        var operatorRecord = store.createRecord('operator', {
            id: 'enum',
            items: ['equals', 'does not equals']  
        });

        var operatorPromise = operatorRecord.save();
        var operatorStringRecord = store.createRecord('operator', {
            id: 'string',
            items: ['equals', 'does not equals', 'starts with', 'ends with']  
        });

        var operatorStringRecordPromise = operatorStringRecord.save();
        Ember.RSVP.all([ filterValuePromise, operatorPromise, operatorStringRecordPromise ]).then(function(items) {
        var enumFilter = store.createRecord('filter', {
            id: 'Action',
            isAdded: true, 
            isEnabled: true,
            selectedOperator: 'equals', 
            selectedValue: 'Pass', 
            operatorType: items[1],
            valueChoices: items[0]
        });

        var enumFilterPromise = enumFilter.save();

        var stringFilter = store.createRecord('filter', {
            id: 'Name',
            isAdded: true, 
            isEnabled: true, 
            selectedOperator: 'starts with', 
            selectedValue: null, 
            operatorType: items[2],
            valueChoices: items[0]
        });

        var stringFilterPromise = stringFilter.save();
        Ember.RSVP.all([ enumFilterPromise, stringFilterPromise ]).then(function(items) {
            self.set('content', store.find('filter', { isAdded: true }));
            self.set('filterNames', items.mapBy('id'));
        });
    });

        this._super(); 
    },
    
    actions: {
        add: function() { 
        // var store = this.store;  
        // var promise = store.find('filter', 'Name'); 
        // promise.then(function(filter) {
        //   filter.set('isAdded', true);
        //   filter.save();
        // });
        }
    }

});
