// const RaindowShader = {
//     uniforms: {
//       time: { value: 0.0 },
//     },
  
//     vertexShader: `
//     vec3 vPosition = position;

//     vec3 vcV = cross( orientation.xyz, vPosition );
  
//     vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );
  
//     vUv = uv;
  
//     gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + vPosition, 1.0 );
//     `,
  
//     fragmentShader: `
//       #include <common>

//       uniform float time;
//       varying vec2 vUv;

//       vec3 rainbow(float level) {
//         /*
//           Target colors
//           =============
          
//           L  x   color
//           0  0.0 vec4(1.0, 0.0, 0.0, 1.0);
//           1  0.2 vec4(1.0, 0.5, 0.0, 1.0);
//           2  0.4 vec4(1.0, 1.0, 0.0, 1.0);
//           3  0.6 vec4(0.0, 0.5, 0.0, 1.0);
//           4  0.8 vec4(0.0, 0.0, 1.0, 1.0);
//           5  1.0 vec4(0.5, 0.0, 0.5, 1.0);
//         */
        
//         float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
//         float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
//         float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
//         return vec3(r, g, b);
//       }

//       vec3 smoothRainbow (float x) {
//         float level1 = floor(x*6.0);
//         float level2 = min(6.0, floor(x*6.0) + 1.0);
        
//         vec3 a = rainbow(level1);
//         vec3 b = rainbow(level2);
        
//         return mix(a, b, fract(x*6.0));
//       }

//       void main() {

//         // vec3 color = smoothRainbow(vUv.x);
//         // gl_FragColor = vec4(color, 1.0);

//         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

//       }
//     `
// }

// export default RaindowShader