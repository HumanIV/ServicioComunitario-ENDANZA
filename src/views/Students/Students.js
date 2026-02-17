// Students.jsx
import React, { useEffect, useState, useMemo } from "react"
import {
  CContainer,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilPrint,
  cilCloudDownload,
  cilPlus,
  cilPeople
} from "@coreui/icons"
import { Link, useNavigate } from "react-router-dom"

// Servicios
import { listStudents, deleteStudent } from 'src/services/studentsService'

// Componentes
import StudentStats from "./components/StudentStats"
import StudentFilters from "./components/StudentFilters"
import StudentTable from "./components/StudentTable"
import StudentModals from "./components/StudentModals"

const Students = () => {
  const navigate = useNavigate()
  
  // Estados
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [filterGrade, setFilterGrade] = useState("")
  const [filterSection, setFilterSection] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' })

  // Toast
  const [toasts, setToasts] = useState([])
  const showToast = (type, title, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, title, message, delay: 3000 }])
  }

  // Modal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  // Cargar datos
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const data = await listStudents()
      setStudents(data)
    } catch (error) {
      showToast("danger", "Error", "No se pudieron cargar los estudiantes")
    } finally {
      setLoading(false)
    }
  }

  // Ordenamiento
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
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]
        
        // Manejar campos anidados
        if (sortConfig.key === 'representative') {
          aValue = a.representative || ''
          bValue = b.representative || ''
        }
        
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [students, sortConfig])

  // Filtrado
  const filteredStudents = sortedStudents.filter((s) => {
    const searchLower = searchText.toLowerCase()
    
    const fullText = `
      ${s.first_name || ''} 
      ${s.last_name || ''} 
      ${s.representative || ''} 
      ${s.dni || ''} 
      ${s.representative_phone || ''}
    `.toLowerCase()
    
    const matchSearch = searchText === '' || fullText.includes(searchLower)
    
    const matchGrade = filterGrade ? s.grade_level === filterGrade : true
    const matchSection = filterSection ? 
      s.sections?.some(sec => sec.section_name === filterSection) : true
    
    return matchSearch && matchGrade && matchSection
  })

  // Paginación
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  // Acciones
  const openModal = (type, item = null) => {
    setModalType(type)
    setSelectedItem(item)
    setModalVisible(true)
  }

  const viewStudent = (id) => {
    navigate(`/students/${id}`)
  }

  const deleteItem = async () => {
    try {
      await deleteStudent(selectedItem.id)
      setStudents(students.filter((s) => s.id !== selectedItem.id))
      showToast("success", "Éxito", "Estudiante eliminado correctamente")
      setModalVisible(false)
    } catch (error) {
      showToast("danger", "Error", "No se pudo eliminar el estudiante")
    }
  }

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedStudents) {
        await deleteStudent(id)
      }
      setStudents(students.filter(s => !selectedStudents.includes(s.id)))
      setSelectedStudents([])
      showToast("success", "Éxito", `${selectedStudents.length} estudiantes eliminados`)
      setModalVisible(false)
    } catch (error) {
      showToast("danger", "Error", "Error al eliminar estudiantes")
    }
  }

  const handleSelectStudent = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(paginatedStudents.map(s => s.id))
    }
  }

  const clearFilters = () => {
    setSearchText("")
    setFilterGrade("")
    setFilterSection("")
    setCurrentPage(1)
    showToast("info", "Filtros", "Filtros limpiados")
  }

  // Datos para filtros
  const gradosUnicos = [...new Set(students.map(s => s.grade_level).filter(Boolean))]
  const seccionesUnicas = [...new Set(
    students.flatMap(s => s.sections?.map(sec => sec.section_name) || [])
  )].filter(Boolean)

  // Estadísticas
  const estudiantesActivos = students.filter(s => s.status === 'active' || s.status === 'Activo').length

  return (
    <CContainer fluid className="py-4 profile-container pb-5">
      {/* Header */}
      <CRow className="mb-4 align-items-center no-print">
        <CCol xs={12} md={6}>
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-primary rounded-circle shadow-sm">
              <CIcon icon={cilPeople} size="xl" className="text-white" />
            </div>
            <div>
              <h2 className="mb-0 fw-bold header-title-custom">Gestión de Estudiantes</h2>
              <p className="text-muted-custom small mb-0 text-uppercase ls-1">
                Centro de Administración Académica
              </p>
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <div className="d-flex justify-content-md-end gap-2">
            <CButton 
              color="light" 
              variant="outline" 
              className="border-2 rounded-pill px-3 fw-bold header-title-custom hover-orange shadow-sm" 
              onClick={() => window.print()}
            >
              <CIcon icon={cilPrint} className="me-2 text-primary" />Imprimir
            </CButton>
            <CButton 
              color="light" 
              variant="outline" 
              className="border-2 rounded-pill px-3 fw-bold header-title-custom hover-orange shadow-sm" 
              onClick={() => showToast("info", "Exportar", "Generando reporte...")}
            >
              <CIcon icon={cilCloudDownload} className="me-2 text-primary" />Exportar
            </CButton>
            <Link to="/inscripcion">
              <CButton className="btn-premium">
                <CIcon icon={cilPlus} className="me-2" />NUEVA INSCRIPCIÓN
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      {/* Stats */}
      <StudentStats
        total={students.length}
        actives={estudiantesActivos}
        filtered={filteredStudents.length}
        selected={selectedStudents.length}
      />

      {/* Filtros + Tabla */}
      <CCard className="premium-card border-0 mb-4 shadow-sm overflow-hidden unified-dashboard-card">
        <div className="card-filters-area p-4 border-bottom">
          <StudentFilters
            searchText={searchText}
            setSearchText={setSearchText}
            filterGrade={filterGrade}
            setFilterGrade={setFilterGrade}
            filterSection={filterSection}
            setFilterSection={setFilterSection}
            gradosDisponibles={gradosUnicos}
            seccionesDisponibles={seccionesUnicas}
            clearFilters={clearFilters}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            setLoading={setLoading}
            selectedCount={selectedStudents.length}
            onOpenDeleteMultiple={() => openModal('delete-multiple')}
            onRefresh={fetchStudents}
          />
        </div>
        <CCardBody className="p-0">
          <StudentTable
            loading={loading}
            students={paginatedStudents}
            selectedStudents={selectedStudents}
            handleSelectAll={handleSelectAll}
            handleSelectStudent={handleSelectStudent}
            handleSort={handleSort}
            sortConfig={sortConfig}
            onView={viewStudent}
            onEdit={(student) => openModal('edit', student)}
            onDelete={(student) => openModal('delete', student)}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            totalFiltered={filteredStudents.length}
            totalStudents={students.length}
          />
        </CCardBody>
      </CCard>

      {/* Modales */}
      <StudentModals
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
        selectedItem={selectedItem}
        selectedCount={selectedStudents.length}
        onDelete={deleteItem}
        onDeleteMultiple={handleDeleteSelected}
        onView={viewStudent}
      />

      {/* Toaster */}
      <CToaster placement="top-end">
        {toasts.map((t) => (
          <CToast key={t.id} autohide delay={t.delay} color={t.type} visible className="border-0 shadow-lg">
            <CToastHeader closeButton className={`bg-${t.type} text-white`}>
              <strong className="me-auto">{t.title}</strong>
            </CToastHeader>
            <CToastBody className="fw-medium">{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      <style>{`
        @media print { .no-print { display: none !important; } }
      `}</style>
    </CContainer>
  )
}

export default Students