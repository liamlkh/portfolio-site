import React, { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { useSelector } from 'react-redux'
import { useProgress } from "@react-three/drei"
import store from './store'

import Routes from './routes'
import GlobalStyled from './styles/global'

document.body.classList.add("not-ready")

function App() {

  useEffect(async () => {
    const response = await fetch('/works.json')
    const works = await response.json()
    store.dispatch({ type: 'INIT_WORKS', data: works })
    document.body.classList.add("is-light")
    
    setTimeout(
      () => {
        document.body.classList.remove("not-ready")
      }
    , 500)
  }, [])

  return (
    <Provider store={store}>
      <GlobalStyled/>
      <Routes/>
      <ThreeLoader/>
    </Provider>
  )
}

const ThreeLoader = () => {
  const darkMode = useSelector(state => state.darkMode)
  const { active } = useProgress()

  // dark mode load next scene
  let darkModeTimeoutRef = useRef(null)
  useEffect(() => {
    if (!darkMode.isTransitioning & darkMode.isChanging && !active) {
      if (darkModeTimeoutRef.current != null) clearTimeout(darkModeTimeoutRef.current)

      darkModeTimeoutRef.current = setTimeout(
        () => {
          store.dispatch({ type: 'DARK_MODE_TRANSITION_START' })
        }
      , 1400)
    }
  }, [active, darkMode.isChanging])
  

  return null
}

export default App
