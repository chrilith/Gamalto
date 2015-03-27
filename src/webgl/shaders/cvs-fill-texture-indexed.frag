precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uPalette;
uniform sampler2D uImage;

void main() {
	float index = texture2D(uImage, vTexCoord).a;
	gl_FragColor = texture2D(uPalette, vec2(index, 0));
}
