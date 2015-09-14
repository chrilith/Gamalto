GAMALTO
=======
[![Build Status](https://travis-ci.org/chrilith/Gamalto.svg)][travis]
[![devDependency Status](https://david-dm.org/chrilith/Gamalto/dev-status.svg)][daviddm]
[![Inline docs](http://inch-ci.org/github/chrilith/gamalto.svg?branch=master)][inchpages]

[travis]: https://travis-ci.org/chrilith/Gamalto
[daviddm]: https://david-dm.org/chrilith/Gamalto#info=devDependencies
[inchpages]: http://inch-ci.org/github/chrilith/gamalto

Check the site for updates and examples:
http://www.gamalto.com/

Building Gamalto
================

To build your own version of Gamalto you'll need [Node.js](http://nodejs.org/) and [Gulp](http://gulpjs.com/).

First you need to clone the Gamalto repository to your computer.

```bash
$ git clone https://github.com/chrilith/Gamalto.git
```

Then, install the dependencies required to build from source.

```bash
$ cd Gamalto
$ npm install
```

Finally, build Gamalto using the following command.

```bash
$ gulp --mode production
```

Documentation
=============

The full documentation is available online at:
http://www.gamalto.com/documentation/

You can build the documentation with:
```bash
$ gulp doc
```

TODO
====

- Complete current code cleanup and documentation!
- Complete sound support
- Freeze vertices in shapes

Roadmap
=======

- Add storage support
- Add better indexed image support
- Add depth support to Color and Palette
- Add indexed palette surface with multi-palette support
- Add full WebGL renderer
- Add more map orientations support
- Add more transformations
- Add basic SAT support
- Add shapes rendering
- Add TypeScript definition
- Add semver support to Version object

Support
=======

For requests and issues use the GitHub project at:
https://github.com/chrilith/Gamalto

Dependencies
============

Currently, Gamalto relies on a single polyfill for older browsers with no native
Promise support.

License
=======

Copyright (C)2012-2015 Chris Apers and The Gamalto Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
