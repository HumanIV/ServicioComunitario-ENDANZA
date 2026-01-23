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
  CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'

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
    // Lógica para agregar nuevo usuario
    console.log('Agregar usuario:', nuevoUsuario)
    // Resetear formulario
    setNuevoUsuario({
      nombre: '',
      email: '',
      rol: 'secretaria',
      modulos: []
    })
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl" scrollable>
      <CModalHeader>
        <CModalTitle>Gestión de Accesos - Usuarios</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Nombre</CTableHeaderCell>
              <CTableHeaderCell>Rol</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Módulos</CTableHeaderCell>
              <CTableHeaderCell>Activo</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {usuarios.map((usuario) => (
              <CTableRow key={usuario.id}>
                <CTableDataCell>{usuario.nombre}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={usuario.rol === 'Secretaria' ? 'info' : 'success'}>
                    {usuario.rol}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{usuario.email}</CTableDataCell>
                <CTableDataCell>
                  <small>
                    {usuario.modulos.map(modulo => 
                      <CBadge color="light" className="me-1" key={modulo}>
                        {modulo}
                      </CBadge>
                    )}
                  </small>
                </CTableDataCell>
                <CTableDataCell>
                  <CFormCheck
                    checked={usuario.activo}
                    onChange={() => onToggleActivo(usuario.id)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="primary">
                    Editar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        
        <div className="mt-4">
          <h6>Agregar Nuevo Usuario</h6>
          <CForm className="row g-3">
            <CCol md={4}>
              <CFormInput 
                type="text" 
                placeholder="Nombre completo" 
                value={nuevoUsuario.nombre}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
              />
            </CCol>
            <CCol md={3}>
              <CFormInput 
                type="email" 
                placeholder="Email" 
                value={nuevoUsuario.email}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
              />
            </CCol>
            <CCol md={2}>
              <CFormSelect 
                value={nuevoUsuario.rol}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
              >
                <option value="secretaria">Secretaria</option>
                <option value="profesor">Profesor</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CButton 
                color="success" 
                className="w-100"
                onClick={handleAgregarUsuario}
              >
                <CIcon icon={cilUser} /> Agregar Usuario
              </CButton>
            </CCol>
          </CForm>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default GestionAccesosModal