// src/components/AppHeaderDropdown.js - VERSIÓN CORREGIDA
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilSettings,
  cilLockLocked,
  cilAccountLogout,
} from '@coreui/icons'



// ✅ IMPORTAR authService, NO helpFetch
import { authService } from '../../services/authService'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = React.useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ✅ USAR authService.getProfile() - YA USA userAPI INTERNAMENTE
        const response = await authService.getProfile()
        
        if (response.success) {
          setUserData(response.user)
        }
      } catch (error) {
        console.error('❌ Error obteniendo datos del usuario:', error)
      }
    }

    if (localStorage.getItem('accessToken')) {
      fetchUserData()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login?logout=success')
    } catch (error) {
      console.error('❌ Error en logout:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  const getUserName = () => {
    if (userData) {
      return `${userData.nombre || ''} ${userData.apellido || ''}`.trim() || userData.username || 'Usuario'
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return `${user.nombre || ''} ${user.apellido || ''}`.trim() || user.username || 'Usuario'
    } catch {
      return 'Usuario'
    }
  }

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="py-0" caret={false}>

        <span className="ms-2 d-none d-md-inline">
          {getUserName()}
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          <CIcon icon={cilUser} className="me-2" />
          Mi Cuenta
        </CDropdownHeader>
        
        <CDropdownItem href="#/perfil">
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>


        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown