import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import store from '@/store'
import { useSelector } from 'react-redux'
import * as THREE from "three"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Reflector, useTexture } from '@react-three/drei'
import { ResizeObserver } from '@juggle/resize-observer'
import WorkDarkShader from '@/shaders/WorkDarkShader' 

import Effects from "@/components/Effects"
import DarkModeTransition from "@/components/DarkModeTransition"

const DISTORTION_MIN = 1
const DISTORTION_MAX = 8
const DEFAULT_CAMERA_POS = [10, 2, 30]

const Show = ({ currentIndex }) => {

  const [isChanging, setIsChanging] = useState(null)

  const planeRef = useRef()
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()
  const [rEuler, rQuaternion] = useMemo(() => [new THREE.Euler(), new THREE.Quaternion()], [])

  const materialRef = useRef()

  useEffect(() => {
    const image = store.getState().works.data[currentIndex].image
    const texture = new THREE.TextureLoader().load(process.env.PUBLIC_URL + `/works/${image}`)
    if (isChanging == null) {
      materialRef.current.uniforms.tex.value = texture
      setIsChanging(false)
    }
    else {
      materialRef.current.uniforms.tex2.value = texture
      setIsChanging(true)
    }
  }, [currentIndex])

  useFrame((state, delta) => {
    camera.position.lerp(vec.set(
      DEFAULT_CAMERA_POS[0] + mouse.x * 0.8, 
      DEFAULT_CAMERA_POS[1] + mouse.y * 0.4, 
      camera.position.z
    ), 0.05)

    rEuler.set(0, (mouse.x * Math.PI) / 6, 0)
    planeRef.current.quaternion.slerp(rQuaternion.setFromEuler(rEuler), 0.1)

    materialRef.current.uniforms.time.value += delta * 2

    if (isChanging) {
      if (materialRef.current.uniforms.progress.value >= 1) {
        materialRef.current.uniforms.progress.value = 0
        materialRef.current.uniforms.tex.value = materialRef.current.uniforms.tex2.value
        setIsChanging(false)
      }
      else {
        materialRef.current.uniforms.progress.value += delta * 0.4
        materialRef.current.uniforms.distortion.value = Math.min(DISTORTION_MAX, materialRef.current.uniforms.distortion.value + delta * 7)
      }
    }
    else if (materialRef.current.uniforms.distortion.value > DISTORTION_MIN) {
      materialRef.current.uniforms.distortion.value = Math.max(DISTORTION_MIN, materialRef.current.uniforms.distortion.value - delta * 20)
    }
  })

  return (
    <group ref={planeRef} position={[0, 3, 0]}>
      <mesh>
        <planeGeometry attach="geometry" args={[10, 6]} />
        <shaderMaterial 
          ref={materialRef} 
          args={[WorkDarkShader]}  
          attach="material" 
          transparent
        />
      </mesh>
    </group>
  )
}


const Ground = () => {
  const roughness = useTexture(require('@/assets/images/roughness.jpg').default)
  return (
    <Reflector 
      resolution={512} 
      rotation={[-Math.PI / 2, 0, 0]}
      args={[100, 100]} 
      mirror={0.4} 
      mixBlur={4} 
      mixStrength={1} 
      position={[0, -0.8, 0]}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]} 
      blur={[400, 100]}
    >
      {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={roughness} {...props} />}
    </Reflector>
  )
}

const MAX_RATIO = 1.78
const Resize = ({ setPosition }) => {
  const { size } = useThree()

  let timeoutRef = useRef(null)
  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(
      () => {
        const ratio = size.width / size.height
        const x = -4 + 12 * ratio / MAX_RATIO
        const y = Math.min(-3, -9 + 6 * ratio / MAX_RATIO)
        const z = Math.min(5, -5 + 10 * ratio / MAX_RATIO)
        setPosition([x, y, z])
      }
    , 300)
  }, [size])

  return null
}

export default function WorksDark() {

  const currentIndex = useSelector(state => state.works.currentIndex)
  const darkMode = useSelector(state => state.darkMode)
  const [position, setPosition] = useState([8, -3, 5])

  return (
    <Canvas
      shadows
      gl={{ antialias: true }}
      camera={{ position: DEFAULT_CAMERA_POS, fov: 35 }}
      resize={{ polyfill: ResizeObserver }}
    >
      <Resize setPosition={setPosition} />
      <color attach="background" args={['black']} />
      <Suspense fallback={null}>
        <group rotation={[0, Math.PI * -0.05, 0]} position={position}>
          <Ground/>
          <Show currentIndex={currentIndex}/>
        </group>
         <ambientLight intensity={0.5} />
        <directionalLight position={[-20, 0, -10]} intensity={0.7} />
        <Effects isGammaOn isAAOn>
          <DarkModeTransition {...darkMode} />
        </Effects>
      </Suspense>
    </Canvas>
  )
}
