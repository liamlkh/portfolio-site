import React from 'react'
import { Link } from 'react-router-dom'

import {
  NavBarContainer,
} from './styles'


export default function NavBar() {

  const NavButton = ({ target }) => {

    return (
      <Link to={`/${target}`} className='button' >
        <span>{target == '' ? 'home' : target}</span>
      </Link>
    )
  }
 
  return (
    <NavBarContainer>
      <NavButton target=''/>
      <NavButton target='about'/>
      <NavButton target='works'/>
    </NavBarContainer>
  )
}
