App.Util = Ember.Object.extend({


});

App.Util.reopenClass({

    initCarouselNavigation : function(_parentClass) {

        var parentClass = _parentClass || "";

        // $('.jcarousel').hammer().bind("panup", function() {
        //    $(".jcarousel").jcarousel("scroll", "-=1");
        // });

        // $('.jcarousel').hammer().bind("pandown", function() {
        //    $(".jcarousel").jcarousel("scroll", "+=1");
        // });

        $('.jcarousel').hammer().bind("panright", function() {
            $(".jcarousel").jcarousel("scroll", "-=1");
        });

        $('.jcarousel').hammer().bind("panleft", function() {
            $(".jcarousel").jcarousel("scroll", "+=1");
        });

        $(parentClass + ".jcarousel-control-prev")
            .on("jcarouselcontrol:active", function() {
                $(this).removeClass("inactive");
            })
            .on("jcarouselcontrol:inactive", function() {
                $(this).addClass("inactive");
            })
            .jcarouselControl({
                target: "-=1"
            });

        $(parentClass + ".jcarousel-control-next")
            .on("jcarouselcontrol:active", function() {
                $(this).removeClass("inactive");
            })
            .on("jcarouselcontrol:inactive", function() {
                $(this).addClass("inactive");
            })
            .jcarouselControl({
                target: "+=1"
            });
    },

    initWidgetBarCarousel : function() {
        $(function() {
            $('.jcarousel').jcarousel({
               items: '.widget-wrapper',
               vertical : true
            });

            App.Util.initCarouselNavigation(".widget-bar ");
        });
    }
});