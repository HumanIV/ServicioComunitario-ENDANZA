import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CFormCheck,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CCol,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilShieldAlt, cilPlus, cilPencil, cilLockLocked } from '@coreui/icons'

const GestionAccesosModal = ({
  visible,
  onClose,
  usuarios,
  onToggleActivo
}) => {
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'secretaria',
    modulos: []
  })

  const handleAgregarUsuario = () => {
    console.log('Agregar usuario:', nuevoUsuario)
    setNuevoUsuario({
      nombre: '',
      email: '',
      rol: 'secretaria',
      modulos: []
    })
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl" scrollable backdrop="static">
      <div className="bg-primary" style={{ height: '6px', borderTopLeftRadius: 'var(--cui-modal-border-radius)', borderTopRightRadius: 'var(--cui-modal-border-radius)' }}></div>
      <CModalHeader className="bg-white border-bottom py-3 px-4">
        <CModalTitle className="fw-bold d-flex align-items-center text-dark">
          <CIcon icon={cilShieldAlt} className="me-2 text-primary" size="xl" />
          Gestión de Accesos y Usuarios
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="p-4">

        <div className="table-responsive rounded-3 overflow-hidden shadow-sm border mb-5">
          <CTable align="middle" hover className="mb-0 border-secondary-subtle">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell className="ps-4 py-3">Usuario</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Rol de Acceso</CTableHeaderCell>
                <CTableHeaderCell>Módulos Permitidos</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                <CTableHeaderCell className="pe-4 text-end">Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {usuarios.map((usuario) => (
                <CTableRow key={usuario.id}>
                  <CTableDataCell className="ps-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-orange-soft p-2 rounded-circle me-3 text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                        {usuario.nombre[0]}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{usuario.nombre}</div>
                        <small className="text-muted">{usuario.email}</small>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CBadge color={usuario.rol === 'Secretaria' ? 'info' : 'success'} className="px-3 py-2 rounded-pill fw-bold text-white text-uppercase" style={{ fontSize: '0.7rem' }}>
                      {usuario.rol}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex flex-wrap gap-1">
                      {usuario.modulos.map(modulo =>
                        <CBadge color="dark" className="border text-white fw-bold px-2 py-1" key={modulo} style={{ fontSize: '0.65rem' }}>
                          {modulo.toUpperCase()}
                        </CBadge>
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CFormCheck
                      className="form-check-premium"
                      checked={usuario.activo}
                      onChange={() => onToggleActivo(usuario.id)}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="pe-4 text-end">
                    <CButton size="sm" variant="ghost" color="primary" className="rounded-pill p-1 px-2 border">
                      <CIcon icon={cilPencil} size="sm" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>

        <div className="bg-light p-4 rounded-4 border">
          <h5 className="fw-bold mb-4 d-flex align-items-center text-dark text-uppercase ls-1">
            <CIcon icon={cilPlus} className="me-2 text-primary" />
            Vincular Nuevo Usuario
          </h5>
          <CForm>
            <CRow className="g-3">
              <CCol md={4}>
                <CFormInput
                  type="text"
                  placeholder="Nombre completo"
                  value={nuevoUsuario.nombre}
                  onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                  className="bg-white border-0 py-2 shadow-sm"
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="email"
                  placeholder="Email institucional"
                  value={nuevoUsuario.email}
                  onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                  className="bg-white border-0 py-2 shadow-sm"
                />
              </CCol>
              <CCol md={2}>
                <CFormSelect
                  value={nuevoUsuario.rol}
                  onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                  className="bg-white border-0 py-2 shadow-sm"
                >
                  <option value="secretaria">Secretaria</option>
                  <option value="profesor">Profesor</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CButton
                  onClick={handleAgregarUsuario}
                  className="btn-premium w-100 py-2 fw-bold d-flex align-items-center justify-content-center"
                >
                  <CIcon icon={cilUser} className="me-2" /> CREAR ACCESO
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </div>
      </CModalBody>
      <CModalFooter className="border-0 bg-light p-4">
        <CButton color="secondary" variant="ghost" onClick={onClose} className="fw-bold">
          CERRAR GESTIÓN
        </CButton>
      </CModalFooter>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .bg-orange-soft { background-color: rgba(242, 140, 15, 0.12); }
        .btn-premium {
          background: linear-gradient(135deg, #F28C0F 0%, #E07B00 100%);
          border: none;
          color: white;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .btn-premium:hover { filter: brightness(1.1); transform: translateY(-1px); color: white; }
        .form-check-premium .form-check-input:checked {
          background-color: #F28C0F;
          border-color: #F28C0F;
        }
      `}</style>
    </CModal>
  )
}

export default GestionAccesosModal