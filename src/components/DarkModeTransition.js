import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import store from '@/store'
import { useThree, useFrame, extend } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import TransitionShader from '@/shaders/TransitionShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

extend({ ShaderPass })

const TransitionShaderPass = ({ isDark }) => {

  const shaderRef = useRef()
  const { size } = useThree()

  useEffect(() => {
    shaderRef.current.material.uniforms.progress.value = isDark ? 0 : 1
  }, [])

  useFrame((_, delta) => {
    if ( 
      (isDark && shaderRef.current.material.uniforms.progress.value > 1)
      ||
      (!isDark && shaderRef.current.material.uniforms.progress.value < 0)
    )
      store.dispatch({ type: 'DARK_MODE_TRANSITION_FINISH' })
    else
      shaderRef.current.material.uniforms.progress.value += delta * (isDark ? 1 : -1)
  })

  const noise = useTexture(require("@/assets/images/rusty.jpg").default)
  const resolution = new THREE.Vector2(size.width, size.height)

  return (
    <shaderPass 
      ref={shaderRef}
      attachArray="passes" 
      args={[TransitionShader]} 
      material-uniforms-resolution-value={resolution}  
      material-uniforms-noise-value={noise}  
    />
  )
}

export default function DarkModeTransition(props) {

  const { isOn, isTransitioning } = props

  return isTransitioning ? <TransitionShaderPass isDark={isOn} /> : null

}
