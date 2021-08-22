import * as THREE from 'three'

const GlitchShader = {
    uniforms: {
      tex: { value: null },
      noise: { value: null },
      time: { value: 0.0 },
		  nIntensity: { value: 0.5 },
		  sIntensity: { value: 0.5},
		  sCount: { value: 648 },
      transparent: true,
      blending: THREE.AdditiveBlending,
    },
  
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
  
    fragmentShader: `
      #include <common>

      uniform float time;
      uniform float nIntensity;
      uniform float sIntensity;
      uniform float sCount;
      uniform sampler2D tex;
      uniform sampler2D noise;
      varying vec2 vUv;

      float random(vec2 c){
        return fract(sin(dot(c.xy ,vec2(19.97, 6.23))) * 9.15);
      }

      vec4 glitch() {

        float shake = random(vec2(time)) * 2.0 - 1.0;
        vec2 uv = vUv + vec2(shake * 0.002, 0.0);
        float force = smoothstep(0.5, 1.0, sin(time * 4.0) * 0.8 + sin(time * 5.0) + 0.2);

        vec2 r = vec2(
          random(vec2(ceil(time * 20.0), 0.0)) * 2.0 - 1.0,
          random(vec2(0.0, ceil(time * 20.0))) * 2.0 - 1.0
        );


        float mask = texture2D(noise, uv * vec2(0.2, 0.4) * r).r;
        vec4 texColor;

        if (mask < 0.5)
          texColor = texture2D(tex, uv);
        else
          texColor = texture2D(tex, uv + r * 0.2 * force);

        return texColor;
        // return texture2D(noise, vUv);
        
      }

    
      void main() {
    
        vec4 color = glitch();

        // film shader
        float dx = rand(vUv + time);
        vec3 cResult = color.rgb + color.rgb * clamp( 0.1 + dx, 0.0, 1.0 ); // add noise
        vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) ); // get us a sine and cosine
        cResult += color.rgb * vec3(sc.x, sc.y, sc.x) * sIntensity; // add scanlines
        cResult = color.rgb + clamp(nIntensity, 0.0, 1.0) * (cResult - color.rgb);  // interpolate between source and result by intensity
        color =  vec4(cResult, color.a);


        gl_FragColor = color;

      }
    `
}

export default GlitchShader