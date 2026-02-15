// StudentTable.jsx
import React from 'react'
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormCheck,
    CBadge,
    CButtonGroup,
    CButton,
    CSpinner,
    CPagination,
    CPaginationItem,
    CCardFooter,
    CProgress,
    CRow,
    CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilUser, cilPencil, cilTrash, cilInfo,cilCircle } from '@coreui/icons'
import PropTypes from 'prop-types'

const StudentTable = ({
    loading,
    students,
    selectedStudents,
    handleSelectAll,
    handleSelectStudent,
    handleSort,
    sortConfig,
    onView,
    onEdit,
    onDelete,
    totalPages,
    currentPage,
    setCurrentPage,
    startIndex,
    itemsPerPage,
    totalFiltered,
    totalStudents
}) => {
    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return null
        return (
            <span className="ms-1 text-primary">
                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
            </span>
        )
    }

    const StatusBadge = ({ status }) => {
        const isActivo = status === 'active' || status === 'Activo'
        return (
            <CBadge className={`px-3 py-2 rounded-pill shadow-sm border ${
                isActivo
                    ? 'bg-success bg-opacity-10 text-success border-success border-opacity-10'
                    : 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-10'
            }`}>
                {isActivo ? 'ACTIVO' : 'INACTIVO'}
            </CBadge>
        )
    }

    const getRepresentanteInfo = (student) => {
        return {
            nombre: student.representative || 'N/A',
            telefono: student.representative_phone || 'N/A',
            email: student.representative_email || 'N/A'
        }
    }

    const getSeccionActual = (student) => {
        return student.sections && student.sections.length > 0 
            ? student.sections[0].section_name 
            : 'Sin asignar'
    }

    return (
        <div className="student-table-subcontainer">
            <div className="table-responsive">
                {loading ? (
                    <div className="text-center py-5">
                        <CSpinner color="primary" variant="grow" />
                        <p className="mt-3 fw-bold text-primary text-uppercase ls-1 small">
                            Actualizando registros...
                        </p>
                    </div>
                ) : (
                    <>
                        <CTable align="middle" className="mb-0 custom-premium-table border-0" hover responsive>
                            <CTableHead className="table-header-custom border-bottom">
                                <CTableRow>
                                    <CTableHeaderCell className="ps-4 py-3" width="50">
                                        <CFormCheck
                                            className="custom-check"
                                            checked={students.length > 0 && selectedStudents.length === students.length}
                                            onChange={handleSelectAll}
                                        />
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                        onClick={() => handleSort('id')}
                                        className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 cursor-pointer d-mobile-none"
                                    >
                                        ID <SortIcon columnKey="id" />
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                        onClick={() => handleSort('first_name')}
                                        className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 cursor-pointer"
                                    >
                                        Estudiante <SortIcon columnKey="first_name" />
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 d-mobile-none">
                                        Grado / Sección
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 d-mobile-none">
                                        Representante
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 d-mobile-none">
                                        Cédula
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1">
                                        Estatus
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 text-end pe-4">
                                        Acciones
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>

                            <CTableBody className="border-0">
                                {students.length === 0 ? (
                                    <CTableRow>
                                        <CTableDataCell colSpan={8} className="text-center py-5">
                                            <div className="py-4">
                                                <CIcon icon={cilSearch} size="3xl" className="text-muted opacity-25 mb-3" />
                                                <h5 className="text-muted-custom fw-bold">No se encontraron resultados</h5>
                                                <p className="text-muted-custom small">
                                                    Prueba ajustando los términos de búsqueda o filtros
                                                </p>
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                ) : (
                                    students.map((student) => {
                                        const representante = getRepresentanteInfo(student)
                                        const seccionActual = getSeccionActual(student)
                                        
                                        return (
                                            <CTableRow key={student.id} className="hover-row transition-all border-0">
                                                <CTableDataCell className="ps-4 border-bottom-light">
                                                    <CFormCheck
                                                        className="custom-check"
                                                        checked={selectedStudents.includes(student.id)}
                                                        onChange={() => handleSelectStudent(student.id)}
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell className="border-bottom-light d-mobile-none">
                                                    <div className="fw-bold header-title-custom">#{student.id}</div>
                                                    <div className="text-muted-custom" style={{ fontSize: '0.65rem' }}>
                                                        MATRÍCULA
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="border-bottom-light">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-circle me-2 me-md-3 bg-orange-soft text-primary fw-bold shadow-sm flex-shrink-0">
                                                            {student.first_name?.charAt(0) || '?'}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="fw-bold header-title-custom text-truncate">
                                                                {student.first_name} {student.last_name}
                                                            </div>
                                                            <div className="text-muted-custom small d-mobile-none">
                                                                {student.dni}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="border-bottom-light d-mobile-none">
                                                    <div className="fw-bold header-title-custom">
                                                        {student.grade_level || 'N/A'}
                                                    </div>
                                                    <CBadge className="bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-2 small">
                                                        {seccionActual}
                                                    </CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell className="border-bottom-light d-mobile-none">
                                                    <div className="header-title-custom fw-medium">
                                                        {representante.nombre}
                                                    </div>
                                                    <div className="text-muted-custom small">
                                                        {representante.telefono}
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="border-bottom-light d-mobile-none">
                                                    <div className="header-title-custom fw-bold text-nowrap">
                                                        {student.dni || 'N/A'}
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="border-bottom-light">
                                                    <StatusBadge status={student.status} />
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end pe-4 border-bottom-light">
                                                    <CButtonGroup className="shadow-sm rounded-pill overflow-hidden border border-light table-action-group">
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => onView(student.id)}
                                                            className="px-2 px-md-3 border-0 transition-all hover-primary action-btn-custom bg-transparent"
                                                            title="Ver perfil completo"
                                                        >
                                                            <CIcon icon={cilCircle} className="text-primary" />
                                                        </CButton>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => onEdit(student)}
                                                            className="px-2 px-md-3 border-0 transition-all hover-warning action-btn-custom bg-transparent"
                                                            title="Editar datos"
                                                        >
                                                            <CIcon icon={cilPencil} className="text-primary" />
                                                        </CButton>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => onDelete(student)}
                                                            className="px-2 px-md-3 border-0 transition-all hover-danger action-btn-custom bg-transparent d-mobile-none"
                                                            title="Eliminar registro"
                                                        >
                                                            <CIcon icon={cilTrash} className="text-primary" />
                                                        </CButton>
                                                    </CButtonGroup>
                                                </CTableDataCell>
                                            </CTableRow>
                                        )
                                    })
                                )}
                            </CTableBody>
                        </CTable>

                        {/* Paginación */}
                        <div className="d-flex justify-content-between align-items-center p-4 table-pagination-container border-top">
                            <div className="text-muted-custom small fw-medium">
                                Mostrando <span className="text-primary fw-bold">
                                    {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalFiltered)}
                                </span> de <span className="header-title-custom fw-bold">{totalFiltered}</span> estudiantes
                            </div>
                            {totalPages > 1 && (
                                <CPagination size="sm" className="mb-0 custom-pagination">
                                    <CPaginationItem
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="cursor-pointer"
                                    >
                                        Anterior
                                    </CPaginationItem>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <CPaginationItem
                                            key={i}
                                            active={currentPage === i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className="cursor-pointer"
                                        >
                                            {i + 1}
                                        </CPaginationItem>
                                    ))}

                                    <CPaginationItem
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="cursor-pointer"
                                    >
                                        Siguiente
                                    </CPaginationItem>
                                </CPagination>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Footer con progreso */}
            <CCardFooter className="stats-footer-custom border-0 p-4 no-print rounded-bottom-4">
                <CRow className="align-items-center">
                    <CCol xs={12} md={6} className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1 me-3">
                                <CProgress
                                    value={(totalFiltered / totalStudents) * 100}
                                    style={{ height: '6px' }}
                                    className="progress-bg-custom"
                                    color="primary"
                                />
                            </div>
                            <small className="text-muted-custom text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>
                                FILTRO: {totalFiltered}/{totalStudents}
                            </small>
                        </div>
                    </CCol>
                    <CCol xs={12} md={6} className="text-md-end text-muted-custom">
                        <CIcon icon={cilUser} className="me-2 text-primary" />
                        <span className="small fw-bold text-uppercase ls-1">
                            SINCRO: {new Date().toLocaleDateString()}
                        </span>
                    </CCol>
                </CRow>
            </CCardFooter>
        </div>
    )
}

StudentTable.propTypes = {
    loading: PropTypes.bool,
    students: PropTypes.array,
    selectedStudents: PropTypes.array,
    handleSelectAll: PropTypes.func,
    handleSelectStudent: PropTypes.func,
    handleSort: PropTypes.func,
    sortConfig: PropTypes.object,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    startIndex: PropTypes.number,
    itemsPerPage: PropTypes.number,
    totalFiltered: PropTypes.number,
    totalStudents: PropTypes.number,
}

export default StudentTable