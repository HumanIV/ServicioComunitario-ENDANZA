import React from 'react'
import {
    CCard,
    CCardBody,
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
            <span className="ms-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
        )
    }

    const StatusBadge = ({ status }) => {
        const color = status === 'Activo' ? 'success' : 'secondary'
        return (
            <CBadge color={color} className="px-3 py-2 rounded-pill shadow-sm bg-opacity-10 text-success border border-success border-opacity-10">
                {status.toUpperCase()}
            </CBadge>
        )
    }

    return (
        <CCard className="premium-card border-0 overflow-hidden shadow-sm">
            <CCardBody className="p-0">
                {loading ? (
                    <div className="text-center py-5">
                        <CSpinner color="primary" variant="grow" />
                        <p className="mt-3 fw-bold text-primary text-uppercase ls-1 small">Actualizando registros...</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <CTable align="middle" className="mb-0 custom-table">
                                <CTableHead className="bg-light bg-opacity-50">
                                    <CTableRow>
                                        <CTableHeaderCell className="ps-4" width="50">
                                            <CFormCheck
                                                className="custom-check"
                                                checked={paginatedStudents.length > 0 && selectedStudents.length === paginatedStudents.length}
                                                onChange={handleSelectAll}
                                            />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell
                                            onClick={() => handleSort('id')}
                                            className="py-3 text-muted small fw-bold text-uppercase ls-1 cursor-pointer"
                                        >
                                            ID <SortIcon columnKey="id" />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell
                                            onClick={() => handleSort('NombreEstudiante')}
                                            className="py-3 text-muted small fw-bold text-uppercase ls-1 cursor-pointer"
                                        >
                                            Estudiante <SortIcon columnKey="NombreEstudiante" />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="py-3 text-muted small fw-bold text-uppercase ls-1">Grado / Sección</CTableHeaderCell>
                                        <CTableHeaderCell className="py-3 text-muted small fw-bold text-uppercase ls-1">Representante</CTableHeaderCell>
                                        <CTableHeaderCell className="py-3 text-muted small fw-bold text-uppercase ls-1">Cédula</CTableHeaderCell>
                                        <CTableHeaderCell className="py-3 text-muted small fw-bold text-uppercase ls-1">Estatus</CTableHeaderCell>
                                        <CTableHeaderCell className="py-3 text-muted small fw-bold text-uppercase ls-1 text-end pe-4">Acciones</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>

                                <CTableBody>
                                    {paginatedStudents.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan={8} className="text-center py-5">
                                                <div className="py-4">
                                                    <CIcon icon={cilSearch} size="3xl" className="text-muted opacity-25 mb-3" />
                                                    <h5 className="text-muted fw-bold">No se encontraron resultados</h5>
                                                    <p className="text-muted small">Prueba ajustando los términos de búsqueda o filtros</p>
                                                </div>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        paginatedStudents.map((item) => (
                                            <CTableRow key={item.id} className="hover-row transition-all">
                                                <CTableDataCell className="ps-4">
                                                    <CFormCheck
                                                        className="custom-check"
                                                        checked={selectedStudents.includes(item.id)}
                                                        onChange={() => handleSelectStudent(item.id)}
                                                    />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="fw-bold text-dark">#{item.id}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>MATRÍCULA</div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-circle me-3 bg-orange-soft text-primary fw-bold">
                                                            {item.NombreEstudiante.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{item.NombreEstudiante} {item.ApellidoEstudiante}</div>
                                                            <div className="text-muted small">{item.Email}</div>
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="fw-bold text-dark">{item.Grado}</div>
                                                    <CBadge className="bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-2">
                                                        {item.Seccion}
                                                    </CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="text-dark fw-medium">{item.RepresentanteNombre} {item.RepresentanteApellido}</div>
                                                    <div className="text-muted small">{item.Telefono}</div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <code className="bg-orange-soft text-primary px-2 py-1 rounded small fw-bold">
                                                        {item.RepresentanteCedula}
                                                    </code>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <StatusBadge status={item.Estatus} />
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end pe-4">
                                                    <CButtonGroup className="shadow-sm rounded-pill overflow-hidden border border-light">
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => openModal("view", item)}
                                                            className="px-3 border-0 transition-all hover-primary"
                                                            title="Ver perfil completo"
                                                        >
                                                            <CIcon icon={cilInfo} />
                                                        </CButton>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => openModal("edit", item)}
                                                            className="px-3 border-0 transition-all hover-warning"
                                                            title="Editar datos"
                                                        >
                                                            <CIcon icon={cilPencil} />
                                                        </CButton>
                                                        <CButton
                                                            color="light"
                                                            size="sm"
                                                            onClick={() => openModal("delete", item)}
                                                            className="px-3 border-0 transition-all hover-danger"
                                                            title="Eliminar registro"
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

                        <div className="d-flex justify-content-between align-items-center p-4 bg-light bg-opacity-25 border-top">
                            <div className="text-muted small fw-medium">
                                Mostrando <span className="text-primary fw-bold">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalFiltered)}</span> de <span className="text-dark fw-bold">{totalFiltered}</span> estudiantes
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
            </CCardBody>

            <CCardFooter className="bg-orange-soft border-0 p-4 no-print">
                <CRow className="align-items-center">
                    <CCol xs={12} md={6} className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1 me-3">
                                <CProgress
                                    value={(totalFiltered / totalStudents) * 100}
                                    style={{ height: '6px' }}
                                    className="bg-white"
                                    color="primary"
                                />
                            </div>
                            <small className="text-muted text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>
                                Filtro: {totalFiltered}/{totalStudents}
                            </small>
                        </div>
                    </CCol>
                    <CCol xs={12} md={6} className="text-md-end">
                        <small className="text-muted text-uppercase ls-1 fw-bold" style={{ fontSize: '0.65rem' }}>
                            <CIcon icon={cilUser} className="me-1" /> Última sincronización: {new Date().toLocaleDateString()}
                        </small>
                    </CCol>
                </CRow>
            </CCardFooter>

            <style>{`
                .custom-table thead th { border-bottom: none; }
                .custom-table tbody td { border-bottom: 1px solid rgba(0,0,0,0.03); padding: 1rem 0.5rem; }
                .hover-row:hover { background-color: rgba(242, 140, 15, 0.02) !important; }
                .avatar-circle {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                }
                .cursor-pointer { cursor: pointer; }
                .ls-1 { letter-spacing: 1px; }
                .transition-all { transition: all 0.2s ease; }
                
                .hover-primary:hover { background: var(--primary-500) !important; color: white !important; }
                .hover-warning:hover { background: var(--warning) !important; color: white !important; }
                .hover-danger:hover { background: var(--danger) !important; color: white !important; }
                
                .custom-check:checked { background-color: var(--primary-500); border-color: var(--primary-500); }
                
                .custom-pagination .page-item.active .page-link {
                    background-color: var(--primary-500);
                    border-color: var(--primary-500);
                }
                .custom-pagination .page-link {
                    color: var(--primary-600);
                    border-radius: 8px;
                    margin: 0 2px;
                }
            `}</style>
        </CCard>
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