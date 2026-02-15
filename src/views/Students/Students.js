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
import { Link } from "react-router-dom"

// Componentes extraídos
import StudentStats from "./components/StudentStats"
import StudentFilters from "./components/StudentFilters"
import StudentTable from "./components/StudentTable"
import StudentModals from "./components/StudentModals"

import { listStudents } from "../../services/students"

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

  // ---------------------- TOAST ---------------------- //
  const [toasts, setToasts] = useState([])
  const showToast = (type, title, message) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, title, message, delay: 3000 }])
  }

  // ---------------------- MODAL ---------------------- //
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  // ---------------------- EFECTOS ---------------------- //
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const data = await listStudents()
      // Adaptamos el formato del backend al que usa el componente (o viceversa)
      // El backend devuelve: id, first_name, last_name, full_name, dni, birth_date, gender, grade_level, dance_level, school, insurance, representative, representative_phone, representative_email

      const adaptedData = data.map(s => ({
        id: s.id,
        Grado: s.grade_level || "No asignado",
        Seccion: "Única", // O s.section_name si el backend lo incluyera
        NombreEstudiante: s.name || s.first_name || s.NombreEstudiante || "Sin Nombre",
        ApellidoEstudiante: s.lastName || s.last_name || s.ApellidoEstudiante || "",
        RepresentanteNombre: s.RepresentanteNombre || (s.representative ? s.representative.split(' ')[0] : "N/A"),
        RepresentanteApellido: s.RepresentanteApellido || (s.representative ? s.representative.split(' ').slice(1).join(' ') : ""),
        RepresentanteCedula: s.RepresentanteCedula || "V-00000000",
        Estatus: s.status || s.Estatus || "Activo",
        FechaInscripcion: s.entryDate || s.FechaInscripcion || "2024-01-01",
        Telefono: s.Telelfono || s.representative_phone || "N/A",
        Email: s.Email || s.representative_email || "N/A"
      }))

      setStudents(adaptedData)
    } catch (error) {
      console.error("Error fetching students:", error)
      showToast("danger", "Error", "No se pudieron cargar los estudiantes")
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- LOGICA DE FILTRADO Y ORDENACIÓN ---------------------- //
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
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [students, sortConfig])

  const filteredStudents = sortedStudents.filter((s) => {
    const matchSearch = `${s.NombreEstudiante} ${s.ApellidoEstudiante} ${s.RepresentanteNombre} ${s.RepresentanteApellido} ${s.RepresentanteCedula}`
      .toLowerCase().includes(searchText.toLowerCase())
    const matchGrade = filterGrade ? s.Grado === filterGrade : true
    const matchSection = filterSection ? s.Seccion === filterSection : true
    return matchSearch && matchGrade && matchSection
  })

  // ---------------------- PAGINACIÓN ---------------------- //
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  // ---------------------- FUNCIONES DE ACCIÓN ---------------------- //
  const openModal = (type, item = null) => {
    setModalType(type)
    setSelectedItem(item)
    setModalVisible(true)
  }

  const deleteItem = async () => {
    try {
      const response = await deleteStudent(selectedItem.id)
      if (response && response.ok) {
        setStudents(prev => prev.filter((s) => s.id !== selectedItem.id))
        showToast("success", "Éxito", "Estudiante eliminado correctamente")
      } else {
        throw new Error(response?.msg || "Error al eliminar")
      }
    } catch (error) {
      console.error("Error deleting student:", error)
      showToast("danger", "Error", "No se pudo eliminar al estudiante")
    } finally {
      setModalVisible(false)
    }
  }

  const handleSelectStudent = (id) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id])
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0) setSelectedStudents([])
    else setSelectedStudents(paginatedStudents.map(s => s.id))
  }

  const handleDeleteSelected = () => {
    setStudents(students.filter(s => !selectedStudents.includes(s.id)))
    setSelectedStudents([])
    showToast("success", "Éxito", `${selectedStudents.length} estudiantes eliminados`)
    setModalVisible(false)
  }

  const clearFilters = () => {
    setSearchText("")
    setFilterGrade("")
    setFilterSection("")
    setCurrentPage(1)
    showToast("info", "Filtros", "Filtros limpiados")
  }

  return (
    <CContainer fluid className="py-4 profile-container pb-5">
      {/* Encabezado de Página */}
      <CRow className="mb-4 align-items-center no-print">
        <CCol xs={12} md={6}>
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-primary rounded-circle shadow-sm">
              <CIcon icon={cilPeople} size="xl" className="text-white" />
            </div>
            <div>
              <h2 className="mb-0 fw-bold header-title-custom">Gestión de Estudiantes</h2>
              <p className="text-muted-custom small mb-0 text-uppercase ls-1">Centro de Administración Académica</p>
            </div>
          </div>
        </CCol>
        <CCol xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <div className="d-flex justify-content-md-end gap-2">
            <CButton color="light" variant="outline" className="border-2 rounded-pill px-3 fw-bold header-title-custom hover-orange shadow-sm" onClick={() => window.print()}>
              <CIcon icon={cilPrint} className="me-2 text-primary" />Imprimir
            </CButton>
            <CButton color="light" variant="outline" className="border-2 rounded-pill px-3 fw-bold header-title-custom hover-orange shadow-sm" onClick={() => showToast("info", "Exportar", "Generando reporte...")}>
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

      {/* Tarjetas de Estadísticas */}
      <StudentStats
        total={students.length}
        actives={students.filter(s => s.Estatus === 'Activo').length}
        filtered={filteredStudents.length}
        selected={selectedStudents.length}
      />

      {/* Tarjeta Unificada: Filtros + Tabla */}
      <CCard className="premium-card border-0 mb-4 shadow-sm overflow-hidden unified-dashboard-card">
        <div className="card-filters-area p-4 border-bottom">
          <StudentFilters
            searchText={searchText} setSearchText={setSearchText}
            filterGrade={filterGrade} setFilterGrade={setFilterGrade}
            filterSection={filterSection} setFilterSection={setFilterSection}
            clearFilters={clearFilters}
            showAdvancedFilters={showAdvancedFilters} setShowAdvancedFilters={setShowAdvancedFilters}
            setLoading={setLoading}
            selectedCount={selectedStudents.length}
            onOpenDeleteMultiple={() => openModal('delete-multiple')}
          />
        </div>
        <CCardBody className="p-0">
          <StudentTable
            loading={loading}
            paginatedStudents={paginatedStudents}
            selectedStudents={selectedStudents}
            handleSelectAll={handleSelectAll}
            handleSelectStudent={handleSelectStudent}
            handleSort={handleSort}
            sortConfig={sortConfig}
            openModal={openModal}
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

      <StudentModals
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
        selectedItem={selectedItem}
        selectedCount={selectedStudents.length}
        onDelete={deleteItem}
        onDeleteMultiple={handleDeleteSelected}
      />

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