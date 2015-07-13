App.FilterItemController = Ember.ObjectController.extend({
    selectedFilterName: null,
    isEnumValue: function() {
        return this.get('operatorType.name') === 'enum';
    }.property('model.operatorType.name'),

    actions: {
        toggleFilterState: function() {
            var isFilterEnabled = this.get('isEnabled');
            if(!Ember.isNone(isFilterEnabled)){
                this.set('isEnabled', !isFilterEnabled);
            }
        },

        delete: function() {

        }
    }
});