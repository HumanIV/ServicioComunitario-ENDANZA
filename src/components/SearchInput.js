import React from 'react'
import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const SearchInput = ({ value, onChange, placeholder = 'Buscar...', className = '' }) => {
    // Si className incluye clases de background, no ponemos bg-white por defecto
    const containerClasses = className
        ? `shadow-sm border rounded-pill overflow-hidden d-flex align-items-center ${className}`
        : 'shadow-sm border rounded-pill overflow-hidden bg-white d-flex align-items-center'

    return (
        <CInputGroup className={containerClasses}>
            <CInputGroupText className="bg-transparent border-0 ps-3 py-2">
                <CIcon icon={cilSearch} className="text-secondary opacity-75" />
            </CInputGroupText>
            <CFormInput
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="border-0 shadow-none bg-transparent py-2 text-inherit"
                style={{ fontSize: '0.9rem', color: 'inherit' }}
            />
        </CInputGroup>
    )
}

export default SearchInput
