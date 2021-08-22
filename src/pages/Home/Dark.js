import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useSelector } from 'react-redux'
import * as THREE from "three"
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { ResizeObserver } from '@juggle/resize-observer'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'

import Effects from '@/components/Effects'
import DarkModeTransition from "@/components/DarkModeTransition"

extend({ SAOPass, BokehPass })

const SIZE = 1.3
const SPEED = 0.08
const START_DELAY = 2
const START_DURATION = 2.5
const END_DURATION = 1
const STOP_DURATION = 2
const DURATION = START_DURATION + END_DURATION + STOP_DURATION
const X_COUNT = 40
const Y_COUNT = 25
const MIN_Z_SCALE = 0.01
const MAX_Z_SCALE = 3
const MIN_WIDTH = 2
const MAX_WIDTH = 4
const MIN_HEIGHT = 4
const MAX_HEIGHT = 8

const Pattern = ({ isKilledRef }) => {
  
  const rectsMeshRef = useRef()
  const rectsFaceRef = useRef()

  const [rects, setRects] = useState([])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const genRects = () => {
    const rects = []

    let xPos = 0, yPos = 0
    for (let x = 0; x < X_COUNT; x ++) {
      const width = THREE.MathUtils.randFloat(MIN_WIDTH, MAX_WIDTH)
      yPos = Math.random() * SIZE * 6
      for (let y = 0; y < Y_COUNT; y ++) {
        const height = THREE.MathUtils.randFloat(MIN_HEIGHT, MAX_HEIGHT)
        rects.push({ 
          x: xPos,
          y: yPos,
          width: width,
          height: height,
          rand: Math.random() * 0.8,
          zScale: MIN_Z_SCALE,
          maxZScale: MIN_Z_SCALE + Math.random() * (MAX_Z_SCALE - MIN_Z_SCALE)
        })
        yPos += height * SIZE 
      }
      xPos += width * SIZE
    }

    setRects(rects)
  }

  useEffect(() => {
    genRects()
  }, [])

  // update
  let progress = 0
  let direction = 1
  let isRegened = true
  let isStarted = false
  useFrame((state) => {

    if (state.clock.getElapsedTime() > START_DELAY) {
      isStarted = true
    }
    
    if (isStarted) {
      const t = (state.clock.getElapsedTime() - START_DELAY) % DURATION
      if (isKilledRef.current) { // change page
        direction = -1
      }
      else {
        if (!isRegened && Math.abs(t - DURATION) < 0.08) {
          genRects()
          isRegened = true
        }
        else if (t < START_DURATION) {
          direction = 1
          progress = t / START_DURATION
          if (isRegened) isRegened = false
        }
        else if (t - START_DURATION < END_DURATION) {
          direction = -1
          progress = 1 - (t - START_DURATION) / END_DURATION
        }
        else {
          progress = 0
        }
      }
    }

    rects.forEach((rect, i) => {
      let { x, y, width, height, maxZScale, rand } = rect
      let zScale = isStarted ? rectsMeshRef.current.instanceMatrix.array[i * 16 + 10] : MIN_Z_SCALE

      const isTriggered = isKilledRef.current || (direction == 1 && progress > rand) || (direction == -1 && progress < rand)
      if (isTriggered) {
        zScale += direction * SPEED
        zScale = Math.max(Math.min(zScale, maxZScale), MIN_Z_SCALE)
      }

      dummy.position.set(
        x + width * SIZE * 0.5,
        y + height * SIZE * 0.5,
        0
      )
      dummy.scale.set(width, height, zScale)
      dummy.updateMatrix()
      rectsMeshRef.current.setMatrixAt(i, dummy.matrix)
      

      dummy.position.z = zScale * SIZE * 0.5 + 0.03
      dummy.updateMatrix()
      rectsFaceRef.current.setMatrixAt(i, dummy.matrix)
    })
    rectsMeshRef.current.instanceMatrix.needsUpdate = true
    rectsFaceRef.current.instanceMatrix.needsUpdate = true

  })

  const material = new THREE.MeshLambertMaterial({ color: "#111111" })

  return (
    <group rotation={[0, 0, - Math.PI * 1 / 4]} position={[3, 24, 0]} scale={0.2} >
      <group rotation={[Math.PI, 0, 0]} >
        <instancedMesh castShadow ref={rectsMeshRef} args={[null, null, rects.length]} material={material} >
          <boxBufferGeometry args={[SIZE, SIZE, SIZE]} />
        </instancedMesh>
        <instancedMesh receiveShadow ref={rectsFaceRef} args={[null, null, rects.length]} material={material} >
          <planeBufferGeometry args={[SIZE, SIZE]} />
        </instancedMesh>
      </group>
    </group>
  )
}

const Spot = () => {
  const ref = useRef()

  useFrame((state) => {
    ref.current.position.x = state.mouse.x * 10
    // ref.current.position.y = 20 + state.mouse.x * 5
  })

  return (
    <pointLight ref={ref} position={[-10, 0, 10]} distance={11} color="#de8cc0" intensity={8} />
  )
}

const MyEffect = ({ darkMode }) => {

  const { scene, camera, size } = useThree()

  return (
    <Effects>
      <sAOPass attachArray="passes" args={[scene, camera, false, true]} params-saoIntensity={0.07} params-saoScale={2.5} params-saoBlurRadius={2} /> 
      <bokehPass attachArray="passes" args={[scene, camera,  { focus: 14, aperture: 0.002, maxblur: 0.5, width: size.width, height: size.height }]} needsSwap />
      <DarkModeTransition {...darkMode} />
    </Effects>
  )
}

const HomeDark = () => {

  const darkMode = useSelector(state => state.darkMode)
  const location = useSelector(state => state.location.target)
  const isKilledRef = useRef(false)

  useEffect(() => {
    if (location && location?.pathname != '/' && !location?.pathname.includes('about')) {
      isKilledRef.current = true
    }
  }, [location])
  
  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      gl={{ alpha: true, antialias: false }}
      camera={{ position: [-2.26, -14, 8.9], fov: 30, near: 1, far: 35 }} 
      onCreated={({ camera }) => {
        camera.rotation.set(1, -0.135, 0.2)
      }}
      resize={{ polyfill: ResizeObserver }}
    >
      <color attach="background" args={['black']} />
      {/* <fog attach="fog" args={['#202020', 10, 30]} /> */}
      <ambientLight intensity={2} />
      <Spot/>
      <directionalLight
        castShadow
        intensity={0.1}
        position={[10, 10, 8]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      /> 
      <Suspense fallback={null}>
        <Pattern isKilledRef={isKilledRef} />
        <Environment preset="warehouse" />
        <MyEffect darkMode={darkMode} />
      </Suspense>
    </Canvas>
  )
}

export default React.memo(HomeDark)
