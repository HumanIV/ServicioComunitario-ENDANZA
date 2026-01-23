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

const Register = () => {
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
        <CRow className="justify-content-end">
          <CCol md={6} lg={5} xl={4}>
            <CCard className="p-4" style={{ position: 'relative', zIndex: 1 }}>
              <CCardBody>
                <CForm>
                  <div className="text-center mb-4">
                    <h1>Registro</h1>
                    <p className="text-body-secondary">Crea tu cuenta</p>
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

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput 
                      placeholder="Correo electrónico" 
                      autoComplete="email" 
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repetir contraseña"
                      autoComplete="new-password"
                    />
                  </CInputGroup>

                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <CButton 
                        color="success" 
                        className="w-100 py-2"
                      >
                        Crear Cuenta
                      </CButton>
                    </CCol>
                  </CRow>

                  <div className="text-center mt-4">
                    <small className="text-body-secondary">
                      ¿Ya tienes una cuenta?{' '}
                      <Link to="/login" className="text-decoration-none">
                        Inicia sesión aquí
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

export default Register