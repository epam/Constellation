App.Filter = DS.Model.extend({
  isAdded: DS.attr('boolean'),
  isEnabled: DS.attr('boolean'),
  selectedOperator: DS.attr('string'),
  selectedValue: DS.attr('string'),
  operatorType: DS.belongsTo('operator'),
  valueChoices: DS.belongsTo('filterValue')
});
