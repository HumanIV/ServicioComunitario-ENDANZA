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
import { cilSearch, cilUser, cilPencil, cilTrash, cilInfo } from '@coreui/icons'
import PropTypes from 'prop-types'

const StudentTable = ({
    loading,
    paginatedStudents,
    selectedStudents,
    handleSelectAll,
    handleSelectStudent,
    handleSort,
    sortConfig,
    openModal,
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
            <span className="ms-1 text-primary">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
        )
    }

    const StatusBadge = ({ status }) => {
        const isActivo = status === 'Activo'
        return (
            <CBadge className={`px-3 py-2 rounded-pill shadow-sm border ${isActivo
                ? 'bg-success bg-opacity-10 text-success border-success border-opacity-10'
                : 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-10'
                }`}>
                {status?.toUpperCase()}
            </CBadge>
        )
    }

    return (
        <div className="student-table-subcontainer">
            <div className="table-responsive">
                {loading ? (
                    <div className="text-center py-5">
                        <CSpinner color="primary" variant="grow" />
                        <p className="mt-3 fw-bold text-primary text-uppercase ls-1 small">Actualizando registros...</p>
                    </div>
                ) : (
                    <>
                        <CTable align="middle" className="mb-0 custom-premium-table border-0" hover responsive>
                            <CTableHead className="table-header-custom border-bottom">
                                <CTableRow>
                                    <CTableHeaderCell className="ps-4 py-3" width="50">
                                        <CFormCheck
                                            className="custom-check"
                                            checked={paginatedStudents.length > 0 && selectedStudents.length === paginatedStudents.length}
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
                                        onClick={() => handleSort('NombreEstudiante')}
                                        className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 cursor-pointer"
                                    >
                                        Estudiante <SortIcon columnKey="NombreEstudiante" />
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 d-mobile-none">Grado / Sección</CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 d-mobile-none">Representante</CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 d-mobile-none">Cédula</CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1">Estatus</CTableHeaderCell>
                                    <CTableHeaderCell className="py-3 text-muted-custom small fw-bold text-uppercase ls-1 text-end pe-4">Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>

                            <CTableBody className="border-0">
                                {paginatedStudents.length === 0 ? (
                                    <CTableRow>
                                        <CTableDataCell colSpan={8} className="text-center py-5">
                                            <div className="py-4">
                                                <CIcon icon={cilSearch} size="3xl" className="text-muted opacity-25 mb-3" />
                                                <h5 className="text-muted-custom fw-bold">No se encontraron resultados</h5>
                                                <p className="text-muted-custom small">Prueba ajustando los términos de búsqueda o filtros</p>
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                ) : (
                                    paginatedStudents.map((item) => (
                                        <CTableRow key={item.id} className="hover-row transition-all border-0">
                                            <CTableDataCell className="ps-4 border-bottom-light">
                                                <CFormCheck
                                                    className="custom-check"
                                                    checked={selectedStudents.includes(item.id)}
                                                    onChange={() => handleSelectStudent(item.id)}
                                                />
                                            </CTableDataCell>
                                            <CTableDataCell className="border-bottom-light d-mobile-none">
                                                <div className="fw-bold header-title-custom">#{item.id}</div>
                                                <div className="text-muted-custom" style={{ fontSize: '0.65rem' }}>MATRÍCULA</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="border-bottom-light">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-circle me-2 me-md-3 bg-orange-soft text-primary fw-bold shadow-sm flex-shrink-0" style={{ width: '35px', height: '35px', minWidth: '35px' }}>
                                                        {item.NombreEstudiante.charAt(0)}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="fw-bold header-title-custom text-truncate" style={{ maxWidth: '140px' }}>{item.NombreEstudiante} {item.ApellidoEstudiante}</div>
                                                        <div className="text-muted-custom small d-mobile-none" style={{ fontSize: '0.75rem' }}>{item.Email}</div>
                                                    </div>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="border-bottom-light d-mobile-none">
                                                <div className="fw-bold header-title-custom">{item.Grado}</div>
                                                <CBadge className="bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-2 small">
                                                    {item.Seccion}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell className="border-bottom-light d-mobile-none">
                                                <div className="header-title-custom fw-medium">{item.RepresentanteNombre} {item.RepresentanteApellido}</div>
                                                <div className="text-muted-custom small">{item.Telefono}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className="border-bottom-light d-mobile-none">
                                                <div className="header-title-custom fw-bold text-nowrap">
                                                    <span className="text-primary me-1">{item.RepresentanteCedula.split('-')[0]}-</span>
                                                    {item.RepresentanteCedula.split('-')[1]}
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="border-bottom-light">
                                                <StatusBadge status={item.Estatus} />
                                            </CTableDataCell>
                                            <CTableDataCell className="text-end pe-4 border-bottom-light">
                                                <CButtonGroup className="shadow-sm rounded-pill overflow-hidden border border-light table-action-group">
                                                    <CButton
                                                        color="light"
                                                        size="sm"
                                                        onClick={() => openModal("view", item)}
                                                        className="px-2 px-md-3 border-0 transition-all hover-primary action-btn-custom bg-transparent"
                                                        title="Ver perfil completo"
                                                    >
                                                        <CIcon icon={cilInfo} className="text-primary" />
                                                    </CButton>
                                                    <CButton
                                                        color="light"
                                                        size="sm"
                                                        onClick={() => openModal("edit", item)}
                                                        className="px-2 px-md-3 border-0 transition-all hover-warning action-btn-custom bg-transparent"
                                                        title="Editar datos"
                                                    >
                                                        <CIcon icon={cilPencil} className="text-primary" />
                                                    </CButton>
                                                    <CButton
                                                        color="light"
                                                        size="sm"
                                                        onClick={() => openModal("delete", item)}
                                                        className="px-2 px-md-3 border-0 transition-all hover-danger action-btn-custom bg-transparent d-mobile-none"
                                                        title="Eliminar registro"
                                                    >
                                                        <CIcon icon={cilTrash} className="text-primary" />
                                                    </CButton>
                                                </CButtonGroup>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                )}
                            </CTableBody>
                        </CTable>

                        <div className="d-flex justify-content-between align-items-center p-4 table-pagination-container border-top">
                            <div className="text-muted-custom small fw-medium">
                                Mostrando <span className="text-primary fw-bold">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalFiltered)}</span> de <span className="header-title-custom fw-bold">{totalFiltered}</span> estudiantes
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
                        <span className="small fw-bold text-uppercase ls-1">SINCRO: {new Date().toLocaleDateString()}</span>
                    </CCol>
                </CRow>
            </CCardFooter>


        </div>
    )
}

StudentTable.propTypes = {
    loading: PropTypes.bool,
    paginatedStudents: PropTypes.array,
    selectedStudents: PropTypes.array,
    handleSelectAll: PropTypes.func,
    handleSelectStudent: PropTypes.func,
    handleSort: PropTypes.func,
    sortConfig: PropTypes.object,
    openModal: PropTypes.func,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    startIndex: PropTypes.number,
    itemsPerPage: PropTypes.number,
    totalFiltered: PropTypes.number,
    totalStudents: PropTypes.number,
}

export default StudentTable