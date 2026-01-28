import React from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CRow,
    CCol,
    CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilUser,
    cilAddressBook,
    cilEnvelopeOpen,
    cilPhone,
    cilShieldAlt,
    cilCalendar,
} from '@coreui/icons'
import AvatarLetter from 'src/components/AvatarLetter'

const InfoUser = ({ visible, onClose, user }) => {
    if (!user) return null

    const getRoleBadge = (role) => {
        const r = role?.toLowerCase()
        const config = {
            'superadmin': { color: 'danger', text: 'Superadmin', icon: cilShieldAlt },
            'admin': { color: 'warning', text: 'Admin', icon: cilShieldAlt },
            'docente': { color: 'info', text: 'Docente', icon: cilUser },
            'representante': { color: 'primary', text: 'Representante', icon: cilUser }
        }[r] || { color: 'secondary', text: role, icon: cilUser }

        return (
            <CBadge color={config.color} className="px-3 py-2 rounded-pill">
                <CIcon icon={config.icon} className="me-2" />
                {config.text.toUpperCase()}
            </CBadge>
        )
    }

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase()
        const config = {
            'active': { color: 'success', text: 'Activo' },
            'inactive': { color: 'secondary', text: 'Inactivo' },
            'suspended': { color: 'warning', text: 'Suspendido' }
        }[s] || { color: 'secondary', text: status }

        return <CBadge color={config.color} className="px-3 py-2 rounded-pill">{config.text.toUpperCase()}</CBadge>
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible'
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <CModal size="lg" visible={visible} onClose={onClose} className="animate-fade-in">
            <CModalHeader className="border-0 bg-light-subtle">
                <CModalTitle className="fw-bold">
                    <CIcon icon={cilUser} className="me-2 text-primary" />
                    Detalles del Usuario
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4">
                <CRow className="g-4">
                    <CCol md={4} className="text-center border-end">
                        <div className="mb-3 d-flex justify-content-center">
                            <AvatarLetter
                                name={user.first_name}
                                lastName={user.last_name}
                                size="xl"
                            />
                        </div>
                        <h4 className="fw-bold mb-1">{user.first_name}</h4>
                        <h4 className="fw-bold text-muted mb-3">{user.last_name}</h4>
                        <div className="d-flex flex-column gap-2 align-items-center">
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.status)}
                        </div>
                    </CCol>
                    <CCol md={8}>
                        <div className="mb-4">
                            <h6 className="text-uppercase text-muted small fw-bold mb-3 ls-1">Información de Contacto</h6>
                            <CRow className="gy-3">
                                <CCol sm={6}>
                                    <div className="text-muted small">Cédula</div>
                                    <div className="fw-bold d-flex align-items-center">
                                        <CIcon icon={cilAddressBook} className="me-2 text-primary" size="sm" />
                                        {user.dni}
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="text-muted small">Correo Electrónico</div>
                                    <div className="fw-bold d-flex align-items-center text-truncate">
                                        <CIcon icon={cilEnvelopeOpen} className="me-2 text-primary" size="sm" />
                                        {user.email}
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="text-muted small">Teléfono</div>
                                    <div className="fw-bold d-flex align-items-center">
                                        <CIcon icon={cilPhone} className="me-2 text-primary" size="sm" />
                                        {user.phone || 'No registrado'}
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="text-muted small">Fecha de Registro</div>
                                    <div className="fw-bold d-flex align-items-center">
                                        <CIcon icon={cilCalendar} className="me-2 text-primary" size="sm" />
                                        {formatDate(user.createdAt)}
                                    </div>
                                </CCol>
                            </CRow>
                        </div>
                        <div className="p-3 bg-orange-soft rounded-3 border border-warning border-opacity-25">
                            <div className="small fw-bold text-primary mb-1 text-uppercase">Nota del Sistema</div>
                            <p className="small mb-0 text-dark">
                                Este usuario tiene privilegios de tipo <strong>{user.role}</strong>.
                                La cuenta está actualmente <strong>{user.status === 'active' ? 'habilitada' : 'restringida'}</strong> para el acceso a la plataforma.
                            </p>
                        </div>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter className="border-0">
                <CButton color="secondary" onClick={onClose} variant="ghost" className="fw-bold text-uppercase">
                    Cerrar Ventana
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default InfoUser
