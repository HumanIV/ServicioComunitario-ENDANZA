// components/profile/ProfileSummary.jsx
import React from "react"
import {
  CCard,
  CCardBody,
  CBadge
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilUser,
  cilEnvelopeClosed,
  cilBriefcase,
  cilCalendar,
  cilCheckCircle,
  cilShieldAlt
} from "@coreui/icons"

const ProfileSummary = ({ user }) => {
  const getRoleBadgeColor = (rol) => {
    switch(rol?.toLowerCase()) {
      case 'administrador':
        return 'danger'
      case 'docente':
        return 'warning'
      case 'representante':
        return 'info'
      case 'estudiante':
        return 'success'
      default:
        return 'primary'
    }
  }

  const getInitials = () => {
    const nombre = user?.nombre || ''
    const apellido = user?.apellido || ''
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  return (
    <CCard className="border-0 premium-card shadow-lg h-100 profile-summary">
      <CCardBody className="p-4 d-flex flex-column">
        <div className="text-center mb-4 position-relative">
          <div className="avatar-container position-relative d-inline-block">
            {user?.foto_usuario ? (
              <img 
                src={user.foto_usuario} 
                alt="Avatar"
                className="profile-avatar border border-4 border-white shadow-lg"
              />
            ) : (
              <div className="avatar-placeholder border border-4 border-white shadow-lg">
                <span className="avatar-initials">{getInitials()}</span>
              </div>
            )}
            <div className="status-indicator bg-success position-absolute"></div>
          </div>
          
          <h4 className="mt-3 mb-1 fw-bold">
            {user?.nombre} {user?.apellido}
          </h4>
          
          <div className="d-flex justify-content-center gap-2 mb-2 flex-wrap">
            <CBadge 
              color={getRoleBadgeColor(user?.rol)} 
              className="px-3 py-2 rounded-pill fw-semibold"
            >
              <CIcon icon={cilBriefcase} className="me-1" size="sm" />
              {user?.rol || 'Usuario'}
            </CBadge>
            
            <CBadge color="success" className="px-3 py-2 rounded-pill fw-semibold">
              <CIcon icon={cilCheckCircle} className="me-1" size="sm" />
              {user?.is_active === 'Activo' ? 'Activo' : 'Inactivo'}
            </CBadge>
          </div>
        </div>

        <div className="info-cards mt-2">
          <div className="info-item d-flex align-items-center p-3 mb-2 bg-light rounded-3">
            <div className="info-icon me-3">
              <CIcon icon={cilEnvelopeClosed} className="text-warning" size="lg" />
            </div>
            <div className="info-content">
              <small className="text-muted d-block text-uppercase fw-bold small">Correo Electrónico</small>
              <span className="fw-semibold">{user?.email || 'usuario@email.com'}</span>
            </div>
          </div>

          <div className="info-item d-flex align-items-center p-3 mb-2 bg-light rounded-3">
            <div className="info-icon me-3">
              <CIcon icon={cilCalendar} className="text-warning" size="lg" />
            </div>
            <div className="info-content">
              <small className="text-muted d-block text-uppercase fw-bold small">Fecha de Ingreso</small>
              <span className="fw-semibold">{user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'No registrada'}</span>
            </div>
          </div>

          <div className="info-item d-flex align-items-center p-3 bg-light rounded-3">
            <div className="info-icon me-3">
              <CIcon icon={cilShieldAlt} className="text-warning" size="lg" />
            </div>
            <div className="info-content">
              <small className="text-muted d-block text-uppercase fw-bold small">ID de Usuario</small>
              <span className="fw-semibold font-monospace">#{user?.id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </CCardBody>

      <style>{`
        .profile-summary {
          border-radius: 20px !important;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .profile-summary:hover {
          transform: translateY(-5px);
        }

        .avatar-container {
          position: relative;
        }

        .profile-avatar {
          width: 120px !important;
          height: 120px !important;
          border-radius: 50% !important;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .profile-avatar:hover {
          transform: scale(1.05);
        }

        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F28C0F 0%, #F8A13E 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 8px 20px rgba(242, 140, 15, 0.3);
        }

        .avatar-initials {
          color: white;
          font-size: 3rem;
          font-weight: 600;
          text-transform: uppercase;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .status-indicator {
          width: 20px;
          height: 20px;
          border: 3px solid white;
          border-radius: 50%;
          bottom: 8px;
          right: 8px;
          box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(46, 204, 113, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
          }
        }

        .info-item {
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .info-item:hover {
          background-color: var(--neutral-200) !important;
          border-color: var(--neutral-300);
          transform: translateX(5px);
        }

        .info-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        [data-coreui-theme="dark"] .profile-summary {
          background-color: #1e293b !important;
        }

        [data-coreui-theme="dark"] .info-item {
          background-color: rgba(255,255,255,0.05) !important;
        }

        [data-coreui-theme="dark"] .info-item:hover {
          background-color: rgba(255,255,255,0.1) !important;
        }

        [data-coreui-theme="dark"] .info-icon {
          background-color: #2d3a4f;
        }

        [data-coreui-theme="dark"] .text-muted {
          color: rgba(255,255,255,0.5) !important;
        }
      `}</style>
    </CCard>
  )
}

export default ProfileSummary