
App.GridPagingMixin = Ember.Mixin.create({

    pagesCountProperty : 'pages',

    pageNumberProperty : 'currentPage',

    pageNumber : 1,

    pagesCount : 1,

    currentPage : 1,

    rowCount : 10,

    hasNextPage : false,

    hasPreviousPage : false,

    didRowsChanged : function() {

        this.set('hasNextPage', this.get('pageNumber') + 1 <= this.get('pagesCount'));
        this.set('hasPreviousPage', this.get('pageNumber') - 1 > 0 );

    }.observes('rows', 'pagesCount', 'pageNumber')

});

App.Grid = Ember.ArrayController.extend(App.GridPagingMixin, {

    // json root property
    root : '',

    rows: [],

    columns : [],

    toolbar : {},

    columnConfigVisible : false,

    selectAll: function(key, value) {

        if (!Ember.isNone(value) && this.rows) {
            this.rows.setEach('isSelected', value);
            return value;
        } else {
            return this.rows && this.rows.isEvery('isSelected', true);
        }

    }.property('rows.@each.isSelected'),

    isMultiselect : true,

    getData : function(properties, callback) {

    },

    actions : {

        loadData : function(properties) {
            var controller = this;

            this.getData(properties, function(json, textStatus) {
                controller.set('rows', json[controller.root]);
                controller.set('pagesCount', json[controller.pagesCountProperty] ? 
                    json[controller.pagesCountProperty]  : 1);
                controller.set('pageNumber', json[controller.pageNumberProperty] ? 
                    json[controller.pageNumberProperty]  : 1);
            });

        },

        toolbarButtonClicked : function(action) {

            var selectedRows = this.get('rows').filter(function(row) {
                return row.isSelected;
            });

            var controller = this;

            this.get('toolbar').buttons.forEach(function(button,index) {
                
                if(button.action === action) {
                    button.handler(selectedRows, controller);
                    return false;
                }

            });

        },

        sort : function(columnProperty, isSortable) {
            if(isSortable) {
                var columns = this.get('columns');

                var controller = this;

                columns.forEach(function(column, index) {

                    if(column.isSortable && column.property === columnProperty) {
                        column.sort(controller);
                        return false;
                    } else {
                        column.sort(controller, 'NONE');
                    }

                });
            }
        },

        changePage : function(action, pageNumber) {
            var pageToSet = pageNumber;

            switch(action) {

                case 'next_page' :
                    if(this.get('hasNextPage')) {
                        pageToSet = this.get('currentPage') + 1;
                    }

                    break;

                case 'last_page' :
                    if(this.get('hasNextPage')) {
                        pageToSet = this.get('pagesCount');
                    }

                    break;

                case 'previous_page' :
                    if(this.get('hasPreviousPage')) {
                        pageToSet = this.get('currentPage') - 1;
                    }

                    break;

                case 'first_page':
                    if(this.get('hasPreviousPage')) {
                        pageToSet = 1;
                    }

                    break;

            }

            App.Logger.log('action: ' + action + ' pagging button clicked ');

            App.Logger.log('pageToSet: ' + pageToSet ); 

            if(!Ember.isNone(pageToSet)) {
                this.set('pageNumber', pageToSet);
                this.send('loadData', { paging : {page : pageToSet}});
            }

        },

        rowSelected : function(index) {
            
        },

        toggleColumnConfig : function() {
            this.toggleProperty('columnConfigVisible');
        }

    }


});

App.Grid.ToolbarButton = Ember.Object.extend({

    title : Ember.I18n.translate("button_camel_case"),

    action : "test",

    handler : function(selectedRows, controller) {
        App.Logger.log('action: ' + this.action + ' selected row: '); 
        App.Logger.log(selectedRows);

        controller.send("loadData");
    }

});

App.Grid.Column = Ember.Object.extend({

    property: null,

    sortingOrder: 'NONE',

    sortingClass : 'sorting-none',

    didSortingChanged : function() {

        var sortClass = 'sorting-none';

        switch(this.get('sortingOrder')) {
            case 'NONE': sortClass = 'sorting-none'; break;
            case 'DESC': sortClass = 'sorting-desc'; break;
            case 'ASC' : sortClass = 'sorting-asc'; break;
        }

        App.Logger.log('sortClass: ' + sortClass ); 

        this.set('sortingClass', sortClass);

    }.observes('sortingOrder'),

    isSortable : false,

    header: function () {

        if (!this.get('property')) {
            return '';
        }
        
        return this.get('property').capitalize();

    }.property('property'),

    display: true,

    format : function(value) {

        if(Ember.typeOf(value) === 'array') {
            return value.join(',');
        }

        return value;
    },

    visible: function () {
        return this.get('display') !== false;
    }.property('display'),

    sort : function(controller, mode) {

        if(mode) {
            this.set('sortingOrder', mode);
        } else {
            var order;
        
            switch(this.get('sortingOrder')) {
                case 'NONE':
                case 'DESC': order = 'ASC'; break;
                case 'ASC' : order = 'DESC'; break;
            }

            App.Logger.log('sortingOrder: ' + order );

            this.set('sortingOrder', order);

            controller.send('loadData', { sort : {column: this.property, order: order} });
        }

    }

});

Ember.Handlebars.helper('gridCell', function(object, column) {
    var properties = column.property.split('.');

    var innerObject = object;

    for(var i = 0; i < properties.length; i++) {
        innerObject = innerObject[properties[i]];
    }

    return column.format(innerObject);
});
