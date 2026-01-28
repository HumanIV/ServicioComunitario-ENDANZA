import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { cilLockLocked, cilUser, cilEnvelopeClosed, cilCheckCircle } from '@coreui/icons'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleRegister = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/login')
    }, 1500)
  }

  return (
    <div className="login-page-wrapper">
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <CContainer>
        <CRow className="min-vh-100 align-items-center justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <div className="login-brand text-center mb-5">
              <div className="brand-logo mb-3">
                <CIcon icon={cilUser} size="xxl" className="text-white" />
              </div>
              <h1 className="text-white fw-bold display-5">ENDANZA</h1>
              <p className="text-white-50 fs-5">Solicitud de Acceso</p>
            </div>

            <CCard className="premium-card border-0 overflow-hidden">
              <CCardBody className="p-5">
                <CForm onSubmit={handleRegister}>
                  <div className="mb-4">
                    <h2 className="fw-bold text-dark">Crear Cuenta</h2>
                    <p className="text-muted">Completa los datos para registrarte en el sistema.</p>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Usuario</label>
                    <CInputGroup>
                      <CInputGroupText className="bg-white border-end-0">
                        <CIcon icon={cilUser} className="text-primary" />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Nombre de usuario"
                        className="input-premium border-start-0 py-2"
                        required
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Correo Electrónico</label>
                    <CInputGroup>
                      <CInputGroupText className="bg-white border-end-0">
                        <CIcon icon={cilEnvelopeClosed} className="text-primary" />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="ejemplo@correo.com"
                        className="input-premium border-start-0 py-2"
                        required
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Contraseña</label>
                    <CInputGroup>
                      <CInputGroupText className="bg-white border-end-0">
                        <CIcon icon={cilLockLocked} className="text-primary" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Crea una contraseña"
                        className="input-premium border-start-0 py-2"
                        required
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Confirmar Contraseña</label>
                    <CInputGroup>
                      <CInputGroupText className="bg-white border-end-0">
                        <CIcon icon={cilCheckCircle} className="text-primary" />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Repite tu contraseña"
                        className="input-premium border-start-0 py-2"
                        required
                      />
                    </CInputGroup>
                  </div>

                  <CButton
                    type="submit"
                    className="btn-premium w-100 py-3 mt-2 d-flex align-items-center justify-content-center"
                    disabled={loading}
                    style={{ background: 'linear-gradient(135deg, var(--success), #059669)' }}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <CIcon icon={cilCheckCircle} className="me-2" />
                    )}
                    {loading ? 'Procesando...' : 'Registrarse'}
                  </CButton>

                  <div className="text-center mt-5">
                    <p className="text-muted small">
                      ¿Ya tienes una cuenta? {' '}
                      <Link to="/login" className="text-primary fw-bold text-decoration-none hover-underline">
                        Inicia Sesión
                      </Link>
                    </p>
                  </div>
                </CForm>
              </CCardBody>
              <div className="card-footer-accent" style={{ background: 'linear-gradient(90deg, var(--success), var(--info))' }}></div>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <style>{`
        .login-page-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at top right, #064e3b, #020617);
          position: relative;
          overflow: hidden;
          background-attachment: fixed;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          opacity: 0.3;
        }

        .bg-circle-1 {
          width: 400px;
          height: 400px;
          background: var(--success);
          top: -100px;
          left: -100px;
        }

        .bg-circle-2 {
          width: 500px;
          height: 500px;
          background: var(--info);
          bottom: -150px;
          right: -150px;
        }

        .brand-logo {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .premium-card {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-footer-accent {
          height: 6px;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Register