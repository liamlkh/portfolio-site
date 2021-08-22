const WorkLightShader = {
    uniforms: {
      effectFactor: { value: 1.2 },
      progress: { value: 0.0 },
      tex: { value: undefined },
      tex2: { value: undefined },
      disp: { value: undefined },
    },
  
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
  
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tex;
      uniform sampler2D tex2;
      uniform sampler2D disp;
      uniform float _rot;
      uniform float progress;
      uniform float effectFactor;

      void main() {
        vec2 uv = vUv;

        vec4 disp = texture2D(disp, uv);
        vec2 distortedPosition = vec2(uv.x, uv.y + progress * (disp.r * effectFactor));
        vec2 distortedPosition2 = vec2(uv.x, uv.y - (1.0 - progress) * (disp.r * effectFactor));
        vec4 _texture = texture2D(tex, distortedPosition);
        vec4 _texture2 = texture2D(tex2, distortedPosition2);
        vec4 finalTexture = mix(_texture, _texture2, progress);
        gl_FragColor = finalTexture;
      }

    `
}

export default WorkLightShader