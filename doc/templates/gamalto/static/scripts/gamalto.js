
(function() {
    // Content scroller
    var scroller;

    // Current hash
    var hash = location.hash;
    window.scrollTo(0,0);
    location.hash = "";

    // Enable :active/:hover on mobile devices
    document.addEventListener("touchstart", new Function(), false);

    // Initialize scrolling and anchor!
    window.onload = function() {
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

        // Set the hash
        if (hash) {
            scroller.scrollToElement(hash);
        }

        // Prevent jump to anchor
        window.onhashchange = function(e) {
            window.scrollTo(0,0);
            hash = location.hash;
            if (hash) {
                scroller.scrollToElement(hash);
            }
        };

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
