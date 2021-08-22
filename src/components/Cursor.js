import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

const Cursor = () => {

  const ref = useRef()

  const updateMousePosition = ev => {
    if (ref.current) 
      ref.current.style.transform = `translate(${ev.clientX - 52.7}px, ${ev.clientY - 52.7}px)`
  }

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  const isDark = useSelector(state => state.darkMode.isOn)

  return (
    <div 
      ref={ref}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 999,
        top: 0,
        left: 0,
        transform: `scale(0)`
      }}
    >
      <svg>
        <polygon fill="none" stroke={isDark ? '#898989' : "black"} points="52.7 2.77 12.61 22.08 2.71 65.47 30.45 100.27 74.96 100.27 102.7 65.47 92.8 22.08 52.7 2.77"/>
      </svg>
    </div>
  )
}

export default Cursor