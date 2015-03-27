precision mediump float;

// our texture
uniform sampler2D uImage;
uniform vec4 uClip;

// the texCoords passed in from the vertex shader.
varying vec2 vTexCoord;

void main() {
	gl_FragColor = texture2D(uImage, (vec2(vTexCoord.x * uClip.z, vTexCoord.y * uClip.w) + uClip.xy));
	// gl_FragColor = texture2D(uImage, vTexCoord);
}
