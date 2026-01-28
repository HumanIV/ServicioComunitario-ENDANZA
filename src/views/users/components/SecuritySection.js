import React from 'react'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import PropTypes from 'prop-types'

const SecuritySection = ({ onOpenPasswordModal }) => {
    return (
        <div className="col-md-3 text-white">
            <h5 className="fw-bold mb-3">
                <CIcon icon={cilLockLocked} className="me-2 text-warning" />
                Seguridad
            </h5>

            <p className="text-light opacity-75 mb-4" style={{ fontSize: '0.9rem' }}>
                Configuraciones relacionadas con la seguridad del trabajador.
            </p>

            <CButton
                color="warning"
                className="w-100 fw-bold text-dark shadow-sm"
                style={{ borderRadius: 14 }}
                onClick={onOpenPasswordModal}
            >
                Cambiar Contraseña
            </CButton>
        </div>
    )
}

SecuritySection.propTypes = {
    onOpenPasswordModal: PropTypes.func.isRequired,
}

export default SecuritySection
