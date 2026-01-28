import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarHeader,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import { AppSidebarNav } from './AppSidebarNav'

import logoEndanza from '../assets/images/logo_endanza.png'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="sidebar-premium border-0"
      colorScheme="dark"
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-0 bg-transparent py-0 d-block position-relative">
        <div className="sidebar-logo-container text-center">
          <div className="sidebar-logo-circle">
            <img src={logoEndanza} alt="ENDANZA Logo" className="img-fluid" />
          </div>
          <div className="sidebar-header-title text-poppins fw-medium">ENDANZA</div>
          <div className="sidebar-header-subtitle text-arial fw-regular">Escuela Nacional de Danza</div>
        </div>
        <CCloseButton
          className="d-lg-none position-absolute top-0 end-0 m-2"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

