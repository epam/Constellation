App.Router.map(function () {
    this.route("loginForm", {path: "/"});

    this.resource("openflow", {path: "/openflow"}, function () {
        this.route("topology", {path: "/topology"});
        this.route("flows", {path: "/flows"});
    });

});