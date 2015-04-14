attribute vec2 aPosition;
attribute vec2 aTexCoord;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
  vec2 zeroToOne = aPosition / uResolution;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

	// pass the texCoord to the fragment shader
	// The GPU will interpolate this value between points.
	vTexCoord = aTexCoord;
}
