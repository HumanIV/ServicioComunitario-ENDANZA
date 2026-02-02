import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  // Obtener datos del usuario desde localStorage
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return {
          name: user.nombre || user.name || 'Usuario',
          email: user.email || 'usuario@email.com',
          role: user.rol || user.role || 'Usuario',
          avatar: user.avatar || avatar8
        }
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error)
    }
    
    // Datos por defecto si no hay usuario en localStorage
    return {
      name: 'Arianna Amaya',
      email: 'arianna.amaya@endanza.edu',
      role: 'Personal Docente',
      avatar: avatar8
    }
  }

  const userData = getUserData()

  const handleLogout = () => {
    // 1. Mostrar confirmación (opcional)
    const confirmLogout = window.confirm('¿Estás seguro de que deseas cerrar sesión?')
    if (!confirmLogout) return

    // 2. Limpiar localStorage (eliminar todos los datos de autenticación)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    // 3. También limpiar sessionStorage si lo estás usando
    sessionStorage.clear()
    
    // 4. Opcional: Limpiar cookies relacionadas con autenticación
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
    
    // 5. Redirigir a login con parámetro de logout exitoso
    navigate('/login?logout=success')
    
    // 6. Opcional: Forzar recarga completa para limpiar estado de la app
    // window.location.reload()
    
    console.log('✅ Sesión cerrada exitosamente')
  }

  // Función para manejar clic en "Mi Perfil"
  const handleProfileClick = () => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('accessToken')
    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/login?session=expired')
      return
    }
    
    // Si está autenticado, redirigir al perfil
    navigate('/profile')
  }

  // Función para manejar clic en "Configuración"
  const handleSettingsClick = () => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('accessToken')
    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/login?session=expired')
      return
    }
    
    // Si está autenticado, redirigir a configuración
    navigate('/settings')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0 d-flex align-items-center gap-2 border-0" caret={false}>
        <div className="d-none d-md-block text-end me-2">
          <div className="fw-bold header-user-name small leading-tight mb-0">{userData.name}</div>
          <div className="header-user-role" style={{ fontSize: '0.65rem' }}>{userData.role}</div>
        </div>
        <div className="avatar-wrapper position-relative">
          <CAvatar src={userData.avatar} size="md" className="border border-2 border-white shadow-sm" />
          <div className="status-indicator bg-success position-absolute"></div>
        </div>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0 shadow-lg border-0 rounded-4 mt-2 overflow-hidden animate-fade-in premium-dropdown-menu" placement="bottom-end" style={{ minWidth: '220px' }}>
        <CDropdownHeader className="dropdown-header-premium border-bottom p-3 mb-2">
          <div className="d-flex align-items-center">
            <CAvatar src={userData.avatar} size="md" className="me-3" />
            <div>
              <div className="fw-bold dropdown-user-name">{userData.name}</div>
              <div className="dropdown-user-email small" style={{ fontSize: '0.7rem' }}>{userData.email}</div>
            </div>
          </div>
        </CDropdownHeader>

        <CDropdownItem
          className="dropdown-item-premium py-2 px-3"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilUser} className="me-2 text-primary" />
          Mi Perfil Personal
        </CDropdownItem>

        <CDropdownItem
          className="dropdown-item-premium py-2 px-3"
          onClick={handleSettingsClick}
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilSettings} className="me-2 text-muted" />
          Configuración Cuenta
        </CDropdownItem>

        <CDropdownDivider className="mx-2" />

        <CDropdownItem
          className="dropdown-item-premium py-2 px-3 text-danger fw-bold"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <CIcon icon={cilAccountLogout} className="me-2 text-danger" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>

      <style>{`
        .header-user-name { color: var(--neutral-800); }
        .header-user-role { color: var(--neutral-500); }
        .dropdown-user-name { color: var(--neutral-800); }
        .dropdown-user-email { color: var(--neutral-500); }
        .dropdown-header-premium { background-color: var(--neutral-100); }

        [data-coreui-theme="dark"] .header-user-name { color: white; }
        [data-coreui-theme="dark"] .header-user-role { color: rgba(255,255,255,0.5); }
        [data-coreui-theme="dark"] .dropdown-user-name { color: white; }
        [data-coreui-theme="dark"] .dropdown-user-email { color: rgba(255,255,255,0.5); }
        [data-coreui-theme="dark"] .dropdown-header-premium { background-color: rgba(0,0,0,0.2) !important; }
        [data-coreui-theme="dark"] .premium-dropdown-menu { background-color: #1e293b !important; border: 1px solid rgba(255,255,255,0.05) !important; }

        .avatar-wrapper {
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .avatar-wrapper:hover {
          transform: scale(1.05);
        }
        .status-indicator {
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-radius: 50%;
          bottom: 2px;
          right: 2px;
          box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
        }
        .leading-tight { line-height: 1.1; }
        .dropdown-item-premium {
          border-radius: 8px !important;
          margin: 4px 8px !important;
          width: auto !important;
        }
        .dropdown-item-premium:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        [data-coreui-theme="dark"] .dropdown-item-premium:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </CDropdown>
  )
}

export default AppHeaderDropdown