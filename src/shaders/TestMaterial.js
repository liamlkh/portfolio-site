import * as THREE from "three"
import { MeshBasicMaterial, MeshStandardMaterial } from "three"

export default class DistortMaterial extends MeshBasicMaterial {
  _bbMin
  _bbMax
  // _color1
  // _color2

  constructor(
    args = {
      // diffuse: { value: 'red' }
      // color1: { value: new THREE.Color(0xff0000) },
      // color2: { value: new THREE.Color(0xffff00) }
    },
  ) {
    super(args)
    this.setValues(args)
    this._bbMin = { value: new THREE.Vector3() }
    this._bbMax = { value: new THREE.Vector3() }
    // this._color1 = { value: new THREE.Color(0xff0000) }
    // this._color2 = { value: new THREE.Color(0xffff00) }
  }

  onBeforeCompile(shader) {
    shader.uniforms.bbMin = this._bbMin
    shader.uniforms.bbMax = this._bbMax
    
    shader.vertexShader = `
      varying vec3 vPos;
      ${
        shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
          #include <begin_vertex>
          vPos = transformed;
        `
      )}
    `

    shader.fragmentShader = `
      varying vec3 vPos;
      uniform vec3 bbMin;
      uniform vec3 bbMax;
      ${rainbow}
      ${
        shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `
          float step = 1.0 / 5.0;
          float gradient = 0.5;
          float pos = (vPos.y - bbMin.y) / (bbMax.y - bbMin.y);
          float amount = mod(pos, step) / step;
          int level = int(pos / step);

          vec3 color;
          if (amount > (1.0 - gradient) ) {
            amount = (amount - (1.0 - gradient) ) / gradient * 0.5;
            int levelNext = min(level + 1, 5);
            color = mix(rainbow[level], rainbow[levelNext], amount);
          }
          else if (amount < gradient) {
            amount = amount / gradient * 0.5 + 0.5;
            int levelPrev = max(level - 1, 0);
            color = mix(rainbow[levelPrev], rainbow[level], amount);
          }
          else 
            color = rainbow[level];

          vec4 diffuseColor = vec4(color, opacity);
        `
      )}
    `

  }

  get bbMin() {
    return this._bbMin.value
  }

  set bbMin(v) {
    this._bbMin.value = v
  }

  get bbMax() {
    return this._bbMax.value
  }

  set bbMax(v) {
    this._bbMax.value = v
  }

}

// https://www.shadertoy.com/view/lsfBWs
const rainbow = `

  vec3 rainbow[5] = vec3[](
    vec3(1.0, 0.0, 0.0),
    vec3(1.0, 0.5, 0.0),
    vec3(1.0, 1.0, 0.0),
    vec3(0.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0)
  );

  // vec3 rainbow(float level) {    
  //   float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
  //   float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
  //   float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
  //   return vec3(r, g, b);
  // }
`