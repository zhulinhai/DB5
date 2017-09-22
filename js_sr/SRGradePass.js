/**
 * Super Simple Brightness Shader
 * Adjust brightness of image with an 'Intensity' Uniform
 * @author felixturner / http://airtight.cc/
 */

 THREE.TestShader = {

    uniforms: {
        "tDiffuse": { type: "t", value: null },
        "Intensity":     { type: "f", value: 1.0 },
        "Spread":        { type: "f", value: 30.0}
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
    "uniform float Intensity;",
    "uniform float Spread;",
    "varying vec2 vUv;",

    "void main() {",

        "vec4 Original = texture2D (tDiffuse, vUv);",
        "float SpreadUV = Spread / 1280.0 ;",
        
        "vec4 sum = vec4(0.0);",

        "const float BlurSamples = 20.0;",
        "float Brightness = 0.5;",
        "float NormalisedSample = 0.0;",
        "const float BlurSamplesHalf = BlurSamples/2.0;",
        
        "for ( float i = 0.0; i < BlurSamplesHalf; i++ ) {",
            


            "NormalisedSample = (i/BlurSamplesHalf);",
            "Brightness = (1.0 - (1.0 * NormalisedSample)) + 0.05;",
            
            // X+
            "sum += texture2D( tDiffuse, vec2( vUv.x + (NormalisedSample*5.0) * SpreadUV, vUv.y ) ) * Brightness;",
            "sum += texture2D( tDiffuse, vec2( vUv.x - (NormalisedSample*5.0) * SpreadUV, vUv.y ) ) * Brightness;",
            "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + (NormalisedSample*5.0) * SpreadUV ) ) * Brightness;",
            "sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - (NormalisedSample*5.0) * SpreadUV ) ) * Brightness;",
            
        "}",

        // "sum = pow(sum, vec4(5.0));",
        
        "gl_FragColor = Original + (sum * Intensity );",
        //"gl_FragColor =  (sum * 1.0 );",
    "}"


    ].join("\n")

};