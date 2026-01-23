import React from 'react'
import { Link } from 'react-router-dom'
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
import { cilLockLocked, cilUser } from '@coreui/icons'
import fondo1 from '../../../assets/images/fondo1.jpg'
import fondo2 from '../../../assets/images/fondo2.jpg'
const Login = () => {
  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      style={{
        backgroundImage: `url(${fondo1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Overlay difuminado */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
        }}
      />
      
      <CContainer>
        <CRow className="justify-content-end"> {/* Cambiado a justify-content-end */}
          <CCol md={6} lg={5} xl={4}>
            <CCard className="p-4" style={{ position: 'relative', zIndex: 1 }}>
              <CCardBody>
                <CForm>
                  <div className="text-center mb-4">
                    <h1>Inicio de Sesión</h1>
                    <p className="text-body-secondary">Ingresa a tu cuenta</p>
                  </div>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Usuario" 
                      autoComplete="username" 
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      autoComplete="current-password"
                    />
                  </CInputGroup>

                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <CButton 
                        color="primary" 
                        className="w-100 py-2"
                      >
                        Iniciar Sesión
                      </CButton>
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol xs={12} className="text-center">
                      <CButton 
                        color="link" 
                        className="px-0 text-decoration-none"
                      >
                        ¿Olvidaste tu contraseña?
                      </CButton>
                    </CCol>
                  </CRow>

                  {/* Espacio para enlace de registro si es necesario */}
                  <div className="text-center mt-4">
                    <small className="text-body-secondary">
                      ¿No tienes una cuenta?{' '}
                      <Link to="/register" className="text-decoration-none">
                        Regístrate aquí
                      </Link>
                    </small>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login