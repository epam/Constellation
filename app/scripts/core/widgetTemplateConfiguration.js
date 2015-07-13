
var availableWidgets = [

    {

            description : "infoWidgetDescription",
            documentation : "infoWidgetDocumentation",
            title : "infoWidgetTitle",
            image : "themes/main/images/widget-node-info.png",
            information : {
                id : "infoWidget"
            }

    }, {

            description : "nodeWidgetDescription",
            documentation : "nodeWidgetDocumentation",
            title : "nodeWidgetTitle",
            image : "themes/main/images/widget-nodes.png",
            information : {
                id : "nodesWidget"
            }

    }, {

        description : "legendWidgetDescription",
        documentation : "legendWidgetDocumentation",
        title : "legendWidgetTitle",
        image : "themes/main/images/widget-legend.png",
        rightSide : true,
        information : {
                id : "legendWidget"
        }

    }
];

if(! $.parseJSON(localStorage.getItem("configuredWidgets")) ) {
    localStorage.setItem("availableWidgets", JSON.stringify(availableWidgets));
    localStorage.setItem("configuredWidgets", JSON.stringify([]));
}

