import React from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CRow,
    CCol,
    CButton,
    CCard,
    CCardBody,
    CBadge,
    CListGroup,
    CListGroupItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilPhone, cilEnvelopeClosed, cilBadge, cilChild, cilCalendar, cilMap } from '@coreui/icons'
import AvatarLetter from 'src/components/AvatarLetter'

const InfoRepresentante = ({ visible, onClose, representative }) => {
    if (!representative) return null

    return (
        <CModal size="lg" visible={visible} onClose={onClose} backdrop="static" className="animate-fade-in premium-modal">
            <CModalHeader className="border-0 bg-warning text-white pb-3">
                <CModalTitle className="fw-bold d-flex align-items-center">
                    <CIcon icon={cilUser} className="me-2 text-white-50" />
                    Ficha del Representante
                </CModalTitle>
                <CButton onClick={onClose} className="btn-close-white shadow-none"></CButton>
            </CModalHeader>
            <CModalBody className="p-4 bg-light-custom bg-opacity-10">
                <div className="text-center mb-4">
                    <AvatarLetter
                        name={representative.first_name}
                        lastName={representative.last_name}
                        size="xl"
                        className="mb-3 shadow-lg border border-3 border-white"
                    />
                    <h4 className="fw-bold header-title-custom mb-0">{representative.first_name} {representative.last_name}</h4>
                    <CBadge color="warning" className="px-3 py-2 rounded-pill fw-bold bg-opacity-10 text-warning mt-2 ls-1 shadow-sm">
                        REPRESENTANTE OFICIAL
                    </CBadge>
                </div>

                <CRow className="g-4 mb-4">
                    <CCol md={6}>
                        <CCard className="h-100 border-0 shadow-sm bg-glass-premium">
                            <CCardBody className="p-3">
                                <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1 mb-2 d-block">Información Personal</label>
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center">
                                        <div className="p-2 bg-warning bg-opacity-10 rounded-pill me-3">
                                            <CIcon icon={cilBadge} className="text-warning" />
                                        </div>
                                        <div>
                                            <div className="small text-muted-custom fw-bold">CÉDULA</div>
                                            <div className="fw-medium text-contrast">{representative.dni}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="p-2 bg-warning bg-opacity-10 rounded-pill me-3">
                                            <CIcon icon={cilEnvelopeClosed} className="text-warning" />
                                        </div>
                                        <div>
                                            <div className="small text-muted-custom fw-bold">CORREO</div>
                                            <div className="fw-medium text-contrast text-break">{representative.email}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="p-2 bg-warning bg-opacity-10 rounded-pill me-3">
                                            <CIcon icon={cilPhone} className="text-warning" />
                                        </div>
                                        <div>
                                            <div className="small text-muted-custom fw-bold">TELÉFONO</div>
                                            <div className="fw-medium text-contrast">{representative.phone || 'No registrado'}</div>
                                        </div>
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol md={6}>
                        <CCard className="h-100 border-0 shadow-sm bg-glass-premium">
                            <CCardBody className="p-3">
                                <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1 mb-2 d-block">Estudiantes Asociados</label>
                                {representative.representados?.length > 0 ? (
                                    <CListGroup flush>
                                        {representative.representados.map(student => (
                                            <CListGroupItem key={student.id} className="bg-transparent border-0 px-0 d-flex align-items-center gap-3 py-2">
                                                <div className="p-2 bg-info bg-opacity-10 rounded-circle text-info">
                                                    <CIcon icon={cilChild} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    {/* CAMBIO 1: Usar first_name y last_name en lugar de fullName */}
                                                    <div className="fw-bold text-contrast text-truncate small leading-tight mb-1">
                                                        {student.first_name} {student.last_name}
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        {/* CAMBIO 2: Usar gradeLevel directamente */}
                                                        {student.gradeLevel && (
                                                            <CBadge color="info" className="bg-opacity-10 text-info px-2 border-0" style={{ fontSize: '0.6rem' }}>
                                                                {student.gradeLevel}
                                                            </CBadge>
                                                        )}
                                                        {/* CAMBIO 3: Status opcional con valor por defecto */}
                                                        <CBadge color="success" className="bg-opacity-10 text-success px-2 border-0" style={{ fontSize: '0.6rem' }}>
                                                            {student.status || 'Activo'}
                                                        </CBadge>
                                                    </div>
                                                </div>
                                            </CListGroupItem>
                                        ))}
                                    </CListGroup>
                                ) : (
                                    <div className="text-center py-4 bg-light bg-opacity-25 rounded-3">
                                        <CIcon icon={cilWarning} className="text-muted opacity-25 mb-2" size="xl" />
                                        <div className="small text-muted-custom">No hay alumnos vinculados a esta cédula.</div>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>

                <div className="bg-glass-premium p-3 rounded-4 border border-light-custom border-opacity-10 shadow-sm">
                    <div className="d-flex align-items-center mb-2">
                        <CIcon icon={cilCalendar} className="me-2 text-warning opacity-75" />
                        <span className="small fw-bold text-muted-custom text-uppercase ls-1">Estado de Acceso</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className={`rounded-circle me-2 ${representative.status === 'active' ? 'bg-success' : 'bg-warning'}`} style={{ width: '10px', height: '10px' }}></div>
                            <span className="fw-bold text-contrast">{representative.status?.toUpperCase() || 'ACTIVO'}</span>
                        </div>
                        <div className="small text-muted-custom">
                            Registrado el: {new Date(representative.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </CModalBody>
            <style>{`
                .btn-close-white {
                    filter: invert(1) grayscale(100%) brightness(200%);
                }
                .text-contrast { color: var(--neutral-800); }
                [data-coreui-theme="dark"] .text-contrast { color: white; }
                .leading-tight { line-height: 1.2; }
            `}</style>
        </CModal>
    )
}

export default InfoRepresentante