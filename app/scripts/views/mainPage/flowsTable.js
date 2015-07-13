App.FlowsTableView = App.GridView.extend({

    classNames: ["flows-table"],

    templateName: "mainPage/flowsTable",

    controller: App.FlowsTableController.create(),

    reloadGrid: function (name) {
        var controller = this.get("controller");

        var parts = name.split(" | ");

        controller.set("nodeId", parts[1]);
        controller.set("nodeType", parts[0]);

        var grid = $("#flows_list");

        grid.setGridParam({url: App.ApiProvider.getUrlForFlowsGrid(controller.nodeId, controller.nodeType), page: 1});

        grid.trigger('reloadGrid');

    },

    checkNodeId: function () {
        var controller = this.get("controller");

        var nodeName = localStorage.getItem("nodeName");

        if (!nodeName) {
            nodeName = "OF | 00:00:00:00:00:00:00:01";
        }

        var nameParts = nodeName.split(" | ");
        controller.set("nodeId", nameParts[1]);
        controller.set("nodeType", nameParts[0]);
    },

    willDestroyElement: function () {
        App.EventManager.flowsEventManager.off('flowsNodeChanged', this, this.reloadGrid);
    },

    didInsertElement: function () {

        App.EventManager.flowsEventManager.on('flowsNodeChanged', this, this.reloadGrid);

        this.checkNodeId();

        var controller = this.get("controller");

        Ember.run.scheduleOnce("afterRender", this, function () {

            $(document).ready(function () {

                var grid = $("#flows_list"), tableContainer = $(".page.flows"), pagingBar = $("#paging");

                grid.on('reloadGrid', function () {
                    $('#edit_button_flows_list').addClass('ui-state-disabled');
                    $('#delete_button_flows_list').addClass('ui-state-disabled');
                    $('#install_button_flows_list').addClass('ui-state-disabled');
                });

                grid.jqGrid({
                    datatype: "json",
                    url: App.ApiProvider.getUrlForFlowsGrid(controller.nodeId, controller.nodeType),
                    autowidth: true,
                    rowNum: 10,
                    height: '100%',
                    mtype: "GET",
                    colNames: [Ember.I18n.translate("nodeText"), Ember.I18n.translate("tableIdText"), Ember.I18n.translate("nameText"), Ember.I18n.translate("installedText"), Ember.I18n.translate("actionText")],
                    colModel: [
                        {
                            name: 'node',
                            index: 'node',
                            sortable: false,
                            align: 'center',
                            width: '40%',
                            formatter: nodeFormatter
                        },
                        {
                            name: 'tableId',
                            index: 'tableId',
                            sortable: false,
                            align: 'center',
                            width: '20%',
                            formatter: tableIdFormatter
                        },
                        {name: 'name', index: 'name', sortable: true, align: 'center', width: '40%'},
                        {
                            name: 'installInHw',
                            index: 'installInHw',
                            sortable: true,
                            align: 'center',
                            width: '20%',
                            formatter: installedFormatter
                        },
                        {name: 'actions', index: 'actions', sortable: true, align: 'left', formatter: actionsFormatter}
                    ],
                    rowattr: function (rd) {
                        if (rd.installInHw === "true") {
                            return {"class": "installed-flow-row"};
                        }
                    },
                    pager: "#paging",
                    multiselect: true,
                    viewrecords: true,
                    caption: "",
                    beforeSelectRow: function (rowid) {

                        $('#edit_button_flows_list').removeClass('ui-state-disabled');
                        $('#delete_button_flows_list').removeClass('ui-state-disabled');
                        $('#install_button_flows_list').removeClass('ui-state-disabled');

                        return true; // allow selection or unselection
                    },

                    onSelectRow: function () {

                        var rows = grid.jqGrid('getGridParam', 'selarrrow');

                        if (rows.length === 0) {
                            $('#delete_button_flows_list').addClass('ui-state-disabled');
                            $('#edit_button_flows_list').addClass('ui-state-disabled');
                            $('#install_button_flows_list').addClass('ui-state-disabled');
                        }

                        if (rows.length > 1) {
                            $('#edit_button_flows_list').addClass('ui-state-disabled');
                            $('#install_button_flows_list').addClass('ui-state-disabled');
                            $('#delete_button_flows_list').addClass('ui-state-disabled');
                        } else if (rows.length === 1) {
                            var selectedRow = grid.getGridParam('userData')[rows[0] - 1];

                            var text = Ember.I18n.translate("installText");

                            if (selectedRow && selectedRow.installInHw === 'true') {
                                text = Ember.I18n.translate("uninstallText");
                            }

                            $('#install_button_flows_list > .ui-pg-div').html('<span class="ui-icon ui-icon-newwin"></span>' + text);
                        }
                    },

                    jsonReader: {
                        root: "flowConfig",
                        userdata: "flowConfig"
                    }
                });


                function tableIdFormatter(cellvalue, options, rowObject) {
                    return 0;
                }

                function nodeFormatter(cellvalue, options, rowObject) {

                    if (rowObject.node) {
                        return rowObject.node.type + "|" + rowObject.node.id;
                    }

                    return "";
                }

                function installedFormatter(cellvalue, options, rowObject) {
                    if (rowObject.installInHw === "true") {
                        return Ember.I18n.translate("yes");
                    }
                    return Ember.I18n.translate("no");
                }

                function actionsFormatter(cellvalue, options, rowObject) {
                    if (rowObject && rowObject.actions) {
                        return rowObject.actions.join();
                    }

                    return "";

                }


                grid.jqGrid('navGrid', '#paging', {
                        del: false,
                        add: false,
                        edit: false,
                        search: false,
                        refresh: false
                    }, {}, {}, {},
                    {
                        multipleSearch: true,
                        beforeShowForm: function (form) {
                            var dlgDiv = $("#searchmod" + grid[0].id);
                            var parentDiv = dlgDiv.parent(); // div#gbox_list
                            var dlgWidth = dlgDiv.width();
                            var parentWidth = parentDiv.width();
                            var dlgHeight = dlgDiv.height();
                            var parentHeight = parentDiv.height();
                            dlgDiv[0].style.top = Math.round((parentHeight - dlgHeight) / 2) + "px";
                            dlgDiv[0].style.left = Math.round((parentWidth - dlgWidth) / 2) + "px";
                        }
                    });

                grid.jqGrid('navGrid', "#paging").jqGrid('navButtonAdd', "#paging",
                    {
                        caption: Ember.I18n.translate("addText"),

                        id: 'add_button_flows_list',

                        onClickButton: function () {

                            var flowsWizard = App.__container__.lookup('view:flowsWizard');
                            flowsWizard.get('controller').send('loadData',
                                {
                                    nodeId: controller.get("nodeId"),
                                    nodeType: controller.get("nodeType")
                                });
                            flowsWizard.append();
                        },

                        position: "last",
                        cursor: "pointer"
                    });

                grid.jqGrid('navGrid', "#paging").jqGrid('navButtonAdd', "#paging",
                    {
                        caption: Ember.I18n.translate("view_camel_case"),

                        id: 'edit_button_flows_list',

                        onClickButton: function () {

                            var rowId = grid.getGridParam('selrow'),
                                selectedRow = grid.getGridParam('userData')[rowId - 1];

                            if (selectedRow) {
                                var flowsEditor = App.__container__.lookup('view:flowsEditor');
                                flowsEditor.append();
                                flowsEditor.get('controller').send('loadData', selectedRow);
                            }
                        },

                        position: "last",
                        cursor: "pointer"
                    });

                grid.jqGrid('navGrid', "#paging").jqGrid('navButtonAdd', "#paging",
                    {
                        caption: Ember.I18n.translate("deleteText"),
                        id: 'delete_button_flows_list',
                        position: "last",
                        cursor: "pointer",

                        onClickButton: function () {
                            var rowId = grid.getGridParam('selrow'),
                                selectedRow = grid.getGridParam('userData')[rowId - 1];
                            App.ApiProvider.deleteFlow(controller.nodeId, controller.nodeType, selectedRow.name, function () {
                                $("#flows_list").trigger('reloadGrid');
                            });
                        },
                    });

                grid.jqGrid('navGrid', "#paging").jqGrid('navButtonAdd', "#paging",
                    {
                        caption: Ember.I18n.translate("installText"),

                        id: 'install_button_flows_list',

                        onClickButton: function () {
                            var rowId = grid.getGridParam('selrow'),
                                selectedRow = grid.getGridParam('userData')[rowId - 1];
                            App.ApiProvider.installFlow(controller.nodeId, controller.nodeType, selectedRow.name, function () {
                                $("#flows_list").trigger('reloadGrid');
                            });
                        },

                        position: "last",
                        cursor: "pointer"
                    });

                $('#edit_button_flows_list').addClass('ui-state-disabled');

                $('#delete_button_flows_list').addClass('ui-state-disabled');

                $('#install_button_flows_list').addClass('ui-state-disabled');

                $('td.ui-pg-button.ui-state-disabled > span.ui-separator').parent().remove();


                var headerHeight = 2 * 20 + 30 + 10; // paging bar + header + node selector + additional margin

                var height = tableContainer.height() - pagingBar.height() - headerHeight;
                grid.jqGrid('setGridHeight', height);

                $(window).on("resize", function () {
                    grid.jqGrid('setGridHeight', tableContainer.height() - pagingBar.height() - headerHeight);

                    var width = $(".flows-table").width();

                    grid.jqGrid('setGridWidth', width);
                    $('.ui-jqgrid-htable').width(width);
                });

            });
        });
    }

});

