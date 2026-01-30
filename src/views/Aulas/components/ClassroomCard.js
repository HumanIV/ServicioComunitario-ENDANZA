import React from 'react'
import { CCol, CCard, CCardBody, CBadge, CFormSelect, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLocationPin, cilInfo, cilClock, cilPeople } from '@coreui/icons'
import PropTypes from 'prop-types'

const ClassroomCard = ({ room, onTypeChange, onSeeSchedule, getStatusColor, classroomTypes }) => {
    return (
        <CCol lg={4} md={6}>
            <CCard className="shadow-lg h-100 hover-lift overflow-hidden border-0 premium-card" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
                <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', background: '#F28C0F' }}></div>
                <CCardBody className="d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-orange-soft p-2 rounded-3 me-3 text-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px', border: '1px solid rgba(242, 140, 15, 0.2)' }}>
                                <CIcon icon={cilLocationPin} size="xl" />
                            </div>
                            <div>
                                <h5 className="mb-1 fw-bold header-title-custom">{room.name}</h5>
                                <CBadge color={getStatusColor(room.type)} shape="rounded-pill" className="px-3 py-1 bg-opacity-10 text-uppercase small fw-bold" style={{ color: `var(--cui-${getStatusColor(room.type)})`, backgroundColor: `rgba(var(--cui-${getStatusColor(room.type)}-rgb), 0.1)` }}>
                                    {room.type}
                                </CBadge>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3 p-3 bg-light-custom bg-opacity-10 rounded-4 border border-light-custom shadow-sm">
                        <label className="text-muted-custom small text-uppercase fw-bold mb-1 d-block ls-1" style={{ fontSize: '9px' }}>Tipo de Espacio</label>
                        <CFormSelect
                            size="sm"
                            value={room.type}
                            onChange={(e) => onTypeChange(room.id, e.target.value)}
                            className="border-0 fw-bold bg-transparent header-title-custom p-0"
                        >
                            {classroomTypes.map(t => <option key={t} value={t} className="bg-dark">{t}</option>)}
                        </CFormSelect>
                    </div>

                    <div className="mb-4 p-3 bg-light-custom bg-opacity-10 border border-light-custom rounded-4 text-center shadow-sm">
                        <CIcon icon={cilPeople} className="text-primary mb-1 d-block mx-auto" size="sm" />
                        <span className="fw-bold header-title-custom fs-5">{room.capacity}</span>
                        <span className="d-block text-muted-custom text-uppercase fw-bold ls-1" style={{ fontSize: '9px' }}>Personas Máx</span>
                    </div>

                    <div className="mt-auto pt-3 border-top border-light-custom border-opacity-10">
                        <CButton
                            onClick={() => onSeeSchedule(room)}
                            className="w-100 d-flex align-items-center justify-content-center fw-bold py-2 btn-premium shadow-sm"
                        >
                            <CIcon icon={cilClock} className="me-2" />
                            VER HORARIO
                        </CButton>
                    </div>
                </CCardBody>

                <style>{`
                    .hover-lift:hover { 
                        transform: translateY(-6px); 
                        box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important; 
                    }
                    .bg-orange-soft { background-color: rgba(242, 140, 15, 0.12); }
                    .ls-1 { letter-spacing: 1px; }
                `}</style>
            </CCard>
        </CCol>
    )
}

ClassroomCard.propTypes = {
    room: PropTypes.object.isRequired,
    onTypeChange: PropTypes.func.isRequired,
    onSeeSchedule: PropTypes.func.isRequired,
    getStatusColor: PropTypes.func.isRequired,
    classroomTypes: PropTypes.array.isRequired,
}

export default ClassroomCard
