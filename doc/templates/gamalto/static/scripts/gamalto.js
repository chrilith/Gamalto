
(function() {
    // Content scroller
    var scroller;

    // Current hash (firefox fix)
    window.onhashchange = function() {
        setTimeout(function() { location.hash = "#_top"; }, 0);
    }
    var hash = location.hash;

    // Enable :active/:hover on mobile devices
    document.addEventListener("touchstart", new Function(), false);

    // Livefry handling for iScroll
    window.updateContent = function() {
        setTimeout(function() {
            if (scroller) { scroller.refresh(); }
        }, 500);
    };

    // Initialize scrolling and anchor!
    window.docLoaded = function() {
        // Be sure to have to proper starting position for the scroller (firefox fix)
        location.hash = "#_top";

        // Livefry handling for iScroll
        var livefyre = $("#livefyre-comments");
        if (livefyre.length) {
            var Observer = window.MutationObserver || window.WebKitMutationObserver;
            if (Observer) {
                var observer = new Observer(
                    function(mutations) {
                        mutations.forEach(function() {
                            if (scroller) { scroller.refresh(); }
                        });
                    });
                    observer.observe(livefyre[0], { attributes: true, subtree: true });

            } else {
                // Old way with DOM Mutatuons Events
                livefyre.on("DOMAttrModified DOMSubtreeModified propertychange", function() {
                    if (scroller) { scroller.refresh(); }
                });
            }
        }

        // iScrollers configuration
        var opts = {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true,
            interactiveScrollbars: true,
            scrollbars: 'custom',
            eventPassthrough: 'horizontal'
        };

        new IScroll("#menu", opts);
        scroller = new IScroll("#content", opts);

        if (hash) {
            scroller.scrollToElement(hash);
        }

        $("#toggler").on("click touchstart", function(e) {
            e.preventDefault();
            menu();
        });

        // Handle click on hash
        $('a[href*="#"]').on('click', function (e) {
            // No change? exit...
            if (this.href.split("#")[0] != location.href.split("#")[0]) {
                return;
            }
            // No anchor please!
            e.preventDefault();
            hash = this.hash;
            if (hash) {
                scroller.scrollToElement(hash);
            }
        });
    };

    // Hide menu when resizing the window
    window.onresize = function() {
        if ($(document.body).hasClass("visible")) { menu(); }
    };

    function menu() {
        $(document.body).toggleClass("visible");
    }

})();
