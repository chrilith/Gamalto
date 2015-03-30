##The Gamalto Framework

Gamalto is a JavaScript framework with no external libraries dependency. It provides small base objects, including complete source code, that can be easily extended to meet your needs.
 
It is lightweight, customiazable and take advantage of the HTML5 Canvas API specification widely available in all modern browsers.
 
It is the perfect companion for retrogaming style game developers with support for tile-based games, palettized graphics and much more!

##Getting Started

Getting into Gamalto is quite easy. The first thing is to download the source going to the [GitHub project page](https://github.com/chrilith/Gamalto).

When the file is done downloading, unpack the archive and copy the full content of the "source" folder in a folder of your game project and add the following line to your startup page.

```html
<script src="path/to/gamalto.debug.js"></script>
```

If you prefer using a CDN, Gamalto can be called directly from **code.gamalto.com**.

```html
<!-- Debug version -->
<script src="http://code.gamalto.com/gamalto-debug-latest.min.js"></script>

<!-- Development version -->
<script src="http://code.gamalto.com/gamalto-devel.full.js"></script>
```

There are currently two flavors of Gamalto you can use in the CDN. One minified and lightweight version which include all the debug traces present in the original source code, a good way to pre-test a final version of your game, and another one which is the exact copy of the full source code available on GitHub in a human readable format to ease debugging.


##Accessing the Gamalto Components

You can access all the properties, methods and objects related to Gamalto using the `Gamalto` global property. This property is a static object which provides two ways to access its components.

```javascript
// Classic way to access a method or properties
Gamalto.init();
 
// Shorten way
G.init();
 
// The same for object access
var scroll = new G.Scroller(surface);
```

The shorten call version is usually prefered because it consequently reduce the final code size and ease code writing.

##Initialization

To initialize Gamalto you must first call the `init()` method of the object passing a startup function. This function will be called once the framework is fully initialized. You can use the following code as a bootstrap.

```html
<!DOCTYPE html>
 <html>
    <head>
        <title>Your Game Name</title>

        <!-- Include the framework -->
        <script src="path/to/gamalto.debug.js"></script>

        <!-- Game code -->
        <script src="path/to/game.js"></script>

        <!-- Startup code -->
        <script>

            Gamalto.init(function() {
                // ... Your code here
            });

        </script>
    </head>
    <body></body>
</html>
```

This process is required in order for the framework to work properly. Without this initialization, some required methods will not be added to the JavaScript engine and most of the calls to the APIs will fail.

