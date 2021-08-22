import React, { useState, useEffect, useRef } from 'react'
import store from '@/store'
import { useSelector } from 'react-redux'

import {
  InfoContainer,
  InfoTopContainer,
  InfoTitle,
  InfoType,
  InfoContent,
  InfoBottom,
  BottomRow,
  VisitSite
} from './styles'

import MaskedElement from '@/components/MaskedElement'

import Dark from './Dark'
import Light from './Light'

const Info = React.memo(() => {

  let timeoutRef = useRef(null)

  // set info 
  const currentIndex = useSelector(state => state.works.currentIndex)
  const [info, setInfo] = useState(null)
  useEffect(() => {
    if (timeoutRef.current != null) 
      clearTimeout(timeoutRef.current)

    const direction = store.getState().works.direction
    if (direction != null) {
      document.body.classList.add("is-work-changing")
      timeoutRef.current = setTimeout(
        () => {
          setInfo(store.getState().works.data[currentIndex])
          setTimeout( () => document.body.classList.remove("is-work-changing"), 50)
        }
      , 800)
    }
    else setInfo(store.getState().works.data[currentIndex])
  }, [currentIndex])

  const browseWork = (direction) => {
    store.dispatch({ type: 'BROWSE_WORK', direction: direction })
  }

  const InfoTop = React.memo(() => {
    return (
      <MaskedElement>
        <InfoTopContainer
          style={{ '--infoColor': info.color }}
        >
          <InfoTitle className='reveal-text'>
            {info?.title?? ''}
          </InfoTitle>
          <br/>
          <InfoType className='reveal-text'>
            <i>({info?.type?? ''})</i> /{info?.tags?? ''}/
          </InfoType>
          <br/>
          <InfoContent className='reveal-text'>
            {info?.about?? ''}
          </InfoContent>
        </InfoTopContainer>
        
        <InfoTopContainer 
          className='is-back'
          style={{ '--infoColor': info.color }}
        >
          <InfoTitle className='reveal-text'>
            {info?.title?? ''}
          </InfoTitle>
          <br/>
          <InfoType className='reveal-text'>
            <i>({info?.type?? ''})</i> /{info?.tags?? ''}/
          </InfoType>
          <br/>
          <InfoContent className='reveal-text'>
            {info?.about?? ''}
          </InfoContent>
        </InfoTopContainer>
      </MaskedElement>
    )
  })

  return (
    <InfoContainer>

      <VisitSite 
        target="_blank" 
        href={info?.link}
        className='reveal-text' 
        style={ info?.color && { '--infoColor': info.color }} 
      >
        {'> VISIT SITE'}
      </VisitSite>
      
      {info && <InfoTop/>}

      <InfoBottom>
        <div className='button' onClick={() => browseWork(-1)}>
          <span>{'< prev'}</span>
        </div>
        <div className='button' onClick={() => browseWork(1)}>
          <span>{'next >'}</span>
        </div>
      </InfoBottom>

    </InfoContainer>
  )
})

export default function Works() {

  useEffect(() => {
    setTimeout(() => setIsShown(true), 300)
  }, [])

  const darkMode = useSelector(state => state.darkMode)
  const location = useSelector(state => state.location)

  const [isShown, setIsShown] = useState(false)
  const isHiding = !isShown || (location.isChanging && (location.target?.pathname && location.target.pathname != '/works'))

  return (
    <>
      { (!darkMode.isOn || darkMode.isChanging) &&
        <div 
        className={`canvas-wrapper${isHiding ? ' is-hiding' : ''}`}
          style={{ 
            opacity: darkMode.isOn && !darkMode.isTransitioning ? 0 : 1,
          }}
        >
          <Light/>
        </div>
      }

      { (darkMode.isOn || darkMode.isChanging) &&
        <div 
        className={`canvas-wrapper${isHiding ? ' is-hiding' : ''}`}
          style={{ 
            opacity: !darkMode.isOn && !darkMode.isTransitioning ? 0 : 1
          }}
        >
          <Dark/>
        </div>
      }

      <Info/>
    </>
  )
}
