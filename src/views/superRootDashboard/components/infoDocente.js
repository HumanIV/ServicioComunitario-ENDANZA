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
    cilSchool,
    cilCalendar,
    cilStar,
    cilBookmark
} from '@coreui/icons'
import AvatarLetter from 'src/components/AvatarLetter'

const InfoTeacher = ({ visible, onClose, teacher, specialties = [], grades = [] }) => {
    if (!teacher) return null

    const getSpecialtyBadge = (specialty) => {
        if (!specialty || specialty === 'Sin asignar') {
            return (
                <CBadge color="secondary" className="px-3 py-2 rounded-pill bg-opacity-10 text-secondary">
                    SIN ASIGNAR
                </CBadge>
            )
        }
        return (
            <CBadge className="px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(224,122,0,0.1)', color: '#E07A00' }}>
                <CIcon icon={cilStar} className="me-1" size="sm" />
                {specialty.toUpperCase()}
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

        return (
            <CBadge color={config.color} className="px-3 py-2 rounded-pill">
                {config.text.toUpperCase()}
            </CBadge>
        )
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
        <CModal size="lg" visible={visible} onClose={onClose} className="animate-fade-in premium-modal">
            <CModalHeader className="border-0 pb-3" style={{ borderBottom: '1px solid rgba(224,122,0,0.2)' }}>
                <CModalTitle className="fw-bold d-flex align-items-center">
                    <CIcon icon={cilSchool} className="me-2" style={{ color: '#E07A00' }} />
                    Perfil Docente
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4">
                <CRow className="g-4">
                    <CCol md={4} className="text-center border-end">
                        <div className="mb-3 d-flex justify-content-center">
                            <AvatarLetter
                                name={teacher.first_name}
                                lastName={teacher.last_name}
                                size="xl"
                                style={{ background: 'linear-gradient(135deg, #E07A00, #C66900)' }}
                            />
                        </div>
                        <h4 className="fw-bold mb-1 header-title-custom">{teacher.first_name}</h4>
                        <h4 className="fw-bold text-muted-custom mb-3">{teacher.last_name}</h4>
                        <div className="d-flex flex-column gap-2 align-items-center">
                            <CBadge className="px-3 py-2 rounded-pill" style={{ backgroundColor: 'rgba(224,122,0,0.1)', color: '#E07A00' }}>
                                <CIcon icon={cilSchool} className="me-1" size="sm" />
                                DOCENTE
                            </CBadge>
                            {getStatusBadge(teacher.status)}
                        </div>
                    </CCol>
                    <CCol md={8}>
                        <div className="mb-4">
                            <h6 className="text-uppercase text-muted-custom small fw-bold mb-3 ls-1">
                                Información Personal
                            </h6>
                            <CRow className="gy-3">
                                <CCol sm={6}>
                                    <div className="text-muted-custom small">Cédula</div>
                                    <div className="fw-bold d-flex align-items-center header-title-custom">
                                        <CIcon icon={cilAddressBook} className="me-2 opacity-75" style={{ color: '#E07A00' }} size="sm" />
                                        {teacher.dni}
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="text-muted-custom small">Correo Electrónico</div>
                                    <div className="fw-bold d-flex align-items-center text-truncate header-title-custom">
                                        <CIcon icon={cilEnvelopeOpen} className="me-2 opacity-75" style={{ color: '#E07A00' }} size="sm" />
                                        {teacher.email}
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="text-muted-custom small">Teléfono</div>
                                    <div className="fw-bold d-flex align-items-center header-title-custom">
                                        <CIcon icon={cilPhone} className="me-2 opacity-75" style={{ color: '#E07A00' }} size="sm" />
                                        {teacher.phone || 'No registrado'}
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="text-muted-custom small">Fecha de Registro</div>
                                    <div className="fw-bold d-flex align-items-center header-title-custom">
                                        <CIcon icon={cilCalendar} className="me-2 opacity-75" style={{ color: '#E07A00' }} size="sm" />
                                        {formatDate(teacher.createdAt)}
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        <div className="mb-4">
                            <h6 className="text-uppercase text-muted-custom small fw-bold mb-3 ls-1">
                                Asignación Académica
                            </h6>
                            <CRow className="gy-3">
                                <CCol sm={6}>
                                    <div className="text-muted-custom small">Especialidad</div>
                                    <div className="mt-1">
                                        {getSpecialtyBadge(teacher.specialty)}
                                    </div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="text-muted-custom small">Grados Asignados</div>
                                    <div className="mt-1 d-flex gap-1 flex-wrap">
                                        {teacher.grades && teacher.grades.length > 0 ? (
                                            teacher.grades.map(grade => (
                                                <CBadge 
                                                    key={grade.id} 
                                                    className="px-2 py-1 rounded-pill fw-normal"
                                                    style={{ backgroundColor: 'rgba(224,122,0,0.05)', color: '#E07A00', border: '1px solid rgba(224,122,0,0.2)' }}
                                                >
                                                    <CIcon icon={cilBookmark} className="me-1" size="sm" />
                                                    {grade.name}
                                                </CBadge>
                                            ))
                                        ) : (
                                            <span className="text-muted-custom small">Sin grados asignados</span>
                                        )}
                                    </div>
                                </CCol>
                            </CRow>
                        </div>

                        <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(224,122,0,0.05)', border: '1px solid rgba(224,122,0,0.1)' }}>
                            <div className="small fw-bold mb-1" style={{ color: '#E07A00' }}>Nota del Sistema</div>
                            <p className="small mb-0 text-muted-custom">
                                Este docente {teacher.specialty ? `tiene especialidad en ${teacher.specialty}` : 'aún no tiene especialidad asignada'} 
                                {teacher.grades?.length > 0 ? ` y está a cargo de ${teacher.grades.length} grado(s) académico(s).` : '.'}
                            </p>
                        </div>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter className="border-0">
                <CButton 
                    color="light" 
                    onClick={onClose} 
                    variant="ghost" 
                    className="fw-bold text-uppercase text-muted-custom"
                >
                    Cerrar
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default InfoTeacher