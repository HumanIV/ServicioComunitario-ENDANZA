import React from 'react'
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CFormInput,
    CFormSelect,
    CButton,
    CInputGroup,
    CInputGroupText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilFilterX, cilReload, cilTrash, cilCloudDownload, cilOptions } from '@coreui/icons'
import PropTypes from 'prop-types'

const StudentFilters = ({
    searchText,
    setSearchText,
    filterGrade,
    setFilterGrade,
    filterSection,
    setFilterSection,
    clearFilters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    setLoading,
    selectedCount,
    onOpenDeleteMultiple
}) => {
    return (
        <CCard className="premium-card border-0 mb-4 overflow-hidden shadow-sm">
            <CCardBody className="p-4">
                <CRow className="g-3 align-items-center">
                    <CCol xs={12} lg={4}>
                        <CInputGroup className="premium-input-group shadow-sm rounded-pill overflow-hidden border border-light">
                            <CInputGroupText className="bg-white border-0 ps-3">
                                <CIcon icon={cilSearch} className="text-primary" />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Buscar por nombre, cédula o representante..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="border-0 py-2 h-auto focus-none"
                            />
                        </CInputGroup>
                    </CCol>

                    <CCol xs={12} md={6} lg={2}>
                        <CFormSelect
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                            className="input-premium py-2 rounded-pill h-auto shadow-sm border-light"
                        >
                            <option value="">Todos los grados</option>
                            {[...Array(8)].map((_, i) => (
                                <option key={i} value={`${i + 1}er Grado`}>{`${i + 1}er Grado`}</option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    <CCol xs={12} md={6} lg={2}>
                        <CFormSelect
                            value={filterSection}
                            onChange={(e) => setFilterSection(e.target.value)}
                            className="input-premium py-2 rounded-pill h-auto shadow-sm border-light"
                        >
                            <option value="">Todas las secciones</option>
                            {['Danza A', 'Danza B', 'Danza C', 'Danza D'].map((sec) => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    <CCol xs={12} lg={4} className="d-flex gap-2 justify-content-lg-end">
                        <CButton
                            color="light"
                            variant="outline"
                            onClick={clearFilters}
                            className="border-2 rounded-pill fw-bold text-muted px-4 hover-orange shadow-sm"
                        >
                            <CIcon icon={cilFilterX} className="me-2" />
                            Limpiar
                        </CButton>

                        <CButton
                            color="light"
                            variant="outline"
                            className={`border-2 rounded-pill fw-bold px-4 shadow-sm ${showAdvancedFilters ? 'bg-orange-soft text-primary' : 'text-muted'}`}
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        >
                            <CIcon icon={cilOptions} className="me-2 text-primary" />
                            Filtros
                        </CButton>

                        <CButton
                            color="light"
                            variant="outline"
                            className="border-2 rounded-pill text-primary p-2 px-3 shadow-sm"
                            onClick={() => {
                                setLoading(true)
                                setTimeout(() => setLoading(false), 500)
                            }}
                        >
                            <CIcon icon={cilReload} />
                        </CButton>
                    </CCol>
                </CRow>

                {showAdvancedFilters && (
                    <div className="mt-4 pt-4 border-top animate__animated animate__fadeIn">
                        <CRow className="g-4">
                            <CCol xs={12} md={4}>
                                <label className="form-label small fw-bold text-muted text-uppercase ls-1 ms-2">Estado de Matrícula</label>
                                <CFormSelect className="input-premium rounded-pill">
                                    <option>Todos los estados</option>
                                    <option>Activo</option>
                                    <option>Inactivo</option>
                                    <option>Retirado</option>
                                </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={4}>
                                <label className="form-label small fw-bold text-muted text-uppercase ls-1 ms-2">Inscripción Desde</label>
                                <CFormInput type="date" className="input-premium rounded-pill" />
                            </CCol>
                            <CCol xs={12} md={4}>
                                <label className="form-label small fw-bold text-muted text-uppercase ls-1 ms-2">Inscripción Hasta</label>
                                <CFormInput type="date" className="input-premium rounded-pill" />
                            </CCol>
                        </CRow>
                    </div>
                )}

                {selectedCount > 0 && (
                    <div className="mt-4 p-3 rounded-4 d-flex justify-content-between align-items-center bg-orange-soft border border-primary border-opacity-10 animate__animated animate__slideInUp">
                        <div className="d-flex align-items-center ms-2">
                            <div className="bg-primary text-white rounded-pill px-3 py-1 me-3 fw-bold shadow-sm">
                                {selectedCount}
                            </div>
                            <span className="fw-bold text-dark">Estudiantes seleccionados para acción grupal</span>
                        </div>
                        <div className="d-flex gap-2 pe-2">
                            <CButton
                                color="danger"
                                className="rounded-pill px-4 py-2 fw-bold shadow-sm text-white"
                                onClick={onOpenDeleteMultiple}
                            >
                                <CIcon icon={cilTrash} className="me-2" />
                                ELIMINAR
                            </CButton>
                            <CButton
                                color="light"
                                variant="outline"
                                className="rounded-pill px-4 py-2 border-2 fw-bold text-muted hover-orange shadow-sm"
                            >
                                <CIcon icon={cilCloudDownload} className="me-2 text-primary" />
                                EXPORTAR
                            </CButton>
                        </div>
                    </div>
                )}
            </CCardBody>
            <style>{`
                .focus-none:focus { box-shadow: none !important; }
                .hover-orange:hover {
                    border-color: var(--primary-400) !important;
                    color: var(--primary-600) !important;
                    background: var(--primary-50) !important;
                }
            `}</style>
        </CCard>
    )
}

StudentFilters.propTypes = {
    searchText: PropTypes.string,
    setSearchText: PropTypes.func,
    filterGrade: PropTypes.string,
    setFilterGrade: PropTypes.func,
    filterSection: PropTypes.string,
    setFilterSection: PropTypes.func,
    clearFilters: PropTypes.func,
    showAdvancedFilters: PropTypes.bool,
    setShowAdvancedFilters: PropTypes.func,
    setLoading: PropTypes.func,
    selectedCount: PropTypes.number,
    onOpenDeleteMultiple: PropTypes.func,
}

export default StudentFilters