import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import {
  Title,
} from './styles'

import Dark from './Dark'
import Light from './Light'
import About from '@/components/About'
import MaskedElement from '@/components/MaskedElement'

export default function Home() {

  useEffect(() => {
    setTimeout(() => setIsShown(true), 300)
  }, [])

  const darkMode = useSelector(state => state.darkMode)
  const location = useSelector(state => state.location)

  const [isShown, setIsShown] = useState(!darkMode.isOn)
  const isHiding = !isShown || (location.isChanging && (location.target?.pathname && location.target.pathname != '/' && location.target.pathname != '/about'))

  return (
    <>

      {(!darkMode.isOn || darkMode.isChanging) &&
        <div 
          className={`canvas-wrapper home`}
          style={{ 
            opacity: (darkMode.isOn && !darkMode.isTransitioning) ? 0 : 1,
          }}
        >
          <Light/>
        </div>
      }

      {(darkMode.isOn || darkMode.isChanging) &&
        <div 
        className={`canvas-wrapper home${isHiding ? ' is-hiding' : ''}`}
          style={{ 
            opacity: (!darkMode.isOn && !darkMode.isTransitioning) ? 0 : 1
          }}
        >
          <Dark/>
        </div>
      }

      {location.current?.pathname == '/' &&
        <MaskedElement>
          <Title>
            <h1 className='reveal-text'>Hi, I’m Liam</h1>
            <h2 className='reveal-text'>software developer</h2>
          </Title>
          <Title className="is-back">
            <h1 className='reveal-text'>Hi, I’m Liam</h1>
            <h2 className='reveal-text'>software developer</h2>
          </Title>
        </MaskedElement>
      }

      {location.current?.pathname == '/about' && <About/>}

    </>
  )
}
