import React, { useRef, useEffect, useMemo } from 'react'
import { isMobile, browserName } from 'react-device-detect'

const MaskedElement = ({ children }) => {

  const frontRef = useRef()
  const backRef = useRef()

  const updateMousePosition = ev => {
    if (frontRef.current && backRef.current) { 
      const { left, top, width, height } = frontRef.current.getBoundingClientRect()
      const x = Math.min(ev.clientX - left - 52.7, width * 1.5)
      const y = Math.min(ev.clientY - top - 52.7, height * 1.5)

      if (browserName == 'Chrome') {
        frontRef.current.style.webkitMask = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon transform="translate(${x}, ${y})" fill="black" points="52.7 2.77 12.61 22.08 2.71 65.47 30.45 100.27 74.96 100.27 102.7 65.47 92.8 22.08 52.7 2.77"/></svg>'), linear-gradient(#fff,#fff)`
      }
      else {
        frontRef.current.style.webkitMaskPosition =  `${x}px ${y}px, 0 0`
      }
      backRef.current.style.opacity = 1
      backRef.current.style.webkitMaskPosition =  `${x}px ${y}px`
    }
  }

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  const Front = useMemo(() => {
    return React.cloneElement(
      children[0], 
      { 
        ref: frontRef, 
        className: `${children[0].props.className?? ''} inverted-mask`, 
        style: { 
          ...children[0].props.style, 
          ... browserName != 'Chrome' && { webkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><polygon fill="black" points="52.7 2.77 12.61 22.08 2.71 65.47 30.45 100.27 74.96 100.27 102.7 65.47 92.8 22.08 52.7 2.77"/></svg>'), linear-gradient(#fff,#fff)`, webkitMaskPosition:  `-60px -60px, 0 0` } 
        }
      }
    ) 
  }, [])

  const Back = useMemo(() => {
    return React.cloneElement(children[1], { ref: backRef, className: `${children[1].props.className?? ''} mask`, style: { ...children[1].props.style, opacity: 0 } })
  }, [])

  return (  
    <>
      {Back}
      {Front}
    </>
  )
}

const Element = (props) => {
  if (isMobile)
    return <>{props.children[0]}</>
  else 
    return <MaskedElement {...props} />
}

export default React.memo(Element)