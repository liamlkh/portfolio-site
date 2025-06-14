import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import store from '@/store'
import { Switch, Route, useLocation } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { isMobile } from 'react-device-detect'

import history from './history'

import Home from '@/pages/Home'
import Works from '@/pages/Works'
import Cursor from '@/components/Cursor'
import NavBar from '@/components/NavBar'
import DarkButton from '@/components/DarkButton'

const Routes = () => {

  const defaultLocation = useLocation()
  const location = useSelector(state => state.location.current)
  const isDark = useSelector(state => state.darkMode.isOn)

  useEffect(() => {
    store.dispatch({ type: 'INIT_LOCATION', location: defaultLocation })
  }, [])

  useEffect(() => {
    if (defaultLocation?.pathname != location?.pathname) {
      store.dispatch({ type: 'SET_LOCATION_REQUEST', location: defaultLocation })
      document.body.classList.add("is-route-changing")

      if (! (!isDark && defaultLocation?.pathname == '/works') ) { // except home light to work
        setTimeout(() => store.dispatch({ type: 'SET_LOCATION' }), 800)
      }
    }
  }, [defaultLocation])

  useEffect(() => {
    setTimeout(() => document.body.classList.remove("is-route-changing"), 400)
  }, [location])

  return (
    <Switch location={location ?? defaultLocation}>
      <Route exact path={["/", "/about"]} component={Home} />
      <Route path="/works" component={Works} />
    </Switch>
  )
}

export default function Router() {

  return (
    <ConnectedRouter history={history}>
      <Routes/>
      <NavBar/>
      {/* <DarkButton/> */}
      {!isMobile && <Cursor/>}
    </ConnectedRouter>
  )
}
