import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useSelector } from 'react-redux'

import {
  Wrapper,
  Container,
} from './styles'

import Heptagon from '@/components/Heptagon'

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, 1.03]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

export default function About() {

  const isDark = useSelector(state => state.darkMode.isOn)
  const [spring, setSpring] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))

  return (
    <Wrapper>
      <Container
        as={animated.div}
        onMouseMove={({ clientX: x, clientY: y }) => setSpring({ xys: calc(x, y) })}
        onMouseLeave={() => setSpring({ xys: [0, 0, 1] })}
        style={{ transform: spring.xys.interpolate(trans) }}
      >
        <div/>
        <Heptagon 
          strokeWidth={isDark ? "3px" : "1px"}
          stroke={isDark ? "#a1377a" : "black"}
          fill={isDark ? "none" : "rgba(255, 255, 255, 0.5)"} 
        />
        <p>
          Hi, my name is Liam.
          <br/>
          I’m a front-end / creative developer.
          <br/><br/>
          Please contact me at liam.lk.hui@gmail.com
        </p>      
      </Container>
    </Wrapper>
  )
}
