attribute vec4 aPosition;
varying vec2 vTexCoord;

void main() {
	gl_Position = aPosition;
	vTexCoord = aPosition.xy * vec2(0.5, -0.5) + 0.5;
}
