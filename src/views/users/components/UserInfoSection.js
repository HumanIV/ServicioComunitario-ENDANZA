import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilEnvelopeOpen, cilClock } from '@coreui/icons'
import PropTypes from 'prop-types'

const UserInfoSection = ({ user }) => {
    return (
        <div className="col-md-5 text-white">
            <h5 className="fw-bold mb-3">
                <CIcon icon={cilUser} className="me-2 text-primary" />
                Información del Usuario
            </h5>

            <p className="mb-3">
                <CIcon icon={cilUser} className="me-2 text-info" />
                <strong>Nombre Completo:</strong> {user.name}
            </p>

            <p className="mb-3">
                <CIcon icon={cilEnvelopeOpen} className="me-2 text-success" />
                <strong>Correo Corporativo:</strong> {user.email}
            </p>

            <p className="mb-3">
                <CIcon icon={cilClock} className="me-2 text-warning" />
                <strong>Último acceso:</strong> {user.lastLogin}
            </p>

            <p className="mb-3">
                <CIcon icon={cilUser} className="me-2 text-primary" />
                <strong>Departamento:</strong> {user.department}
            </p>

            <p>
                <CIcon icon={cilUser} className="me-2 text-danger" />
                <strong>Código de Empleado:</strong> {user.employeeCode}
            </p>
        </div>
    )
}

UserInfoSection.propTypes = {
    user: PropTypes.object.isRequired,
}

export default UserInfoSection
