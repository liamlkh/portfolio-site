import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import store from '@/store'
import { useSelector } from 'react-redux'
import * as THREE from "three"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { softShadows  } from "@react-three/drei"
import { EffectComposer, SSAO, BrightnessContrast } from "@react-three/postprocessing"
import { ResizeObserver } from '@juggle/resize-observer'

softShadows({
  frustum: 3.75,
  size: 0.005,
  near: 9.5,
  samples: 30,
  rings: 11, 
})

const SIZE = 1.3
const HEIGHT = 2.5
const SPEED = 0.05
const START_DELAY = 2
const START_DURATION = 2.5
const END_DURATION = 1
const STOP_DURATION = 2
const DURATION = START_DURATION + END_DURATION + STOP_DURATION
const X_COUNT = 20
const Y_COUNT = 15
const MIN_Z_SCALE = 0.01
const RECT_SIZE = [
  [4, 6],
  [3, 8],
  [2, 6]
]

const Pattern = ({ isKilledRef }) => {
  
  const rectsMeshRef = useRef()
  const rectsShadowRef = useRef()
  const squaresMeshRef = useRef()

  const [rects, setRects] = useState([])
  const [squares, setSquares] = useState([])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const Rect = new THREE.PlaneBufferGeometry(SIZE, SIZE, 1, 2)
  for (let i = 0; i < 2; i ++ ) {
    for (let j = 0; j < 2; j ++ ) {
      const index = j == 0 ? 8 : 11 
      const position = Rect.attributes.position.array
      position[index] = HEIGHT
    }
  }

  useEffect(() => {
    if (squaresMeshRef.current) {
      squares.forEach((square, i) => {
        let { x, y, width, height } = square
        dummy.position.set(
          x + width * SIZE * 0.5,
          y + height * SIZE * 0.5,
          0
        )
        dummy.scale.set(width, height, 1)
        dummy.updateMatrix()
        squaresMeshRef.current.setMatrixAt(i, dummy.matrix)
      })
      squaresMeshRef.current.instanceMatrix.needsUpdate = true
    }
  }, [squares])

  const genRects = () => {
    const rects = []
    const squares = []

    const rand = Math.round(Math.random()) * 2

    let xPos = 0
    for (let x = 0; x < X_COUNT; x ++) {
      const width = RECT_SIZE[(x + rand) % 3][0]
      const height = RECT_SIZE[(x + rand) % 3][1]
      let yPos = x % 3 == 0 ? 2 * SIZE : 0
      for (let y = 0; y < Y_COUNT; y ++) {
        if (y % 2 != 0) {
          squares.push({
            x: xPos,
            y: yPos,
            width: width,
            height: 2,
          })
          yPos += 2 * SIZE
        }
        else {
          rects.push({ 
            x: xPos,
            y: yPos,
            width: width,
            height: height,
            rand: Math.random() * 0.8,
            zScale: MIN_Z_SCALE,
          })
          yPos += height * SIZE
        }
      }
      xPos += width * SIZE
    }

    setRects(rects)
    setSquares(squares)
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
      let { x, y, width, height, rand } = rect
      let zScale = isStarted ? rectsMeshRef.current.instanceMatrix.array[i * 16 + 10] : MIN_Z_SCALE

      const isTriggered = isKilledRef.current || (direction == 1 && progress > rand) || (direction == -1 && progress < rand)
      if (isTriggered) {
        zScale += direction * SPEED
        zScale = Math.max(Math.min(zScale, 1), MIN_Z_SCALE)
      }

      dummy.position.set(
        x + width * SIZE * 0.5,
        y + height * SIZE * 0.5,
        0
      )
      dummy.scale.set(width, height, zScale)
      dummy.updateMatrix()
      rectsMeshRef.current.setMatrixAt(i, dummy.matrix)

      if (zScale < 0.03) 
        dummy.scale.set(0, 0, 0)
      else
        dummy.scale.set(width, height, zScale * 0.9)

      dummy.updateMatrix()
      rectsShadowRef.current.setMatrixAt(i, dummy.matrix)
    })
    rectsMeshRef.current.instanceMatrix.needsUpdate = true
    rectsShadowRef.current.instanceMatrix.needsUpdate = true

  })

  return (
    <group rotation={[0, 0, -Math.PI * 3 / 4]}>
      <group position={[-38, -39, 0]}>

        <instancedMesh castShadow ref={rectsShadowRef} args={[null, null, rects.length]} geometry={Rect}>
          <meshStandardMaterial side={THREE.DoubleSide} transparent opacity={0} flatShading  />
        </instancedMesh>

        <instancedMesh receiveShadow ref={rectsMeshRef} args={[null, null, rects.length]} geometry={Rect}>
          <meshStandardMaterial side={THREE.DoubleSide} flatShading />
        </instancedMesh>
        
        <instancedMesh receiveShadow ref={squaresMeshRef} args={[null, null, squares.length]}>
          <planeBufferGeometry args={[SIZE, SIZE, 1, 1]}/>
          <meshStandardMaterial side={THREE.DoubleSide} flatShading />
        </instancedMesh>

      </group>
    </group>
  )
}

const RATIO = 1.75
const MIN_ZOOM = 15
const Resize = () => {
  const { size, camera } = useThree()

  let timeoutRef = useRef(null)
  useEffect(() => {
    const canvas = document.getElementsByClassName('canvas-wrapper')[0]
    if (canvas) canvas.style.opacity = 0

    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(
      () => {
        const size_ = size.width / size.height >= RATIO ? size.width : size.height * RATIO
        const zoom = size_ < 800 ? MIN_ZOOM : MIN_ZOOM + (size_ - 800) * 0.014
        camera.zoom = zoom
        camera.updateProjectionMatrix() 
        if (canvas) canvas.style.opacity = 1
      }
    , 300)
  }, [size])

  return null
}

export default function HomeLight() {

  const location = useSelector(state => state.location.target)
  const isKilledRef = useRef(false)

  useEffect(() => {
    if (location && location?.pathname != '/' && !location?.pathname.includes('about')) {
      isKilledRef.current = true
      setTimeout(
        () => store.dispatch({ type: 'SET_LOCATION' })
      , 1500)
    }
  }, [location])

  return (
    <>
      <Canvas 
        orthographic 
        shadows 
        camera={{ position: [0, 0, 60], zoom: 24 }}
        gl={{ alpha: false, stencil: false, depth: false, antialias: false }}
        resize={{ polyfill: ResizeObserver }}
      >
        <color attach="background" args={['white']} />
        <Resize/>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight
            castShadow
            position={[0, 0, 40]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={37}
            shadow-camera-far={80}
            shadow-camera-left={-35}
            shadow-camera-right={35}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <Pattern isKilledRef={isKilledRef} />
          <EffectComposer multisampling={0}>
            <SSAO samples={25} radius={5} intensity={50} luminanceInfluence={0.6} />
            <BrightnessContrast brightness={0.2} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  )
}