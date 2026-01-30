import React from 'react'
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CBadge, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import PropTypes from 'prop-types'

const ScheduleFilters = ({
    searchTerm,
    onSearch,
    gradeLevel,
    onFilterChange,
    gradeLevels,
    onClear,
    activeFilters,
    // New prop to inject the action button (Nueva Sección)
    extraAction
}) => {
    return (
        <div className="mb-4 p-4 rounded-4 border border-light-custom bg-light-custom bg-opacity-10 shadow-sm">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
                <div className="text-muted-custom fw-bold small text-uppercase ls-1">
                    Total Secciones: <span className="fs-5 header-title-custom ms-1">{activeFilters.totalResults}</span>
                </div>

                <div style={{ maxWidth: '400px', width: '100%' }}>
                    <CInputGroup className="shadow-sm rounded-3 overflow-hidden border border-light-custom">
                        <CInputGroupText className="border-0 text-muted-custom bg-light-custom">
                            <CIcon icon={cilSearch} />
                        </CInputGroupText>
                        <CFormInput
                            className="border-0 ps-0 bg-light-custom header-title-custom"
                            placeholder="Buscar por nombre de sección o grado..."
                            value={searchTerm}
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </CInputGroup>
                </div>
            </div>

            <div className="row g-3 align-items-center">
                <div className="col-md-6">
                    <CFormSelect
                        className="bg-light-custom border-light-custom header-title-custom shadow-sm"
                        value={gradeLevel}
                        onChange={(e) => onFilterChange('gradeLevel', e.target.value)}
                    >
                        <option value="">Todos los grados</option>
                        {gradeLevels.map(grade => (
                            <option key={grade.value} value={grade.value}>{grade.label}</option>
                        ))}
                    </CFormSelect>
                </div>
                {/* Replaced Academic Year Dropdown handling with flexible extra action area */}
                <div className="col-md-6 d-flex justify-content-md-end">
                    {extraAction}
                </div>
            </div>

            {(gradeLevel || searchTerm) && (
                <div className="mt-3 d-flex justify-content-between align-items-center">
                    <div className="small text-muted-custom">
                        Filtros activos:
                        {gradeLevel && <CBadge color="primary" className="ms-2 bg-opacity-10 text-primary border border-primary border-opacity-10">{gradeLevel}</CBadge>}
                    </div>
                    <CButton
                        size="sm"
                        color="secondary"
                        variant="ghost"
                        onClick={onClear}
                    >
                        Limpiar Filtros
                    </CButton>
                </div>
            )}
        </div>
    )
}

ScheduleFilters.propTypes = {
    searchTerm: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    gradeLevel: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
    gradeLevels: PropTypes.array.isRequired,
    onClear: PropTypes.func.isRequired,
    activeFilters: PropTypes.object.isRequired,
    extraAction: PropTypes.node
}

export default ScheduleFilters
