import React from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CForm,
    CFormInput,
    CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import PropTypes from 'prop-types'

const PasswordModal = ({ visible, onClose, onUpdate }) => {
    return (
        <CModal
            size="lg"
            visible={visible}
            onClose={onClose}
        >
            <CModalHeader>
                <CModalTitle>
                    <CIcon icon={cilLockLocked} className="me-2" />
                    Cambiar Contraseña
                </CModalTitle>
            </CModalHeader>

            <CModalBody>
                <CForm>
                    <CFormInput
                        className="mb-3"
                        type="password"
                        label="Contraseña Actual"
                        placeholder="Ingrese su contraseña actual"
                    />

                    <CFormInput
                        className="mb-3"
                        type="password"
                        label="Nueva Contraseña"
                        placeholder="Ingrese su nueva contraseña"
                    />

                    <CButton color="success" onClick={onUpdate}>
                        Guardar Cambios
                    </CButton>
                </CForm>
            </CModalBody>
        </CModal>
    )
}

PasswordModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
}

export default PasswordModal
