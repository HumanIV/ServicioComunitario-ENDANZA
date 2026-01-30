import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilInput } from '@coreui/icons'

// Usaremos el mismo favicon que el sidebar
const logoEndanza = "/favicon.png"

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div className="login-page-wrapper">
      {/* Círculos decorativos con los nuevos colores de la paleta */}
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <CContainer>
        <CRow className="min-vh-100 align-items-center justify-content-center">
          <CCol md={8} lg={6} xl={4}>
            <div className="login-brand text-center mb-4">
              <div className="sidebar-logo-circle-premium mx-auto mb-3">
                <img src={logoEndanza} alt="ENDANZA Logo" className="img-fluid" style={{ maxWidth: '85px' }} />
              </div>
              <h1 className="text-white h3 fw-medium mb-1">ENDANZA</h1>
              <p className="text-white-50 fw-regular small mb-0">Escuela Nacional de Danza</p>
            </div>

            <CCard className="premium-card border-0 overflow-hidden shadow-lg">
              <CCardBody className="p-4 bg-light-custom">
                <CForm onSubmit={handleLogin}>
                  <div className="mb-3">
                    <h2 className="fw-bold header-title-custom h5 mb-1">Bienvenido</h2>
                    <p className="text-muted-custom small mb-0">Ingresa tus datos para acceder.</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted-custom mb-1 ls-1">Usuario</label>
                    <CInputGroup>
                      <CInputGroupText className="bg-light-custom bg-opacity-25 border-end-0 py-1 border-light-custom">
                        <CIcon icon={cilUser} style={{ color: 'var(--primary-500)' }} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="ejemplo@usuario"
                        className="input-premium border-start-0 py-1 bg-light-custom border-light-custom"
                        required
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted-custom mb-1 ls-1">Contraseña</label>
                    <CInputGroup>
                      <CInputGroupText className="bg-light-custom bg-opacity-25 border-end-0 py-1 border-light-custom">
                        <CIcon icon={cilLockLocked} style={{ color: 'var(--primary-500)' }} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="••••••••"
                        className="input-premium border-start-0 py-1 bg-light-custom border-light-custom"
                        required
                      />
                    </CInputGroup>
                  </div>

                  <CButton
                    type="submit"
                    className="btn-premium w-100 py-2 mt-1 d-flex align-items-center justify-content-center fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <CIcon icon={cilInput} className="me-2" />
                    )}
                    {loading ? 'Cargando...' : 'ENTRAR'}
                  </CButton>

                  <div className="text-center mt-3">
                    <CButton color="link" className="p-0 text-decoration-none x-small text-muted-custom hover-orange">
                      ¿Olvidaste tu contraseña?
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
              <div className="card-footer-accent"></div>
            </CCard>

            <p className="text-center text-white-50 mt-3 small mb-0">
              &copy; {new Date().getFullYear()} Escuela Nacional de Danza.
            </p>
          </CCol>
        </CRow>
      </CContainer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        .login-page-wrapper {
          min-height: 100vh;
          background: #1a1c1e; /* Fondo oscuro neutral para que resalten los naranjas */
          position: relative;
          overflow: hidden;
          background-attachment: fixed;
        }

        .login-brand h1, 
        .login-brand p {
          font-family: 'Playfair Display', serif !important;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          opacity: 0.5;
        }

        .bg-circle-1 {
          width: 500px;
          height: 500px;
          background: var(--primary-500);
          top: -200px;
          right: -100px;
        }

        .bg-circle-2 {
          width: 400px;
          height: 400px;
          background: var(--primary-700);
          bottom: -150px;
          left: -100px;
        }

        .brand-logo {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
          border-radius: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(242, 140, 15, 0.3);
        }

        .premium-card {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-footer-accent {
          height: 6px;
          background: var(--primary-700);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Login