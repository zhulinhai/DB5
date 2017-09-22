/**
 * @author felixturner / http://airtight.cc/
 *
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * Ported from http://kriss.cx/tom/2009/05/rgb-shift/
 * by Tom Butterworth / http://kriss.cx/tom/
 *
 * amount: shift distance (1 is width of input)
 * angle: shift angle in radians
 */

THREE.ChromAbrShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 0.002 },
		"angle":    { type: "f", value: 0.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float amount;",
		"uniform float angle;",

		"varying vec2 vUv;",

		"void main() {",

        
            // Orig
			// "vec2 offset = amount * vec2( cos(angle), sin(angle));",
            
            // Multiply amount so there is less effect in the middle of the image
            "float GradRepeatX = (cos((vUv.x*3.1415/2.0)*4.0)+1.0)/2.0 ;",
            "float GradRepeatY = (cos((vUv.y*3.1415/2.0)*4.0)+1.0)/2.0 ;",
            
            "vec2 offset = vec2(GradRepeatX,GradRepeatY);",
            
			"vec4 Red = texture2D(tDiffuse, vUv - ( amount * offset));",
            
			"vec4 GreenAlpha = texture2D(tDiffuse, vUv);",
			// "vec4 Blue = texture2D(tDiffuse, vUv - offset);",
            "vec4 Blue = texture2D(tDiffuse, vUv);",

            "gl_FragColor = vec4(offset, 0.0, 1.0);",
            
			"gl_FragColor = vec4(Red.r, GreenAlpha.g, Blue.b, GreenAlpha.a);",

		"}"

	].join("\n")

};
