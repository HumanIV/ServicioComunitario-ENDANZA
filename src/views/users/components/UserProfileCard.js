import React from 'react'
import { CAvatar } from '@coreui/react'
import PropTypes from 'prop-types'

const UserProfileCard = ({ user }) => {
    return (
        <div className="col-md-4 text-center">
            <div
                style={{
                    width: 200,
                    height: 200,
                    margin: '0 auto 20px auto',
                    borderRadius: '50%',
                    padding: 8,
                    background: '#2e8f21ff',
                    boxShadow: '0 0 30px rgba(80, 255, 138, 0.77), 0 0 45px rgba(86, 255, 80, 0.35)',
                }}
            >
                <CAvatar
                    src={user.avatar}
                    style={{ width: '100%', height: '100%' }}
                    className="shadow-lg"
                />
            </div>

            <h3 className="fw-bold text-white mb-1">{user.name}</h3>
            <p className="text-light opacity-75 mb-1">{user.department}</p>
            <p className="text-light opacity-75">
                Código de empleado: <strong>{user.employeeCode}</strong>
            </p>

            <span
                className="px-4 py-2 fw-semibold d-inline-block"
                style={{
                    background: '#4b79ff',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 14px rgba(80,110,255,0.35)',
                }}
            >
                {user.role}
            </span>
        </div>
    )
}

UserProfileCard.propTypes = {
    user: PropTypes.object.isRequired,
}

export default UserProfileCard
