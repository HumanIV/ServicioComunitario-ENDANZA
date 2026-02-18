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
    switch (rol?.toLowerCase()) {
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
    <CCard className="border-0 premium-card shadow-lg h-100 profile-summary overflow-hidden">
      <div className="premium-accent-stripe"></div>
      <CCardBody className="p-4 d-flex flex-column">
        <div className="text-center mb-4 position-relative pt-3">
          <div className="avatar-container position-relative d-inline-block">
            {user?.foto_usuario ? (
              <img
                src={user.foto_usuario}
                alt="Avatar"
                className="profile-avatar border border-4 border-white shadow-xl"
              />
            ) : (
              <div className="avatar-placeholder border border-4 border-white shadow-xl">
                <span className="avatar-initials">{getInitials()}</span>
              </div>
            )}
            <div className="status-indicator bg-success position-absolute"></div>
          </div>

          <h4 className="mt-4 mb-2 fw-bold ls-1 text-uppercase header-title-custom">
            {user?.nombre} {user?.apellido}
          </h4>

          <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
            <CBadge
              color={getRoleBadgeColor(user?.rol)}
              className="px-3 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center"
            >
              <CIcon icon={cilBriefcase} className="me-2" size="sm" />
              {user?.rol || 'Usuario'}
            </CBadge>

            <CBadge color="success" className="px-3 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center">
              <CIcon icon={cilCheckCircle} className="me-2" size="sm" />
              {user?.is_active === 'Activo' ? 'ACTIVO' : 'INACTIVO'}
            </CBadge>
          </div>
        </div>

        <div className="info-cards mt-2 space-y-3">
          <div className="info-item-premium d-flex align-items-center p-3 mb-3 rounded-4 shadow-sm border border-light-custom">
            <div className="info-icon-premium me-3">
              <CIcon icon={cilEnvelopeClosed} />
            </div>
            <div className="info-content-premium">
              <small className="text-muted-custom d-block text-uppercase fw-bold ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Correo Electrónico</small>
              <span className="fw-bold text-dark-custom">{user?.email || 'usuario@email.com'}</span>
            </div>
          </div>

          <div className="info-item-premium d-flex align-items-center p-3 mb-3 rounded-4 shadow-sm border border-light-custom">
            <div className="info-icon-premium me-3">
              <CIcon icon={cilCalendar} />
            </div>
            <div className="info-content-premium">
              <small className="text-muted-custom d-block text-uppercase fw-bold ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Fecha de Ingreso</small>
              <span className="fw-bold text-dark-custom">{user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'No registrada'}</span>
            </div>
          </div>

          <div className="info-item-premium d-flex align-items-center p-3 rounded-4 shadow-sm border border-light-custom">
            <div className="info-icon-premium me-3">
              <CIcon icon={cilShieldAlt} />
            </div>
            <div className="info-content-premium">
              <small className="text-muted-custom d-block text-uppercase fw-bold ls-1 mb-1" style={{ fontSize: '0.6rem' }}>Identificador Único</small>
              <span className="fw-bold text-dark-custom font-monospace ls-1">#{user?.id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </CCardBody>

      <style>{`
        .profile-summary {
          border-radius: 24px !important;
          background: var(--neutral-50) !important;
          position: relative;
        }

        .premium-accent-stripe {
          height: 6px;
          background: linear-gradient(90deg, #F28C0F 0%, #F8A13E 100%);
          width: 100%;
        }
        
        .avatar-placeholder {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F28C0F 0%, #fbbf24 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 12px 25px rgba(242, 140, 15, 0.25);
          border: 4px solid white !important;
        }

        .avatar-initials {
          color: white;
          font-size: 3.8rem;
          font-weight: 800;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          font-family: 'Public Sans', 'Inter', -apple-system, sans-serif;
          letter-spacing: -2px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .status-indicator {
          width: 24px;
          height: 24px;
          border: 4px solid white;
          border-radius: 50%;
          bottom: 10px;
          right: 12px;
          box-shadow: 0 0 15px rgba(46, 204, 113, 0.4);
        }

        .info-item-premium {
          background: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }

        .info-item-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.05) !important;
          border-color: #F28C0F !important;
        }

        .info-icon-premium {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(242, 140, 15, 0.1);
          color: #F28C0F;
          border-radius: 12px;
          font-size: 1.2rem;
        }

        .header-title-custom { color: #1e293b; letter-spacing: 0.5px; }
        .text-dark-custom { color: #334155; }
        .text-muted-custom { color: #64748b; opacity: 0.8; }
        .border-light-custom { border-color: rgba(0,0,0,0.05) !important; }

        [data-coreui-theme="dark"] .profile-summary { 
          background: rgba(30, 41, 59, 0.7) !important; 
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        [data-coreui-theme="dark"] .info-item-premium { 
          background: rgba(255, 255, 255, 0.03) !important; 
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        [data-coreui-theme="dark"] .info-item-premium:hover { 
          background: rgba(255, 255, 255, 0.06) !important; 
          border-color: #F28C0F !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
        }
        [data-coreui-theme="dark"] .info-icon-premium { background-color: rgba(242, 140, 15, 0.15); }
        [data-coreui-theme="dark"] .header-title-custom { color: #f8fafc; text-shadow: 0 0 20px rgba(255,255,255,0.05); }
        [data-coreui-theme="dark"] .text-dark-custom { color: #e2e8f0; }
        [data-coreui-theme="dark"] .text-muted-custom { color: #94a3b8; }
        [data-coreui-theme="dark"] .border-light-custom { border-color: rgba(255,255,255,0.05) !important; }
        [data-coreui-theme="dark"] .avatar-placeholder { border-color: #334155 !important; box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
        [data-coreui-theme="dark"] .status-indicator { border-color: #1e293b; }
      `}</style>
    </CCard>
  )
}

export default ProfileSummary