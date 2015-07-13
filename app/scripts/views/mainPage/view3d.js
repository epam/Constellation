/**
 * @type Ember.Mixin
 * Mixin which allow to handle window.resize event (resize, schange scale)
 */
App.WindowResizeMixin = Ember.Mixin.create({

    /**
     * Attach resize event listener on window
     */
    bindWindowResize: function () {
        var that = this;

        var onResizeHandler = function () {
            that.onWindowResize();
        };

        this.set('onResizeHandler', onResizeHandler);
        $(window).bind('resize', this.get('onResizeHandler'));
    },

    /**
     * Detach resize event listener on window
     */
    unbindWindowResize: function () {
        $(window).unbind('resize', this.get('onResizeHandler'));
    },

    /**
     * Resize event handler
     */
    onWindowResize: function () {

    }
});

/**
 * Threejs geometry loade manager
 */
App.TheejsLoadManager = Ember.Object.extend({

    loadedGeometries: {},
    loadedGeometriesCount: 0,
    expectedCount: 0,
    urls: 0,
    callback: null,
    context: null,

    /**
     * Init method
     * @param arrayOfUrl
     * @param callback
     * @param context
     */
    init: function (arrayOfUrl, callback, context) {
        this._chekArguments(arrayOfUrl, callback, context);

        this.callback = callback;
        this.context = context;
        this.urls = arrayOfUrl;

        this.expectedCount = arrayOfUrl.length;
    },

    /**
     * Loads geometries for given arrayOfUrl, and call callback after all geometries loaded
     */
    load: function () {
        this.urls.forEach(function (url) {
            var loader = new THREE.JSONLoader();
            loader.load(url, function (geometry) {
                this._onGeometryLoadComplete(url, geometry);
            }.bind(this));
        }, this);
    },

    /*
     * Check if agruments are correct
     * @param arrayOfUrl
     * @param callback
     * @param context
     */
    _chekArguments: function (arrayOfUrl, callback, context) {
        if (!Ember.isArray(arrayOfUrl)) {
            throw '@arrayOfUrl should be an array';
        }
        if (typeof callback !== 'function') {
            throw '@callback should be a function';
        }
        if (Ember.isNone(context)) {
            throw '@context can\'t be empty';
        }
    },

    /**
     * Handler for THREE.JSONLoader.load event
     * @params url
     * @param geometry
     */
    _onGeometryLoadComplete: function (url, geometry) {
        this.loadedGeometriesCount++;
        this.loadedGeometries[url] = geometry;
        if (this.loadedGeometriesCount === this.expectedCount) {
            this._onAllGeometiesLoaded();
        }
    },

    /**
     * This function will be executed after all data loaded
     */
    _onAllGeometiesLoaded: function () {
        var geometriesArray = [];
        this.urls.forEach(function (url) {
            geometriesArray.push(this.loadedGeometries[url]);
        }, this);
        this.callback.apply(this.context, [geometriesArray]);
    }
});
/**
 *
 * @type Ember.View
 * ThreeJs view to display network nodes in 3d view
 */
App.View3dView = Ember.View.extend(App.WindowResizeMixin, {

    classNames: ['topology-3d'],
    controller: Ember.Controller.create(),
    nodes: [],
    lastSelectedNode: {},
    nodeLabelOffset: {x: 0, y: -12, z: 0},
    nodeColor: 0x5555aa,
    selectedNodeColor: 0x55cc55,
    nodeArrowsColor: 0xffffff,
    nodeLinkColor: 0xffffff,
    connectedNodeColor: 0x99ffff,
    lightColor: 0xdddddd,
    nodeConnections: {},
    cameraFov: 45,
    nodeLookUpVectorMultiplier: 10,
    nodeLines: {},
    dragPlaneWidth: 6000,
    dragPlaneHeight: 6000,
    dragPlaneSelectedScale: 1 / 300,
    cameraNear: 1,
    cameraFar: 3000,
    cameraControlsMinDistance: 10,
    cameraControlsMaxDistance: 1000,
    eventConfig: null,
    fogEnabled: false,

    /**
     *
     * @returns canvas container
     */
    getContainer: function () {
        return $(this.get('element'));
    },

    /**
     * @returns canvas container width
     */
    getContainerWidth: function () {
        if (this.get('containerWidth') === undefined) {
            this.set('containerWidth', this.getContainer().width());
        }
        return this.get('containerWidth');
    },

    /**
     * @returns canvas container height
     */
    getContainerHeigth: function () {
        if (this.get('containerHeight') === undefined) {
            this.set('containerHeight', this.getContainer().height());
        }
        return this.get('containerHeight');
    },

    /**
     * @returns canvas container left position in pixels
     */
    getContainerLeft: function () {
        if (this.get('containerLeft') === undefined) {
            this.set('containerLeft', this.getContainerPosiotion().left);
        }
        return this.get('containerLeft');
    },

    /**
     * @returns canvas container top position in pixels
     */
    getContainerTop: function () {
        if (this.get('containerTop') === undefined) {
            this.set('containerTop', this.getContainerPosiotion().top);
        }
        return this.get('containerTop');
    },

    /**
     * Return container position
     */
    getContainerPosiotion: function () {
        return this.getContainer().offset();
    },

    /**
     * Inits ThreeJs scene and mouse events
     */
    didInsertElement: function () {
        this._super();
        this.bindWindowResize();
        this.initTheeJsRenderer();
        this.initTheeJsMouseEvents();
        this.initThreeTrackBallControls();
        this.animateScene();
        this.loadGeometries(this.loadNodeData);
        this.addNodeDataListener();
        this.eventConfig = this.fillEventConfig();
    },


    addNodeDataListener: function () {
        App.EventManager.view3dEventManager.on('widgetSelectedNode', this, this.widgetSelectedNodeListener);
    },

    removeNodeDataListener: function () {
        App.EventManager.view3dEventManager.off('widgetSelectedNode', this, this.widgetSelectedNodeListener);
    },

    widgetSelectedNodeListener: function (name) {
        var scene = this.get("scene");

        var nodes = scene.children.filter(function (node) {
            return node.name === name;
        });

        if (nodes.length) {
            this.selectNode(nodes[0]);
            App.EventManager.view3dEventManager.sendNodeData(nodes[0].name);
        }
    },

    selectNode: function (node) {
        if (node) {
            var previousNode = this.get("lastSelectedNode");

            if (!Ember.isNone(previousNode) && previousNode.objectType === this.getNodeType()) {
                this.resetNodeStyling(previousNode);
            }

            this.applySelectedNodeStyles(node);

            this.set("lastSelectedNode", node);
        }
    },

    /**
     * Reset node styling to unselected
     */
    resetNodeStyling: function (node) {
        this.applyNodeStyles(node, this.nodeColor, this.nodeColor);
    },

    /**
     * Adds some styling for selected node
     * @param node
     */
    applySelectedNodeStyles: function (node) {
        this.applyNodeStyles(node, this.selectedNodeColor, this.connectedNodeColor);
    },

    /**
     * Applies node styles
     * @param node
     * @param nodeColor
     * @param connectedNodeColor
     */
    applyNodeStyles: function (node, nodeColor, connectedNodeColor) {
        var scene = this.get("scene");
        node.material.color.setHex(nodeColor);
        var connectedNodes = this.getNodeConnections(node.name);
        if (connectedNodes) {
            connectedNodes.forEach(function (nodeName) {
                var connectedNode = scene.getObjectByName(nodeName);
                connectedNode.material.color.setHex(connectedNodeColor);
            }, this);
        }
    },

    /**
     * Load geometries
     */
    loadGeometries: function (callBack) {
        var loadManager = new App.TheejsLoadManager(['/geometries/node.json', '/geometries/nodeArrows.json'], callBack, this);
        loadManager.load();
    },

    /**
     * Load nodes
     */
    loadNodeData: function (geometriesArray) {
        App.ApiProvider.getTopology(function (json) {
            this.addThreeJsScene.apply(this, [json, geometriesArray[0], geometriesArray[1]]);
        }.bind(this));
    },

    /**
     * window resize handler, sets calculated width, height, top and left to undefined
     * so the values will be updated to actual
     */
    onWindowResize: function () {
        this.set('containerWidth', undefined);
        this.set('containerHeight', undefined);
        this.set('containerLeft', undefined);
        this.set('containerTop', undefined);

        var width = this.getContainerWidth();
        var height = this.getContainerHeigth();

        var renderer = this.get('renderer');
        renderer.setSize(width, height);

        var camera = this.get('camera');
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    },


    initThreeTrackBallControls: function () {
        var controls = new THREE.TrackballControls(this.get('camera'), this.getContainer()[0]);

        controls.minDistance = this.cameraControlsMinDistance;
        controls.maxDistance = this.cameraControlsMaxDistance;
        this.set('cameraControls', controls);
    },

    /**
     * Inits ThreeJs renderer
     */
    initTheeJsRenderer: function () {
        var container = this.getContainer();
        var width = this.getContainerWidth();
        var height = this.getContainerHeigth();

        var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

        //renderer = new THREE.CanvasRenderer();

        renderer.setClearColor(0x000000, 0); //- default value
        renderer.setSize(width, height);
        this.set('renderer', renderer);

        var camera = new THREE.PerspectiveCamera(this.cameraFov, width / height, this.cameraNear, this.cameraFar);
        this.set('camera', camera);

        var scene = new THREE.Scene();
        if (this.fogEnabled === true) {
            scene.fog = new THREE.FogExp2(0x242424, 0.0018);
        }

        this.set('scene', scene);

        container.append($(renderer.domElement));
    },

    /**
     * Inits ThreeJs scene
     * @param {array} data node data array
     */
    addThreeJsScene: function (json, nodeGeometry, nodeArrowsGeometry) {
        if (!Ember.isNone(json.nodes)) {
            var camera = this.get('camera');
            var scene = this.get('scene');

            this.clearScene();

            if (nodeGeometry === undefined) {
                nodeGeometry = new THREE.CubeGeometry(25, 25, 25);
            }

            var nodes = [];
            this.set('nodes', json.nodes);
            var firstNode = null;
            for (var nodeId in json.nodes) {
                var nodeData = json.nodes[nodeId];
                var node = this.createNodeObject(nodeGeometry, nodeArrowsGeometry, nodeData);
                scene.add(node);
                if (firstNode === null) {
                    firstNode = node;
                }
            }

            this.addSceneLigths(scene);

            camera.position.z = 450;

            this.initConnections(json.connections);

            this.drawLines(json.connections);

            var plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(this.dragPlaneWidth, this.dragPlaneHeight, 8, 8),
                new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.25, transparent: true})
            );
            plane.visible = false;

            plane.scale.x = this.dragPlaneSelectedScale;
            plane.scale.y = this.dragPlaneSelectedScale;
            plane.scale.z = this.dragPlaneSelectedScale;
            plane.position.copy(firstNode.position);

            scene.add(plane);
            this.set('nodeMoveHelperPlane', plane);
        }
    },

    /**
     * Init nodeConnections object
     * @param connections
     */
    initConnections: function (connections) {
        this.nodeConnections = {};
        connections.forEach(function (node) {
            var nodeId = this.generateNodeName(node.edge.headNodeConnector.node);
            if (this.nodeConnections[nodeId] === undefined) {
                this.nodeConnections[nodeId] = [];
            }
            this.nodeConnections[nodeId].push(this.generateNodeName(node.edge.tailNodeConnector.node));
        }, this);
    },

    /**
     * Return nodes connected to given node
     * @param node
     * @return array of connected nodes
     */
    getNodeConnections: function (nodeId) {
        return this.nodeConnections[nodeId];
    },

    /**
     * Adds lights to scene
     * @param scene
     */
    addSceneLigths: function (scene) {
        var intensity = 0.58;

        var directionalLight = new THREE.DirectionalLight(this.lightColor, intensity);
        directionalLight.position.set(0, 0, 350); // x y z
        scene.add(directionalLight);

        directionalLight = new THREE.DirectionalLight(this.lightColor, intensity);
        directionalLight.position.set(0, 0, -350);
        scene.add(directionalLight);

        directionalLight = new THREE.DirectionalLight(this.lightColor, intensity);
        directionalLight.position.set(0, 100, 0);
        scene.add(directionalLight);

        directionalLight = new THREE.DirectionalLight(this.lightColor, intensity);
        directionalLight.position.set(0, -100, 0);
        scene.add(directionalLight);

        directionalLight = new THREE.DirectionalLight(this.lightColor, intensity);
        directionalLight.position.set(250, 0, 0);
        scene.add(directionalLight);

        directionalLight = new THREE.DirectionalLight(this.lightColor, intensity);
        directionalLight.position.set(-250, 0, 0);
        scene.add(directionalLight);


    },

    /**
     * Creates node object
     * @param geometry
     * @param nodeData
     */
    createNodeObject: function (nodeGeometry, nodeArrowsGeometry, nodeData) {
        var node = new THREE.Mesh(nodeGeometry, new THREE.MeshPhongMaterial({color: this.nodeColor}));
        node.position.x = nodeData.coords.x;
        node.position.y = nodeData.coords.y;
        node.position.z = nodeData.coords.z;
        node.type = nodeData.type;
        node.name = this.generateNodeName(nodeData);
        node.objectType = this.getNodeType();
        node.nodeId = nodeData.id;
        node.add(this.createNodeLabel(nodeData));
        node.add(this.createNodeArrows(nodeArrowsGeometry));
        return node;
    },

    /**
     * Generates node id
     * @param node
     * @return id
     */
    generateNodeName: function (nodeData) {
        return nodeData.type + " | " + nodeData.id;
    },

    createNodeArrows: function (nodeArrowsGeometry) {
        if (nodeArrowsGeometry === undefined) {
            return null;
        }
        var nodeArrow = new THREE.Mesh(nodeArrowsGeometry, new THREE.MeshLambertMaterial({color: this.nodeArrowsColor}));
        nodeArrow.position.x = 0;
        nodeArrow.position.y = 0;
        nodeArrow.position.z = 0;
        return nodeArrow;
    },

    /**
     * Create node label
     * @param nodeData
     */
    createNodeLabel: function (nodeData) {
        var textShapes = THREE.FontUtils.generateShapes(nodeData.type + '|' + nodeData.id, {
            font: "helvetiker",
            size: 5
        });
        var textGeometry = new THREE.ShapeGeometry(textShapes);
        var textMaterial = new THREE.MeshBasicMaterial();
        var textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textGeometry.computeBoundingBox();
        var maxX = textGeometry.boundingBox.max.x;

        textMesh.position.x = this.nodeLabelOffset.x - maxX / 2;
        textMesh.position.y = this.nodeLabelOffset.y;
        textMesh.position.z = this.nodeLabelOffset.z;

        return textMesh;
    },

    getNodeType: function () {
        return 'node';
    },

    /**
     * Draw connection between nodes
     * @param {array} data
     */
    drawLines: function (data) {
        var scene = this.get('scene');
        var nodes = this.get('nodes');
        data.forEach(function (value) {
            var fromNode = value.edge.tailNodeConnector.node.id;
            var nodeTo = value.edge.headNodeConnector.node.id;
            var line = this.createLine(nodes[fromNode], nodes[nodeTo]);

            this.addNodeLineData(value.edge.tailNodeConnector.node, line.geometry.vertices[0], line.geometry);
            this.addNodeLineData(value.edge.headNodeConnector.node, line.geometry.vertices[1], line.geometry);

            scene.add(line);
        }.bind(this));
    },

    addNodeLineData: function (node, lineVertex, geometry) {
        var nodeName = this.generateNodeName(node);
        if (!Ember.isArray(this.nodeLines[nodeName])) {
            this.nodeLines[nodeName] = [];
        }
        this.nodeLines[nodeName].push({vertex: lineVertex, geometry: geometry});
    },

    /**
     * Creates a line from vectorFrom to vectorTo
     * @param {type} vectorFrom
     * @param {type} vectorTo
     * @returns {THREE.Line} line
     */
    createLine: function (nodeFrom, nodeTo) {
        var vectorFrom = new THREE.Vector3(nodeFrom.coords.x, nodeFrom.coords.y, nodeFrom.coords.z);
        var vectorTo = new THREE.Vector3(nodeTo.coords.x, nodeTo.coords.y, nodeTo.coords.z);

        var geometry = new THREE.Geometry();
        geometry.vertices.push(vectorFrom);
        geometry.vertices.push(vectorTo);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: this.nodeLinkColor}));

        return line;
    },

    /**
     * Removes all objects from the scene
     */
    clearScene: function () {
        var scene = this.get('scene');
        if (Ember.isArray(scene.children)) {
            $.each(Ember.copy(scene.children), function (index, object) {
                scene.remove(object);
            });
        }
    },

    /**
     * Start animate
     */
    animateScene: function () {
        var renderer = this.get('renderer');
        var camera = this.get('camera');
        var scene = this.get('scene');

        var render = function () {
            requestAnimationFrame(render);
            var controls = this.get('cameraControls');
            if (controls !== undefined) {
                controls.update();
            }

            for (var i = 0, l = scene.children.length; i < l; i++) {
                if ((scene.children[i] instanceof THREE.Mesh && scene.children[i].objectType === this.getNodeType())) {
                    scene.children[i].up = camera.up;
                    var lookAtVector = camera.position.clone();
                    lookAtVector.x = lookAtVector.x * this.nodeLookUpVectorMultiplier;
                    lookAtVector.y = lookAtVector.y * this.nodeLookUpVectorMultiplier;
                    lookAtVector.z = lookAtVector.z * this.nodeLookUpVectorMultiplier;

                    scene.children[i].lookAt(lookAtVector);
                }
            }

            renderer.render(scene, camera);
        }.bind(this);
        render();
    },

    /**
     * Inits mouse over and mouse leave events for scene objects
     */
    initTheeJsMouseEvents: function () {
        var config = this.fillEventConfig();

        this.addMouseMoveListeners(config);

        this.addMouseDownListeners(config);
    },

    removeThreeJsMouseEvents: function () {
        var domElement = this.get('renderer').domElement;
        $(document).unbind('mousemove', $.proxy(this.onDocumentMouseMove, this));
        $(domElement).unbind('mousedown', $.proxy(this.onDocumentMouseDown, this));
        $(domElement).unbind('mouseup', $.proxy(this.onDocumentMouseUp, this));
    },

    addMouseMoveListeners: function (config) {
        this.set('selectedNode', null);
        $(document).bind('mousemove', $.proxy(this.onDocumentMouseMove, this));
    },

    addMouseDownListeners: function (config) {
        var domElement = this.get('renderer').domElement;
        $(domElement).bind('mousedown', $.proxy(this.onDocumentMouseDown, this));

        $(domElement).bind('mouseup', $.proxy(this.onDocumentMouseUp, this));
    },

    onDocumentMouseMove: function (event) {
        var config = this.eventConfig;

        var offset = this.get('offset');

        var camera = this.get('camera');

        var plane = this.get('nodeMoveHelperPlane');

        var vector = this.getMouseVector(event, config).unproject(camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var dragNode = this.get('dragNode');

        if (dragNode !== null && dragNode !== undefined) {

            var intersectsWithPlane = raycaster.intersectObject(plane);
            dragNode.position.copy(intersectsWithPlane[0].point.sub(offset));

            var lineData = this.nodeLines[dragNode.name];

            if (Ember.isArray(lineData)) {
                lineData.forEach(function (lineData) {
                    lineData.vertex.copy(dragNode.position);
                    lineData.geometry.verticesNeedUpdate = true;
                });
            }
            return;

        }

        var current = this.get('selectedNode');
        var intersects = this.calculateIntersects(event, config);

        //TODO: fix selected objects (use array to store selected objects)
        if (intersects.length > 0) {

            if (current !== intersects[0].object) {
                current = intersects[0].object;
                this.mouseOverThreeJsSceneObject(current);

                //d&d
                if (current.objectType === this.getNodeType()) {
                    plane.position.copy(current.position);

                    var lookAtVector = camera.position.clone();
                    lookAtVector.x = lookAtVector.x * 10;
                    lookAtVector.y = lookAtVector.y * 10;
                    lookAtVector.z = lookAtVector.z * 10;

                    plane.lookAt(lookAtVector);
                }
            }

        } else if (current !== null) {
            this.mouseLeaveThreeJsSceneObject(current);
            current = null;
        }
        this.set('selectedNode', current);
        this.get('renderer').render(this.get('scene'), this.get('camera'));
    },

    onDocumentMouseUp: function (event) {
        event.preventDefault();

        var config = this.eventConfig;

        this.get('cameraControls').enabled = true;

        var dragNode = this.get('dragNode');

        if (dragNode !== undefined && dragNode !== null) {
            var plane = this.get('nodeMoveHelperPlane');
            plane.position.copy(dragNode.position);
            plane.scale.x = this.dragPlaneSelectedScale;
            plane.scale.y = this.dragPlaneSelectedScale;
            plane.scale.z = this.dragPlaneSelectedScale;

            App.ApiProvider.storeNodeCoords(dragNode.nodeId, {
                x: dragNode.position.x,
                y: dragNode.position.y,
                z: dragNode.position.z
            });

            this.set('dragNode', null);
        }
    },

    onDocumentMouseDown: function (event) {
        var config = this.eventConfig;

        var intersects = this.calculateIntersects(event, config);

        var sceneObject = null;

        if (intersects.length) {
            sceneObject = intersects[0].object;

            if (sceneObject.objectType === this.getNodeType()) {
                this.onNodeSelect(sceneObject);
            }
        }

        //d&d
        this.get('cameraControls').enabled = true;

        var offset = new THREE.Vector3(0, 0, 0);

        var camera = this.get('camera');

        var plane = this.get('nodeMoveHelperPlane');

        var vector = this.getMouseVector(event, config).unproject(camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        if (sceneObject !== undefined && sceneObject !== null && sceneObject.objectType === this.getNodeType()) {

            var intersectsWithPlane = raycaster.intersectObject(plane);

            if (intersectsWithPlane && intersectsWithPlane[0]) {
                plane.scale.x = 1;
                plane.scale.y = 1;
                plane.scale.z = 1;
                this.set('dragNode', sceneObject);
                this.get('cameraControls').enabled = false;
                offset.copy(intersectsWithPlane[0].point).sub(plane.position);
                this.set('offset', offset);
            }
        }
    },

    onNodeSelect: function (node) {
        this.selectNode(node);
        App.EventManager.view3dEventManager.sendNodeData(node.name);
    },

    calculateIntersects: function (event, config) {

        var camera = this.get('camera'), scene = this.get('scene'), renderer = this.get('renderer');

        var vector = this.getMouseVector(event, config);
        vector.unproject(camera);
        config.raycaster.set(camera.position, vector.sub(camera.position).normalize());

        return config.raycaster.intersectObjects(scene.children);
    },

    getMouseVector: function (event, config) {
        var camera = this.get('camera'), scene = this.get('scene'), renderer = this.get('renderer');

        config.mouse.x = ( ( event.clientX - this.getContainerLeft() + $(window).scrollLeft() ) /
        this.getContainerWidth()) * 2 - 1;

        config.mouse.y = -( ( event.clientY - this.getContainerTop() + $(window).scrollTop() ) /
        this.getContainerHeigth()) * 2 + 1;

        var vector = new THREE.Vector3(config.mouse.x, config.mouse.y, 0.5);
        return vector;
    },

    fillEventConfig: function (config_) {
        var config = config_ || {};

        config.projector = new THREE.Projector();
        config.raycaster = new THREE.Raycaster();
        config.mouse = new THREE.Vector2();

        return config;
    },

    /**
     * Mouse over scene oject handler
     * @param {THREE.object} sceneObject event target
     */
    mouseOverThreeJsSceneObject: function (sceneObject) {
        //sceneObject.material.color.setRGB(1, 0,0);
    },

    /**
     * Mouse leave scene oject handler
     * @param {THREE.object} sceneObject event target
     */
    mouseLeaveThreeJsSceneObject: function (sceneObject) {
        // sceneObject.material.color.setRGB(0, 1,0);
    },

    /**
     * Removed attached handlers
     */
    willDestroyElement: function () {
        this.unbindWindowResize();
        this.removeNodeDataListener();
        this.removeThreeJsMouseEvents();
    }
});
