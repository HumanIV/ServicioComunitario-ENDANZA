import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarHeader,
  CHeaderToggler,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import { AppSidebarNav } from './AppSidebarNav'

// Usaremos el favicon como logo sin fondo
const logoEndanza = "/favicon.png"


const AppSidebar = ({ navigation = [] }) => { // RECIBE navigation COMO PROP, con valor por defecto array vacío
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme')
  
  // Agrega un log para depurar
  console.log('🔄 AppSidebar - Navegación recibida:', navigation)
  console.log('📊 Total de items en navegación:', navigation?.length)

  return (
    <CSidebar
      className="sidebar-premium border-0"
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-0 bg-transparent py-0 d-block position-relative">
        <div className="sidebar-logo-container text-center">
          <div className="sidebar-logo-circle-premium">
            <img src={logoEndanza} alt="ENDANZA Logo" className="img-fluid" style={{ maxWidth: '85px' }} />
          </div>
          <div className="sidebar-header-title text-poppins fw-bold mt-2">ENDANZA</div>
          <div className="sidebar-header-subtitle text-arial fw-medium">Escuela Nacional de Danza</div>
        </div>
        <CCloseButton
          className="d-lg-none position-absolute top-0 end-0 m-2"
          dark={colorMode === 'dark'}
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* USA LA PROP navigation EN LUGAR DE LA IMPORTACIÓN DIRECTA */}
      <AppSidebarNav items={navigation || []} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)