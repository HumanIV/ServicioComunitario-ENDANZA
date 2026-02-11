import React from 'react'
import {
    CRow,
    CCol,
    CFormInput,
    CButton,
    CInputGroup,
    CInputGroupText,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilSearch,
    cilFilterX,
    cilReload,
    cilTrash,
    cilCloudDownload,
    cilOptions,
    cilChevronBottom,
    cilSchool,
    cilLayers
} from '@coreui/icons'
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
        <div className="filters-row-container z-high">
            <CRow className="g-3 align-items-center">
                {/* Búsqueda Principal */}
                <CCol xs={12} lg={4}>
                    <CInputGroup className="premium-input-group shadow-sm rounded-pill overflow-hidden border filter-search-container bg-glass-premium">
                        <CInputGroupText className="bg-transparent border-0 ps-3">
                            <CIcon icon={cilSearch} className="text-primary" />
                        </CInputGroupText>
                        <CFormInput
                            placeholder="Buscar estudiante o representante..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border-0 py-2 h-auto focus-none bg-transparent filter-search-input"
                        />
                    </CInputGroup>
                </CCol>

                {/* Selector de Grado */}
                <CCol xs={6} md={3} lg={2}>
                    <div className="filter-pill-container shadow-sm border rounded-pill p-1 px-3 d-flex align-items-center w-100 h-100 bg-glass-premium">
                        <CDropdown className="w-100">
                            <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center justify-content-between w-100" style={{ whiteSpace: 'nowrap' }}>
                                <div className="d-flex align-items-center text-truncate">
                                    <CIcon icon={cilSchool} className="me-2 opacity-50 flex-shrink-0" />
                                    <span className="small text-truncate">
                                        {filterGrade || 'Grado'}
                                    </span>
                                </div>
                                <CIcon icon={cilChevronBottom} size="sm" className="ms-1 opacity-50 flex-shrink-0" />
                            </CDropdownToggle>
                            <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 overflow-hidden animate-fade-in dropdown-menu-premium-scroll">
                                <CDropdownItem onClick={() => setFilterGrade("")} active={filterGrade === ""} className="py-2 px-3 dropdown-item-premium">
                                    Todos los grados
                                </CDropdownItem>
                                {[...Array(8)].map((_, i) => {
                                    const grade = `${i + 1}er Grado`
                                    return (
                                        <CDropdownItem key={i} onClick={() => setFilterGrade(grade)} active={filterGrade === grade} className="py-2 px-3 dropdown-item-premium">
                                            {grade}
                                        </CDropdownItem>
                                    )
                                })}
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </CCol>

                {/* Selector de Sección */}
                <CCol xs={6} md={3} lg={2}>
                    <div className="filter-pill-container shadow-sm border rounded-pill p-1 px-3 d-flex align-items-center w-100 h-100 bg-glass-premium">
                        <CDropdown className="w-100">
                            <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center justify-content-between w-100" style={{ whiteSpace: 'nowrap' }}>
                                <div className="d-flex align-items-center text-truncate">
                                    <CIcon icon={cilLayers} className="me-2 opacity-50 flex-shrink-0" />
                                    <span className="small text-truncate">
                                        {filterSection || 'Sección'}
                                    </span>
                                </div>
                                <CIcon icon={cilChevronBottom} size="sm" className="ms-1 opacity-50 flex-shrink-0" />
                            </CDropdownToggle>
                            <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 overflow-hidden animate-fade-in dropdown-menu-premium-scroll">
                                <CDropdownItem onClick={() => setFilterSection("")} active={filterSection === ""} className="py-2 px-3 dropdown-item-premium">
                                    Todas las secciones
                                </CDropdownItem>
                                {['Danza A', 'Danza B', 'Danza C', 'Danza D'].map((sec) => (
                                    <CDropdownItem key={sec} onClick={() => setFilterSection(sec)} active={filterSection === sec} className="py-2 px-3 dropdown-item-premium">
                                        {sec}
                                    </CDropdownItem>
                                ))}
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </CCol>

                {/* Acciones Rápidas */}
                <CCol xs={12} lg={4} className="d-flex gap-2 justify-content-lg-end pt-2 pt-lg-0">
                    <CButton
                        color="light"
                        variant="outline"
                        onClick={clearFilters}
                        className="border-2 rounded-pill fw-bold px-3 filter-btn-secondary shadow-sm"
                        title="Limpiar filtros"
                    >
                        <CIcon icon={cilFilterX} />
                    </CButton>

                    <CButton
                        color="light"
                        variant="outline"
                        className={`border-2 rounded-pill fw-bold px-4 flex-grow-1 flex-md-grow-0 shadow-sm ${showAdvancedFilters ? 'bg-orange-soft text-primary' : 'filter-btn-secondary'}`}
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                        <CIcon icon={cilOptions} className="me-2" />
                        Avanzado
                    </CButton>

                    <CButton
                        color="light"
                        variant="outline"
                        className="border-2 rounded-pill text-primary p-2 px-3 shadow-sm filter-btn-secondary"
                        onClick={() => {
                            setLoading(true)
                            setTimeout(() => setLoading(false), 500)
                        }}
                    >
                        <CIcon icon={cilReload} />
                    </CButton>
                </CCol>
            </CRow>

            {/* Filtros Avanzados */}
            {showAdvancedFilters && (
                <div className="mt-4 pt-4 border-top animate__animated animate__fadeIn border-light-custom">
                    <CRow className="g-4">
                        <CCol xs={12} md={4}>
                            <label className="form-label label-micro text-muted-custom ms-2">ESTADO DE MATRÍCULA</label>
                            <div className="filter-pill-container border rounded-pill p-1 px-3 d-flex align-items-center">
                                <CDropdown className="w-100">
                                    <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center justify-content-between w-100">
                                        Todos los estados
                                        <CIcon icon={cilChevronBottom} size="sm" className="opacity-50" />
                                    </CDropdownToggle>
                                    <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 w-100">
                                        <CDropdownItem className="dropdown-item-premium">Todos los estados</CDropdownItem>
                                        <CDropdownItem className="dropdown-item-premium">Activo</CDropdownItem>
                                        <CDropdownItem className="dropdown-item-premium">Inactivo</CDropdownItem>
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label className="form-label label-micro text-muted-custom ms-2">INSCRIPCIÓN DESDE</label>
                            <CFormInput type="date" className="input-premium rounded-pill" />
                        </CCol>
                        <CCol xs={12} md={4}>
                            <label className="form-label label-micro text-muted-custom ms-2">INSCRIPCIÓN HASTA</label>
                            <CFormInput type="date" className="input-premium rounded-pill" />
                        </CCol>
                    </CRow>
                </div>
            )}

            {/* Banner de Selección Múltiple */}
            {selectedCount > 0 && (
                <div className="mt-4 p-3 rounded-4 d-flex justify-content-between align-items-center group-action-banner animate__animated animate__slideInUp">
                    <div className="d-flex align-items-center ms-2 text-truncate">
                        <div className="bg-primary text-white rounded-pill px-3 py-1 me-3 fw-bold shadow-sm">
                            {selectedCount}
                        </div>
                        <span className="fw-bold header-title-custom text-truncate">Seleccionados para acción grupal</span>
                    </div>
                    <div className="d-flex gap-2 pe-2 flex-shrink-0">
                        <CButton
                            color="danger"
                            className="rounded-pill px-4 py-2 fw-bold shadow-sm text-white border-0"
                            onClick={onOpenDeleteMultiple}
                        >
                            <CIcon icon={cilTrash} className="me-2" />
                            <span className="d-none d-md-inline">ELIMINAR</span>
                        </CButton>
                        <CButton
                            color="light"
                            variant="outline"
                            className="rounded-pill px-4 py-2 border-2 fw-bold filter-btn-secondary shadow-sm"
                        >
                            <CIcon icon={cilCloudDownload} className="me-2 text-primary" />
                            <span className="d-none d-md-inline">EXPORTAR</span>
                        </CButton>
                    </div>
                </div>
            )}

        </div>
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