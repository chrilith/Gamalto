
(function() {
    // Content scroller
    var scroller;

    // Enable :active/:hover on mobile devices
    document.addEventListener("touchstart", new Function(), false);

    // Initialize scrolling and anchor!
    window.docLoaded = function() {

        // Disqus handling for iScroll
        var disqus = $("#disqus_thread");
        if (disqus.length) {
            var Observer = window.MutationObserver || window.WebKitMutationObserver;
            if (Observer) {
                var observer = new Observer(
                    function(mutations) {
                        mutations.forEach(function() {
                            if (scroller) { scroller.refresh(); }
                        });
                    });
                    observer.observe(disqus[0], { attributes: true, subtree: true });

            } else {
                // Old way with DOM Mutatuons Events
                disqus.on("DOMAttrModified DOMSubtreeModified propertychange", function() {
                    if (scroller) { scroller.refresh(); }
                });
            }
        }

        // iScrollers configuration
        var opts = {
            mouseWheel: true,
            scrollbars: true,
            click: true,
            fadeScrollbars: true,
            interactiveScrollbars: true,
            scrollbars: 'custom',
            eventPassthrough: 'horizontal'
        };

        new IScroll("#menu", opts);
        scroller = new IScroll("#content", opts);

        // Current hash
        var hash = location.hash;
        if (hash) {
            location.hash = "#_top";
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
