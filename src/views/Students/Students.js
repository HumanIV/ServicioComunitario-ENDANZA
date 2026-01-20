import React, { useEffect, useState, useMemo } from "react"
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CBadge,
  CSpinner,
  CPagination,
  CPaginationItem,
  CProgress,
  CFormCheck
} from "@coreui/react"

import CIcon from "@coreui/icons-react"
import { 
  cilBook, 
  cilTrash, 
  cilUser, 
  cilSearch, 
  cilFilterX,
  cilPencil,
  cibPlayerMe,
  cilPrint,
  cilCloudDownload,
  cilReload,
  cilPlus
} from "@coreui/icons"
import { Link } from "react-router-dom"

const Students = () => {
  // ---------------------- ESTADOS ---------------------- //
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [filterGrade, setFilterGrade] = useState("")
  const [filterSection, setFilterSection] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' })

  // ---------------------- DATOS ESTÁTICOS ---------------------- //
  const staticStudents = [
    {
      id: 1,
      Grado: "1er Grado",
      Seccion: "D1",
      NombreEstudiante: "María",
      ApellidoEstudiante: "González",
      RepresentanteNombre: "Ana",
      RepresentanteApellido: "González",
      RepresentanteCedula: "V-12345678",
      Estatus: "Activo",
      FechaInscripcion: "2024-01-15",
      Telefono: "0412-5551234",
      Email: "maria.gonzalez@example.com"
    },
    {
      id: 2,
      Grado: "2do Grado",
      Seccion: "D2",
      NombreEstudiante: "Carlos",
      ApellidoEstudiante: "Pérez",
      RepresentanteNombre: "José",
      RepresentanteApellido: "Pérez",
      RepresentanteCedula: "V-98765432",
      Estatus: "Activo",
      FechaInscripcion: "2024-01-10",
      Telefono: "0414-5555678",
      Email: "carlos.perez@example.com"
    },
    {
      id: 3,
      Grado: "3er Grado",
      Seccion: "D2",
      NombreEstudiante: "Lucía",
      ApellidoEstudiante: "Ramírez",
      RepresentanteNombre: "Carmen",
      RepresentanteApellido: "Ramírez",
      RepresentanteCedula: "V-56789123",
      Estatus: "Inactivo",
      FechaInscripcion: "2024-01-05",
      Telefono: "0424-5559101",
      Email: "lucia.ramirez@example.com"
    },
    {
      id: 4,
      Grado: "1er Grado",
      Seccion: "D1",
      NombreEstudiante: "Juan",
      ApellidoEstudiante: "Martínez",
      RepresentanteNombre: "Pedro",
      RepresentanteApellido: "Martínez",
      RepresentanteCedula: "V-23456789",
      Estatus: "Activo",
      FechaInscripcion: "2024-01-20",
      Telefono: "0416-5551122",
      Email: "juan.martinez@example.com"
    }
  ]

  // ---------------------- TOAST ---------------------- //
  const [toasts, setToasts] = useState([])
  const showToast = (type, title, message) => {
    setToasts((prev) => [...prev, { 
      id: Date.now(), 
      type, 
      title, 
      message,
      delay: 3000 
    }])
  }

  // ---------------------- MODAL ---------------------- //
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  // ---------------------- EFECTOS ---------------------- //
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStudents(staticStudents)
      setLoading(false)
    }, 800)
  }, [])

  // ---------------------- FUNCIONES DE ORDENACIÓN ---------------------- //
  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedStudents = useMemo(() => {
    const sortableItems = [...students]
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [students, sortConfig])

  // ---------------------- FILTRADO ---------------------- //
  const filteredStudents = sortedStudents.filter((s) => {
    const matchSearch = `${s.NombreEstudiante} ${s.ApellidoEstudiante} ${s.RepresentanteNombre} ${s.RepresentanteApellido} ${s.RepresentanteCedula}`
      .toLowerCase()
      .includes(searchText.toLowerCase())

    const matchGrade = filterGrade ? s.Grado === filterGrade : true
    const matchSection = filterSection ? s.Seccion === filterSection : true

    return matchSearch && matchGrade && matchSection
  })

  // ---------------------- PAGINACIÓN ---------------------- //
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  // ---------------------- FUNCIONES DE ACCIÓN ---------------------- //
  const openModal = (type, item = null) => {
    setModalType(type)
    setSelectedItem(item)
    setModalVisible(true)
  }

  const deleteItem = () => {
    const newList = students.filter((s) => s.id !== selectedItem.id)
    setStudents(newList)
    showToast("success", "Éxito", "Estudiante eliminado correctamente")
    setModalVisible(false)
  }

  const handleSelectStudent = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) 
        ? prev.filter(studentId => studentId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(paginatedStudents.map(s => s.id))
    }
  }

  const handleDeleteSelected = () => {
    const newList = students.filter(s => !selectedStudents.includes(s.id))
    setStudents(newList)
    setSelectedStudents([])
    showToast("success", "Éxito", `${selectedStudents.length} estudiantes eliminados`)
  }

  const handleExport = () => {
    showToast("info", "Exportar", "Generando archivo de exportación...")
    // Lógica de exportación aquí
  }

  const handlePrint = () => {
    window.print()
  }

  const clearFilters = () => {
    setSearchText("")
    setFilterGrade("")
    setFilterSection("")
    setCurrentPage(1)
    showToast("info", "Filtros", "Filtros limpiados")
  }

  // ---------------------- RENDER ---------------------- //
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null
    return (
      <CIcon 
        icon={sortConfig.direction === 'ascending' ? '↑' : '↓'} 
        className="ms-1"
        size="sm"
      />
    )
  }

  const StatusBadge = ({ status }) => {
    const color = status === 'Activo' ? 'success' : 'secondary'
    return <CBadge color={color}>{status}</CBadge>
  }

  return (
    <>
      {/* HEADER CON ESTADÍSTICAS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-0 d-flex align-items-center">
            <CIcon icon={cilUser} className="me-2" size="xl" />
            Gestión de Estudiantes
          </h1>
          <p className="text-muted">Administra y visualiza la información de los estudiantes</p>
        </div>
        
        <div className="d-flex gap-2">
          <CButton 
            color="light" 
            variant="outline"
            onClick={handlePrint}
          >
            <CIcon icon={cilPrint} className="me-2" />
            Imprimir
          </CButton>
          <CButton 
            color="light" 
            variant="outline"
            onClick={handleExport}
          >
            <CIcon icon={cilCloudDownload} className="me-2" />
            Exportar
          </CButton>
          <Link to="/inscripcion">
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-2" />
              Nuevo Estudiante
            </CButton>
          </Link>
        </div>
      </div>

      <CContainer fluid>

        {/* TARJETAS DE RESUMEN */}
        <CRow className="mb-4">
          <CCol xs={12} md={3}>
            <CCard className="border-primary border-top-3">
              <CCardBody className="py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-0">Total Estudiantes</h6>
                    <h4 className="mb-0">{students.length}</h4>
                  </div>
                  <div className=" text-primary rounded p-3">
                    <CIcon icon={cilUser} size="xl" />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          
          <CCol xs={12} md={3}>
            <CCard className="border-success border-top-3">
              <CCardBody className="py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-0">Activos</h6>
                    <h4 className="mb-0">
                      {students.filter(s => s.Estatus === 'Activo').length}
                    </h4>
                  </div>
                  <div className="avatar bg-success-light text-success rounded p-3">
                    <CIcon icon={cilUser} size="xl" />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol xs={12} md={3}>
            <CCard className="border-info border-top-3">
              <CCardBody className="py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-0">Mostrados</h6>
                    <h4 className="mb-0">{filteredStudents.length}</h4>
                  </div>
                  <div className="avatar bg-info-light text-info rounded p-3">
                    <CIcon icon={cibPlayerMe} size="xl" />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol xs={12} md={3}>
            <CCard className="border-warning border-top-3">
              <CCardBody className="py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-0">Seleccionados</h6>
                    <h4 className="mb-0">{selectedStudents.length}</h4>
                  </div>
                  <div className="avatar bg-warning-light text-warning rounded p-3">
                    <CIcon icon={cilBook} size="xl" />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* BARRA DE HERRAMIENTAS */}
        <CCard className="mb-4">
          <CCardBody>
            <CRow className="g-3 align-items-center">
              <CCol xs={12} md={6} lg={4}>
                <div className="input-group">
                  <span className="input-group-text  border-end-0">
                    <CIcon icon={cilSearch} />
                  </span>
                  <CFormInput
                    placeholder="Buscar estudiantes..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="border-start-0"
                  />
                </div>
              </CCol>

              <CCol xs={12} md={6} lg={2}>
                <CFormSelect
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                >
                  <option value="">Todos los grados</option>
                  {[...Array(8)].map((_, i) => (
                    <option key={i}>{`${i + 1}er Grado`}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={6} lg={2}>
                <CFormSelect
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                >
                  <option value="">Todas las secciones</option>
                  {['D1', 'D2', 'D3', 'D4', 'D5'].map((sec) => (
                    <option key={sec}>{sec}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={6} lg={4} className="d-flex gap-2">
                <CButton 
                  color="secondary" 
                  variant="outline" 
                  onClick={clearFilters}
                  className="d-flex align-items-center"
                >
                  <CIcon icon={cilFilterX} className="me-2" />
                  Limpiar
                </CButton>
                
                <CButton 
                  color="light" 
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <CIcon icon={cilSearch} className="me-2" />
                  Filtros Avanzados
                </CButton>

                <CButton 
                  color="light" 
                  variant="outline"
                  onClick={() => {
                    setLoading(true)
                    setTimeout(() => setLoading(false), 500)
                  }}
                >
                  <CIcon icon={cilReload} />
                </CButton>
              </CCol>
            </CRow>

            {/* FILTROS AVANZADOS */}
            {showAdvancedFilters && (
              <div className="mt-3 p-3 border rounded">
                <CRow className="g-3">
                  <CCol xs={12} md={4}>
                    <label className="form-label">Estatus</label>
                    <CFormSelect>
                      <option>Todos</option>
                      <option>Activo</option>
                      <option>Inactivo</option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <label className="form-label">Fecha desde</label>
                    <CFormInput type="date" />
                  </CCol>
                  <CCol xs={12} md={4}>
                    <label className="form-label">Fecha hasta</label>
                    <CFormInput type="date" />
                  </CCol>
                </CRow>
              </div>
            )}

            {/* ACCIONES MASIVAS */}
            {selectedStudents.length > 0 && (
              <div className="mt-3 p-3  rounded d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold">{selectedStudents.length} estudiantes seleccionados</span>
                </div>
                <div className="d-flex gap-2">
                  <CButton 
                    color="danger" 
                    size="sm"
                    onClick={() => openModal('delete-multiple', null)}
                  >
                    <CIcon icon={cilTrash} className="me-2" />
                    Eliminar seleccionados
                  </CButton>
                  <CButton color="secondary" size="sm" variant="outline">
                    <CIcon icon={cilCloudDownload} className="me-2" />
                    Exportar seleccionados
                  </CButton>
                </div>
              </div>
            )}  
          </CCardBody>
        </CCard>

        {/* TABLA */}
        <CCard>
          <CCardBody className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
                <p className="mt-2">Cargando estudiantes...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <CTable hover striped align="middle" className="mb-0">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell width="50">
                          <CFormCheck
                            checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                            onChange={handleSelectAll}
                          />
                        </CTableHeaderCell>
                        <CTableHeaderCell 
                          onClick={() => handleSort('id')}
                          style={{ cursor: 'pointer' }}
                        >
                          ID <SortIcon columnKey="id" />
                        </CTableHeaderCell>
                        <CTableHeaderCell 
                          onClick={() => handleSort('NombreEstudiante')}
                          style={{ cursor: 'pointer' }}
                        >
                          Estudiante <SortIcon columnKey="NombreEstudiante" />
                        </CTableHeaderCell>
                        <CTableHeaderCell>Grado/Sección</CTableHeaderCell>
                        <CTableHeaderCell>Representante</CTableHeaderCell>
                        <CTableHeaderCell>Cédula</CTableHeaderCell>
                        <CTableHeaderCell>Estatus</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Acciones</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {paginatedStudents.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan={8} className="text-center py-5">
                            <CIcon icon={cilSearch} size="xl" className="text-muted mb-3" />
                            <h5>No se encontraron estudiantes</h5>
                            <p className="text-muted">
                              {searchText || filterGrade || filterSection 
                                ? "Intenta con otros filtros" 
                                : "No hay estudiantes registrados"}
                            </p>
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        paginatedStudents.map((item) => (
                          <CTableRow key={item.id}>
                            <CTableDataCell>
                              <CFormCheck
                                checked={selectedStudents.includes(item.id)}
                                onChange={() => handleSelectStudent(item.id)}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="fw-bold">#{item.id}</div>
                              <small className="text-muted">Matrícula</small>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="fw-bold">
                                {item.NombreEstudiante} {item.ApellidoEstudiante}
                              </div>
                              <small className="text-muted">{item.Email}</small>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="fw-bold">{item.Grado}</div>
                              <CBadge color="primary">{item.Seccion}</CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{item.RepresentanteNombre} {item.RepresentanteApellido}</div>
                              <small className="text-muted">{item.Telefono}</small>
                            </CTableDataCell>
                            <CTableDataCell>
                              <code>{item.RepresentanteCedula}</code>
                            </CTableDataCell>
                            <CTableDataCell>
                              <StatusBadge status={item.Estatus} />
                            </CTableDataCell>
                            <CTableDataCell className="text-end">
                              <CButtonGroup>
                                <CButton
                                  color="info"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openModal("view", item)}
                                  title="Ver detalles"
                                >
                                  <CIcon icon={cibPlayerMe} />
                                </CButton>
                                <CButton
                                  color="warning"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openModal("edit", item)}
                                  title="Editar"
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openModal("delete", item)}
                                  title="Eliminar"
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CButtonGroup>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      )}
                    </CTableBody>
                  </CTable>
                </div>

                {/* PAGINACIÓN */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <div className="text-muted">
                      Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredStudents.length)} de {filteredStudents.length} estudiantes
                    </div>
                    <CPagination>
                      <CPaginationItem 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </CPaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <CPaginationItem
                          key={i}
                          active={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </CPaginationItem>
                      ))}
                      
                      <CPaginationItem 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </CPaginationItem>
                    </CPagination>
                  </div>
                )}
              </>
            )}
          </CCardBody>
          
          <CCardFooter className="text-muted d-flex justify-content-between">
            <div>
              <CProgress 
                value={(filteredStudents.length / students.length) * 100} 
                className="w-100"
                color="primary"
              />
              <small>Filtrado: {filteredStudents.length} de {students.length}</small>
            </div>
            <div>
              <small>
                Última actualización: {new Date().toLocaleDateString()}
              </small>
            </div>
          </CCardFooter>
        </CCard>
      </CContainer>

      {/* TOASTER MEJORADO */}
      <CToaster placement="top-end" className="p-3">
        {toasts.map((t) => (
          <CToast 
            key={t.id} 
            autohide={t.delay} 
            delay={t.delay} 
            color={t.type} 
            visible
            className="border-0 shadow"
          >
            <CToastHeader closeButton className={`bg-${t.type} text-white`}>
              <strong className="me-auto">{t.title}</strong>
            </CToastHeader>
            <CToastBody >
              {t.message}
            </CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* MODAL DE DETALLES MEJORADO */}
      <CModal 
        size="lg" 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>
            {modalType === "view" && (
              <>
                <CIcon icon={cibPlayerMe} className="me-2" />
                Detalles del Estudiante
              </>
            )}
            {modalType === "edit" && (
              <>
                <CIcon icon={cilPencil} className="me-2" />
                Editar Estudiante
              </>
            )}
            {modalType === "delete" && (
              <>
                <CIcon icon={cilTrash} className="me-2" />
                Confirmar Eliminación
              </>
            )}
            {modalType === "delete-multiple" && (
              <>
                <CIcon icon={cilTrash} className="me-2" />
                Eliminar Múltiples Estudiantes
              </>
            )}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          {modalType === "view" && selectedItem && (
            <CRow>
              <CCol xs={12} className="text-center mb-3">
                <div className="avatar bg-primary rounded-circle p-4 d-inline-flex">
                  <CIcon icon={cilUser} size="xl" className="text-white" />
                </div>
                <h4 className="mt-3">
                  {selectedItem.NombreEstudiante} {selectedItem.ApellidoEstudiante}
                </h4>
                <StatusBadge status={selectedItem.Estatus} />
              </CCol>
              
              <CCol xs={12} md={6}>
                <h6 className="text-muted mb-2">Información Personal</h6>
                <p><strong>Grado:</strong> {selectedItem.Grado}</p>
                <p><strong>Sección:</strong> <CBadge color="primary">{selectedItem.Seccion}</CBadge></p>
                <p><strong>Email:</strong> {selectedItem.Email}</p>
                <p><strong>Teléfono:</strong> {selectedItem.Telefono}</p>
              </CCol>
              
              <CCol xs={12} md={6}>
                <h6 className="text-muted mb-2">Información del Representante</h6>
                <p><strong>Nombre:</strong> {selectedItem.RepresentanteNombre} {selectedItem.RepresentanteApellido}</p>
                <p><strong>Cédula:</strong> <code>{selectedItem.RepresentanteCedula}</code></p>
                <p><strong>Fecha de Inscripción:</strong> {selectedItem.FechaInscripcion}</p>
              </CCol>
            </CRow>
          )}

          {modalType === "delete" && selectedItem && (
            <div className="text-center">
              <div className="avatar bg-danger rounded-circle p-3 mb-3 d-inline-flex">
                <CIcon icon={cilTrash} size="xl" className="text-white" />
              </div>
              <h5>¿Estás seguro de eliminar este estudiante?</h5>
              <p className="text-muted">
                Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al estudiante:
              </p>
              <div className="alert alert-danger">
                <strong>{selectedItem.NombreEstudiante} {selectedItem.ApellidoEstudiante}</strong><br />
                <small>Matrícula: #{selectedItem.id} • Grado: {selectedItem.Grado}</small>
              </div>
            </div>
          )}

          {modalType === "delete-multiple" && (
            <div className="text-center">
              <div className="avatar bg-danger rounded-circle p-3 mb-3 d-inline-flex">
                <CIcon icon={cilTrash} size="xl" className="text-white" />
              </div>
              <h5>¿Eliminar {selectedStudents.length} estudiantes?</h5>
              <p className="text-muted">
                Esta acción eliminará permanentemente {selectedStudents.length} estudiantes seleccionados.
              </p>
              <div className="alert alert-danger">
                <strong>¡Atención!</strong> Esta acción no se puede deshacer.
              </div>
            </div>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setModalVisible(false)}
          >
            Cancelar
          </CButton>
          
          {modalType === "view" && (
            <Link to={`/PerfilStudents/${selectedItem?.id}`}>
              <CButton 
                color="primary"
                onClick={() => setModalVisible(false)}
              >
                Ver perfil completo
              </CButton>
            </Link>
          )}
          
          {modalType === "delete" && (
            <CButton 
              color="danger" 
              onClick={deleteItem}
            >
              Sí, eliminar
            </CButton>
          )}
          
          {modalType === "delete-multiple" && (
            <CButton 
              color="danger" 
              onClick={handleDeleteSelected}
            >
              Sí, eliminar {selectedStudents.length} estudiantes
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Students