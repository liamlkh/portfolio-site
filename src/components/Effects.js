import React, { useRef, useEffect } from 'react'
import { useThree, useFrame, extend } from '@react-three/fiber'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

extend({ EffectComposer, ShaderPass, RenderPass })

export default function Effects({ children, isGammaOn, isAAOn }) {

  const composerRef = useRef()
  const { scene, gl, size, camera } = useThree()
  
  useEffect(() => {
    composerRef.current.setSize(size.width, size.height)
  }, [size])

  useFrame(() => {
    if (composerRef.current) composerRef.current.render()
  }, 1)

  return (
    <effectComposer ref={composerRef} args={[gl]} >
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {children}
      {isGammaOn && <shaderPass attachArray="passes" args={[GammaCorrectionShader]} />}
      {isAAOn && <shaderPass attachArray="passes" args={[FXAAShader]} material-uniforms-resolution-value={[1 / size.width, 1 / size.height]} />}
    </effectComposer>
  )
}
