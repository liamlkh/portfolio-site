const TransitionShader = {
    uniforms: {
        tDiffuse: { value: null },
        progress: { value: 0.0 },
        resolution: { value: null },
        noise: { value: null },
        transparent: true,
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

        uniform float progress;
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        varying vec2 vUv;

        uniform float opacity;

        float Hash(vec2 p) {
            p  = 50.0 * fract( p * 0.3183099 + vec2(0.71, 0.113) );
            return -1.0 + 2.0 * fract( p.x * p.y * (p.x + p.y) );
        }

        float noise(in vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            
            vec2 u = f*f*(3.0 - 2.0 * f);

            return mix( mix( Hash( i + vec2(0.0, 0.0) ), 
                            Hash( i + vec2(1.0, 0.0) ), u.x),
                        mix( Hash( i + vec2(0.0, 1.0) ), 
                            Hash( i + vec2(1.0, 1.0) ), u.x), u.y);
        }

        void main() {

            // noise value
            vec2 uv = vUv * vec2(resolution.x/resolution.y, 1.0);
            float f = 0.0;
            uv *= 0.7;
            mat2 m = mat2( 2,  2, -2,  2 );
            f  = 0.5000*noise( uv ); uv = m*uv;
            f += 0.2500*noise( uv ); uv = m*uv;
            f += 0.1250*noise( uv ); uv = m*uv;
            f += 0.0625*noise( uv ); uv = m*uv;
            f = 0.5 + 0.5 * f;

            // float th = sin( max(0.0, min(progress, 1.0) ) );
            float th = sin(progress);
            float tex = ( (f - .5) + 2. * vUv.y ) / 3.;
            float dist = smoothstep( th - .3, th + .05, tex);
            float col = pow( smoothstep(th - .2, th, tex), 3. );

            vec4 color = texture2D(tDiffuse, vUv * (.5 + pow(dist, 2.) * .5 ) );
                
            vec4 discolor = vec4(0, 0, 0, 0);
            gl_FragColor = vec4(mix(discolor, color, col));

        }
    `
}

export default TransitionShader

