import React from 'react'
import { CCol, CCard, CCardBody, CBadge, CFormSelect, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLocationPin, cilInfo, cilClock, cilPeople } from '@coreui/icons'
import PropTypes from 'prop-types'

const ClassroomCard = ({ room, onTypeChange, onSeeSchedule, getStatusColor, classroomTypes }) => {
    return (
        <CCol lg={4} md={6}>
            <CCard className="shadow-sm h-100 hover-lift overflow-hidden border-0" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
                <div className="position-absolute top-0 start-0 w-100 bg-gradient-primary" style={{ height: '4px', background: '#E07B00' }}></div>
                <CCardBody className="d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                            <div className="bg-orange-soft p-2 rounded-3 me-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <CIcon icon={cilLocationPin} size="xl" />
                            </div>
                            <div>
                                <h5 className="mb-1 fw-bold text-dark">{room.name}</h5>
                                <CBadge color={getStatusColor(room.type)} shape="rounded-pill" className="px-3 py-1">
                                    {room.type}
                                </CBadge>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3 p-2 bg-light rounded-3 border">
                        <label className="text-muted small text-uppercase fw-bold mb-1 d-block" style={{ fontSize: '10px' }}>Tipo de Espacio</label>
                        <CFormSelect
                            size="sm"
                            value={room.type}
                            onChange={(e) => onTypeChange(room.id, e.target.value)}
                            className="border-0 fw-semibold bg-transparent"
                        >
                            {classroomTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </CFormSelect>
                    </div>

                    <div className="mb-4 p-3 bg-white border rounded-3 text-center">
                        <CIcon icon={cilPeople} className="text-primary mb-1 d-block mx-auto" size="sm" />
                        <span className="fw-bold text-dark">{room.capacity}</span>
                        <span className="d-block text-muted" style={{ fontSize: '11px' }}>Personas</span>
                    </div>

                    <div className="mt-auto pt-3 border-top border-light">
                        <CButton
                            onClick={() => onSeeSchedule(room)}
                            className="w-100 d-flex align-items-center justify-content-center fw-bold"
                            style={{
                                background: '#E07B00',
                                border: 'none',
                                color: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(242, 140, 15, 0.4)';
                                e.currentTarget.style.background = '#F28C0F';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = '#E07B00';
                            }}
                        >
                            <CIcon icon={cilClock} className="me-2" />
                            VER HORARIO
                        </CButton>
                    </div>
                </CCardBody>

                <style>{`
                    .hover-lift:hover { 
                        transform: translateY(-4px); 
                        box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; 
                    }
                    .bg-orange-soft { background-color: rgba(242, 140, 15, 0.1); }
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
