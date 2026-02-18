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
    <>
      <CDropdown variant="nav-item" alignment="end" className="premium-dropdown">
        <CDropdownToggle className="py-0 d-flex align-items-center dropdown-toggle-custom" caret={false}>
          <span className="user-name-text d-none d-md-inline fw-bold">
            {getUserName()}
          </span>
        </CDropdownToggle>

        <CDropdownMenu className="premium-dropdown-menu p-2 border-0 shadow-lg animate__animated animate__fadeIn">
          <CDropdownHeader className="dropdown-header-custom border-0 bg-transparent py-3 px-3 mb-2 rounded-3">
            <div className="d-flex align-items-center">
              <div className="header-icon-box me-3">
                <CIcon icon={cilUser} size="lg" />
              </div>
              <div>
                <span className="d-block fw-bold ls-1 text-uppercase mb-0" style={{ fontSize: '0.65rem', opacity: 0.6 }}>Cuenta Personal</span>
                <span className="d-block fw-bolder header-title-custom" style={{ fontSize: '0.9rem' }}>Mi Cuenta</span>
              </div>
            </div>
          </CDropdownHeader>

          <div className="dropdown-divider-custom mb-2"></div>

          <CDropdownItem
            href="#/perfil"
            className="dropdown-item-premium d-flex align-items-center py-2 px-3 rounded-3 mb-1"
          >
            <CIcon icon={cilUser} className="me-3 icon-accent" />
            <span className="fw-semibold">Perfil</span>
          </CDropdownItem>

          <CDropdownItem
            onClick={handleLogout}
            className="dropdown-item-premium logout-item d-flex align-items-center py-2 px-3 rounded-3 mt-1"
          >
            <CIcon icon={cilAccountLogout} className="me-3 icon-danger" />
            <span className="fw-semibold">Cerrar Sesión</span>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown