// src/components/header/AppHeaderDropdown.js - VERSIÓN RESTAURADA CON COLORES MEJORADOS
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'

import { authService } from '../../services/authService'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = React.useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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

  const getUserInfo = () => {
    const user = userData || JSON.parse(localStorage.getItem('user') || '{}')
    return {
      fullName: `${user.nombre || ''} ${user.apellido || ''}`.trim() || user.username || 'Usuario',
      role: (user.rol || 'Estudiante').toUpperCase()
    }
  }

  const user = getUserInfo()

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="py-0 d-flex align-items-center border-0 bg-transparent" caret={false}>
        <div className="d-flex flex-column text-end me-2">
          <span className="fw-bold text-white small lh-1">{user.fullName}</span>
          <span className="text-warning fw-bold extra-small mt-1" style={{ fontSize: '0.65rem' }}>{user.role}</span>
        </div>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0 shadow-lg border-0 overflow-hidden" style={{ minWidth: '200px', borderRadius: '12px' }}>
        <CDropdownHeader className="fw-bold py-3 text-white rounded-top d-flex align-items-center" style={{
          background: 'linear-gradient(45deg, #f39c12, #e67e22)',
          borderBottom: '2px solid rgba(0,0,0,0.05)'
        }}>
          <div className="bg-white bg-opacity-25 p-1 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
            <CIcon icon={cilUser} className="text-white" size="sm" />
          </div>
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Mi Cuenta</span>
        </CDropdownHeader>

        <CDropdownItem
          className="py-2"
          onClick={() => navigate('/perfil')}
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilUser} className="me-2 text-primary" />
          Perfil
        </CDropdownItem>

        <CDropdownItem
          className="py-2 text-danger"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>

      <style>{`
        .extra-small {
          letter-spacing: 0.5px;
        }
        .dropdown-item:hover {
          background-color: var(--neutral-100);
        }
        [data-coreui-theme="dark"] .dropdown-menu {
          background-color: var(--neutral-800);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        [data-coreui-theme="dark"] .dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: white;
        }
      `}</style>
    </CDropdown>
  )
}

export default AppHeaderDropdown