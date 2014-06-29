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

(function() {

	var all  = document.getElementsByTagName('script'),
		path = all[all.length - 1].src,
		dir	 = path.substr(0, path.indexOf("gamalto.debug.js"));
	
	document.write(' \
		<script src="' + dir + 'Core.js"></script> \
		<script src="' + dir + 'Environment.js"></script> \
		<script src="' + dir + 'Debug.js"></script> \
		<script src="' + dir + 'Gamalto.js"></script> \
		<script src="' + dir + 'Compat.js"></script> \
		<script src="' + dir + 'GObject.js"></script> \
		<script src="' + dir + 'OOP.js"></script> \
		<script src="' + dir + 'Extensions.js"></script> \
		<script src="' + dir + 'Missing.js"></script> \
		<script src="' + dir + 'GPromise.js"></script> \
	\
		<script src="' + dir + 'GShader.js"></script> \
		<script src="' + dir + 'GAnimator.js"></script> \
		<script src="' + dir + 'GAsync.js"></script> \
		<script src="' + dir + 'GBuffer.js"></script> \
		<script src="' + dir + 'GSectionList.js"></script> \
		<script src="' + dir + 'GSpriteSheet.js"></script> \
		<script src="' + dir + 'GAnimation.js"></script> \
		<script src="' + dir + 'GTile.js"></script> \
		<script src="' + dir + 'GTileSet.js"></script> \
		<script src="' + dir + 'GTileGroup.js"></script> \
		<script src="' + dir + 'GTileMap.js"></script> \
		<script src="' + dir + 'GTiledBlock.js"></script> \
		<script src="' + dir + 'GTiledAnimation.js"></script> \
		<script src="' + dir + 'GFont.js"></script> \
		<script src="' + dir + 'GTimer.js"></script> \
		<script src="' + dir + 'GVector.js"></script> \
		<script src="' + dir + 'GShape.js"></script> \
		<script src="' + dir + 'GCircle.js"></script> \
		<script src="' + dir + 'GRect.js"></script> \
		<script src="' + dir + 'GSize.js"></script> \
		<script src="' + dir + 'GEntity.js"></script> \
		<script src="' + dir + 'GScroller.js"></script> \
		<script src="' + dir + 'GScrollingRegion.js"></script> \
		<script src="' + dir + 'GSurface.js"></script> \
		<script src="' + dir + 'GBaseRenderer.js"></script> \
		<script src="' + dir + 'GRenderer2D.js"></script> \
		<script src="' + dir + 'GRendererWebGL.js"></script> \
		<script src="' + dir + 'GScreen.js"></script> \
		<script src="' + dir + 'GBitmap.js"></script> \
		<script src="' + dir + 'GBaseLibrary.js"></script> \
		<script src="' + dir + 'GBitmapLibrary.js"></script> \
		<script src="' + dir + 'GXMLLibrary.js"></script> \
		<script src="' + dir + 'GDataLibrary.js"></script> \
		<script src="' + dir + 'GSequence.js"></script> \
		<script src="' + dir + 'GState.js"></script> \
		<script src="' + dir + 'GColor.js"></script> \
		<script src="' + dir + 'GPalette.js"></script> \
		<script src="' + dir + 'GPattern.js"></script> \
		<script src="' + dir + 'GEvent.js"></script> \
		<script src="' + dir + 'GEventManager.js"></script> \
		<script src="' + dir + 'GKeyboardEvent.js"></script> \
		<script src="' + dir + 'GKeyboardEvent_iCade.js"></script> \
		<script src="' + dir + 'GMouseEvent.js"></script> \
		<script src="' + dir + 'GEventManager_Keyboard.js"></script> \
		<script src="' + dir + 'GEventManager_Keyboard_iCade.js"></script> \
		<script src="' + dir + 'GEventManager_Mouse.js"></script> \
		<script src="' + dir + 'GCommandLine.js"></script> \
		<script src="' + dir + 'GSound.js"></script> \
		<script src="' + dir + 'GSoundPool.js"></script> \
		<script src="' + dir + 'GAudioChannel.js"></script> \
		<script src="' + dir + 'GAudioMixer.js"></script> \
		<script src="' + dir + 'GAudioMixer_HTML5Audio.js"></script> \
		<script src="' + dir + 'GStream.js"></script> \
		<script src="' + dir + 'GSeekableStream.js"></script> \
		<script src="' + dir + 'GReadableStream.js"></script> \
		<script src="' + dir + 'GReadStream.js"></script> \
		<script src="' + dir + 'GMemoryStream.js"></script> \
		<script src="' + dir + 'GFile.js"></script> \
		<script src="' + dir + 'GAsyncFile.js"></script> \
		<script src="' + dir + 'GConvert.js"></script> \
		<script src="' + dir + 'GDecoder.js"></script> \
		<script src="' + dir + 'GDecoder_RLE.js"></script> \
		<script src="' + dir + 'GDecoder_RLE-IFF.js"></script> \
		<script src="' + dir + 'GDecoder_Interleaved.js"></script> \
		<script src="' + dir + 'GIndexedImage.js"></script> \
		<script src="' + dir + 'GIndexedImage_AtariDegasElite.js"></script> \
		<script src="' + dir + 'GIndexedImage_AtariNeochrome.js"></script> \
		<script src="' + dir + 'GIndexedImage_InterchangeFileFormat.js"></script> \
		<script src="' + dir + 'GIndexedBitmap.js"></script> \
		<script src="' + dir + 'GTouchGamepad.js"></script> \
\
		<script src="' + dir + 'EFader.js"></script> \
	');

})();
