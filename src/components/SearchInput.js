import React from 'react'
import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const SearchInput = ({ value, onChange, placeholder = 'Buscar...' }) => {
    return (
        <CInputGroup className="shadow-sm border rounded-pill overflow-hidden bg-white">
            <CInputGroupText className="bg-transparent border-0 ps-3">
                <CIcon icon={cilSearch} className="text-muted" />
            </CInputGroupText>
            <CFormInput
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="border-0 shadow-none py-2"
                style={{ fontSize: '0.9rem' }}
            />
        </CInputGroup>
    )
}

export default SearchInput
