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
import logoPersonalizado from '../../../assets/images/Minect.JPG'
import logoUnefa from '../../../assets/images/unefa.png'

const Login = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
          <CRow className="justify-content-center">
          <CCol md={6} lg={5} xl={4}>
            <CCard className="p-4 text-center">
            {/* ⭐ CONTENEDOR DE LOGOS ACOMODADOS ⭐ */}
            <div className="d-flex justify-content-between "
            >
              <img
                src={logoPersonalizado}
                alt="Logo Minect"
                style={{
                  height: "100px",
                  width: "100px",
                  objectFit: "contain",
                }}
                className="justify-content-start"
              />

              <img
                src={logoUnefa}
                alt="Logo Unefa"
                style={{
                  height: "100px",
                  width: "100px",
                  objectFit: "contain",
                }}
                className="justify-content-end"
              />
            </div>
              <CCardBody>
                <CForm>
                  <h1>Inicio de Sesion </h1>
                  <p className="text-body-secondary">Inicia en tu cuenta</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Username" autoComplete="username" />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={6}>
                      
                      <CButton color="primary" className="px-4">
                        Login
                      </CButton>
                    
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <CButton color="link" className="px-0">
                        ¿Olvidaste la contraseña?
                      </CButton>
                    </CCol>
                  </CRow>
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
