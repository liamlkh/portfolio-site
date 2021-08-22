const MixLayerShader = {
    uniforms: {
        layer1: { value: null },
        layer2: { value: null }
    },
  
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
  
    fragmentShader: `
        uniform sampler2D layer1;
        uniform sampler2D layer2;

        varying vec2 vUv;

        void main() {
            gl_FragColor = ( texture2D( layer1, vUv ) + vec4( 1.0 ) * texture2D( layer2, vUv ) );
            // gl_FragColor = vec4(255, 0,0,1);
        }
    `
}

export default MixLayerShader