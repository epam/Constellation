App.ApiProvider = Ember.Object.create({

    /**
    * Default container for api call
    */
    container: 'default',

    /**
    * Topology call
    */
    getTopology: function(callback) {
        $.getJSON("/controller/nb/v2/topology/"+this.container, function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(callback);
            this.translateFlowProgrammer.apply(this, args);
        }.bind(this));
    },
    
    /**
    * Translates FlowProgrammer topoly json 
    */
    translateFlowProgrammer: function(callback, jsonData) {
        var nodes = {};
        var nodeIndex = 1;
        var createNode = function(nodes, nodeId, nodeIndex, nodeType) {
        
            var coords = this.getStoredCoords(nodeId);

            if(coords === null) {
                coords = this.logarithmicSpiraCoords(nodeIndex);
            }

            var data = {
                id: nodeId,
                type : nodeType,
                coords: coords
            };

            if(Ember.isNone(nodes[nodeId])) {
                nodes[nodeId] = data;
                return true;
            }

            return false;
        }.bind(this);
        
        jsonData.edgeProperties.forEach(function(value, index) {
            var tailNodeId = value.edge.tailNodeConnector.node.id, 
                tailNodeType = value.edge.tailNodeConnector.node.type;

            var headNodeId = value.edge.headNodeConnector.node.id,
                headNodeType = value.edge.headNodeConnector.node.type;
            
            if(createNode(nodes, tailNodeId, nodeIndex, tailNodeType)) {
                nodeIndex++;
            }
            if(createNode(nodes, headNodeId, nodeIndex, headNodeType)) {
                nodeIndex++;
            }
        }); 
        
        return callback({
            nodes       : nodes,
            connections : jsonData.edgeProperties
        });
    },
    
    /**
    * Generates x,y,z coordinates based on logarithmic spira
    */
    logarithmicSpiraCoords: function(angle) {
        var a = 11;
        var b = 2/angle;
        
        var r = function(t) {
            return a*Math.pow((Math.E), b*t);
        };
        
        var x = function(t) {
            return r(t)*Math.cos(t);
        };
        
        var y = function(t) {
            return r(t)*Math.sin(t);
        };
        
        var z = function(t) {
            return a*t;
        };
        
        return {x: x(angle), y: y(angle), z: z(angle)};
    },
    
    getStoredCoords: function(nodeId) {
        if(!Ember.isNone(localStorage) && !Ember.isNone(localStorage.coords)) {
            var storedCoords = {};
            try {
                storedCoords = JSON.parse(localStorage.coords);
            }catch(e) {
                //ignore this if not json
            }
            if(Ember.isNone(storedCoords[nodeId])) {
                return null;
            }
            return {
                x: storedCoords[nodeId].x,
                y: storedCoords[nodeId].y,
                z: storedCoords[nodeId].z
            };
        }
        return null;
    },
    
    storeNodeCoords: function(nodeId, coords) {
        if(!Ember.isNone(localStorage)) {
            var storedCoords = {};
            if(!Ember.isNone(localStorage.coords)) {
                try{
                    storedCoords = JSON.parse(localStorage.coords);
                } catch(e) {
                    //ignore this if not json
                }
            }
            storedCoords[nodeId] = coords;
            localStorage.coords = JSON.stringify(storedCoords);
        }
    },

    getUrlForFlowsGrid: function(nodeId, nodeType) {
        return "/controller/nb/v2/flowprogrammer/" + this.container + "/node/" + nodeType + "/" + nodeId;
    },

    getFlowConfigByNodeAndFlowName: function(nodeId, nodeType, flowName, callback, context) {
        $.getJSON("/controller/nb/v2/flowprogrammer/" + this.container + "/node/" + nodeType + "/" + nodeId + "/" + flowName, function() {
            var args = Array.prototype.slice.call(arguments);
            callback.apply(context, args);
        }.bind(this));
    },

    getFlowsByNode: function(callback, context, nodeId, nodeType) {
        $.getJSON("/controller/nb/v2/flowprogrammer/" + this.container + "/node/" + nodeType + "/" + nodeId, function() {
            var args = Array.prototype.slice.call(arguments);
            callback.apply(context, args);
        }.bind(this));
    },
     
    getNodeList: function(callback, context) {
        $.getJSON("/controller/nb/v2/switchmanager/" + this.container + "/nodes", function(nodes) {
            var args = Array.prototype.slice.call(arguments);

            callback.apply(context, [nodes.nodeProperties]);
        }.bind(this));
    },

    getNodeById: function(nodeId, callback, context) {
        $.getJSON("/controller/nb/v2/switchmanager/" + this.container + "/nodes", function(nodes) {
            var args = Array.prototype.slice.call(arguments);

            var node = {};
            
            $.each(nodes.nodeProperties, function(index, nodeConfig) {

                if(nodeId === (nodeConfig.node.type + " | " + nodeConfig.node.id)) {
                    
                    node = nodeConfig;

                    return false;
                }

            });

            callback.apply(context, [node]);

        }.bind(this));
    },

    addFLowToNode: function(nodeId, nodeType, flowName, data, callback, errorPanelContext, context) {

        $.ajax({
            url: "controller/nb/v2/flowprogrammer/" + this.container + "/node/" + nodeType + "/" + nodeId + "/staticFlow/" + flowName,
            type: 'PUT',
            data : data,
            errorPanelContext : errorPanelContext,
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                callback.apply(context, [response]);
            }
        });

    },

    installFlow: function(nodeId, nodeType, flowName, callback, context) {
        $.ajax({
            url: "controller/nb/v2/flowprogrammer/" + this.container + "/node/" + nodeType + "/" + nodeId + "/staticFlow/" + flowName,
            type: 'POST',
            success: function(response) {
                callback.apply(context, [response]);
            },
            contentType: "application/json; charset=utf-8"

        });
    },

    deleteFlow: function(nodeId, nodeType, flowName, callback, context) {
        $.ajax({
            url: "controller/nb/v2/flowprogrammer/" + this.container + "/node/" + nodeType + "/" + nodeId + "/staticFlow/" + flowName,
            type: 'DELETE',
            success: function(response) {
                callback.apply(context, [response]);
            },
           contentType: "application/json; charset=utf-8"

        });
    }

    
});