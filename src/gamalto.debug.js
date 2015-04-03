/*
 * Gamalto Debug Version
 * 
 * This file is part of the Gamalto middleware
 * http://www.gamalto.com/
 *

Copyright (C)2012 Chris Apers and The Gamalto Project, all rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

For production software, the copyright notice only is required. You must also
display a splash screen showing the Gamalto logo in your game of other software
made using this middleware.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 *
 */

var GAMALTO_DEBUG = true;

(function() {

	var all  = document.getElementsByTagName('script'),
		path = all[all.length - 1].src,
		dir	 = path.substr(0, path.indexOf("gamalto.debug.js")),
		files = [

	    "Gamalto.js",

	    "core/Core.js",
	    "core/Environment.js",
	    "core/Debug.js",
	    "core/Compat.js",
	    "core/GObject.js",
	    "core/OOP.js",
	    "core/Extensions.js",
		
	    "async/API_Immediate.js",
	    "async/GPromise.js",
	    "async/GAsync.js",

	    "system/API_Base64.js",
	    "system/GConvert.js",
	    "system/GCommandLine.js",
	    "system/GTimer.js",
	    "system/GState.js",
	    "system/GVersion.js",

		"io/GStream.js",
	    "io/GSeekableStream.js",
	    "io/GReadableStream.js",
	    "io/GStreamReader.js",
	    "io/GMemoryStream.js",
	    "io/GFile.js",
	    "io/GAsyncFile.js",

	    "data/API_CORS.js",
	    "data/GBaseLibrary.js",
	    "data/GXMLLibrary.js",
	    "data/GDataLibrary.js",
	    "data/GTextLibrary.js",
	    "data/GArrayReader.js",
	    "data/GArrayWriter.js",
	    "data/GTextReader.js",

	    "geometry/GVector2.js",
	    "geometry/GBox.js",
	    "geometry/GShape.js",
	    "geometry/GSize.js",
	    "geometry/GPolygon.js",
	    "geometry/GRect.js",
	    "geometry/GCircle.js",
	    "geometry/GPath.js",

	    "graphic/GBaseRenderer.js",
	    "graphic/GBitmap.js",
	    "graphic/GBitmapLibrary.js",
	    "graphic/GBaseCanvas.js",
	    "graphic/GCanvas2D.js",
	    "graphic/GColor.js",
	    "graphic/GPalette.js",
	    "graphic/GRenderer2D.js",
	    "graphic/GSurface.js",
	    "graphic/GScreen.js",
	    "graphic/GPattern.js",

	    "sprite/GSectionList.js",
	    "sprite/GSpriteSheet.js",
	    "sprite/GEntity.js",

		"tile/GTile.js",
		"tile/GTiledAnimation.js",
		"tile/GTileGroup.js",
		"tile/GTiledBlock.js",
		"tile/GTileMap.js",
		"tile/GTileSet.js",

	    "event/GEvent.js",
	    "event/GKeyboardEvent.js",
	    "event/GMouseEvent.js",
	    "event/GEventManager.js",
	    "event/GEventManager_Keyboard_iCade.js",
	    "event/GEventManager_Keyboard.js",
	    "event/GEventManager_Mouse.js",
	    "event/GKeyboardEvent_iCade.js",
	    "event/GTouchGamepad.js",

	    "webgl/GShader.js",
	    "webgl/GCanvasWebGL.js",
	    "webgl/GRendererWebGL.js",

	    "audio/GBaseAudioMixer.js",
	    "audio/GAudioMixer.js",
	    "audio/GAudioMixer_HTML5Audio.js",
	    "audio/GAudioMixer_WebAudio.js",
	    "audio/GAudioChannel.js",
	    "audio/GBaseSound.js",
	    "audio/GHTML5Sound.js",
	    "audio/GWebAudioSound.js",
	    "audio/GSoundPool.js",

	    "retro/GDecoder.js",
	    "retro/GDecoder_Interleaved.js",
	    "retro/GDecoder_RLE-IFF.js",
	    "retro/GDecoder_RLE.js",
	    "retro/GIndexedImage.js",
	    "retro/GIndexedImage_AtariDegasElite.js",
	    "retro/GIndexedImage_AtariNeochrome.js",
	    "retro/GIndexedImage_InterchangeFileFormat.js",
	    "retro/GIndexedBitmap.js",

	    "text/GFont.js",

		"animation/GAnimator.js",
		"animation/GAnimation.js",
		"animation/GScrollingRegion.js",
		"animation/GScroller.js",
		"animation/GSequence.js",

	    "geometry/GPathAnimator.js",

	    "effect/EFader.js",

	    "cocoonjs/CJS_GScreen.js"
	];
	
	files.forEach(function(file) {
		document.write('<script src="' + dir + file + '"></script>');
	});

})();
