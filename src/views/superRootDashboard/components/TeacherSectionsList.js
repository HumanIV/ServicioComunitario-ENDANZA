import React from 'react'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAddressBook, cilBookmark, cilStar } from '@coreui/icons'

const TeacherSectionsList = ({ sections = [] }) => {
    // Datos de ejemplo realistas para complementar si no hay suficientes datos dinámicos
    const baseTeachers = [
        { name: 'Fiorella Márquez', subject: 'Danza Clásica', grade: '1er Grado A', status: 'Activo' },
        { name: 'Ana Martínez', subject: 'Ballet Inicial', grade: 'Preparatorio B', status: 'Activo' },
        { name: 'Carlos Ruiz', subject: 'Jazz Contemporáneo', grade: '3er Grado C', status: 'Activo' },
        { name: 'Lucía Gómez', subject: 'Pre-Ballet', grade: 'Baby Ballet', status: 'Activo' },
        { name: 'Ricardo Pérez', subject: 'Acrodanza', grade: 'Nivel Avanzado', status: 'Activo' },
    ];

    // Combinar con datos reales si existen
    const displayData = sections.length > 0 ?
        sections.map(s => ({
            name: s.teacher || 'Sin asignar',
            subject: s.sectionName || 'Materia General',
            grade: s.gradeLevel || 'N/A',
            status: 'Activo'
        })) : baseTeachers;

    return (
        <CCard className="premium-card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '32px' }}>
            <CCardHeader className="bg-transparent border-0 pt-4 px-4 pb-0">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h4 className="fw-black header-title-custom mb-1 d-flex align-items-center">
                            <div className="bg-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center shadow-orange-sm">
                                <CIcon icon={cilAddressBook} className="text-white" size="lg" />
                            </div>
                            Plantilla Académica
                        </h4>
                        <p className="text-muted-custom small mb-0 fw-medium">Asignación de cátedras y control docente {new Date().getFullYear()}</p>
                    </div>
                    <CBadge color="primary" className="rounded-pill p-2 px-3 fw-bold bg-opacity-10 text-primary d-flex align-items-center">
                        <CIcon icon={cilStar} className="me-1" size="sm" />
                        CERTIFICADOS
                    </CBadge>
                </div>
            </CCardHeader>
            <CCardBody className="px-4 py-4">
                <div className="table-responsive">
                    <CTable align="middle" hover className="mb-0 bg-transparent custom-table-modern">
                        <CTableHead className="border-0">
                            <CTableRow>
                                <CTableHeaderCell className="text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">Docente / Instructora</CTableHeaderCell>
                                <CTableHeaderCell className="text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">Disciplina Académica</CTableHeaderCell>
                                <CTableHeaderCell className="text-center text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">Grado</CTableHeaderCell>
                                <CTableHeaderCell className="text-end text-muted-custom small text-uppercase fw-black ls-1 border-0 pb-3">Estado</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody className="border-0">
                            {displayData.map((item, index) => (
                                <CTableRow key={index} className="border-0">
                                    <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-square-premium me-3 d-flex align-items-center justify-content-center fw-bold shadow-sm">
                                                {item.name[0]}
                                            </div>
                                            <div>
                                                <div className="fw-bold header-title-custom mb-0">{item.name}</div>
                                                <div className="text-primary small fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>DOCENTE TITULAR</div>
                                            </div>
                                        </div>
                                    </CTableDataCell>
                                    <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5">
                                        <div className="d-flex align-items-center">
                                            <CIcon icon={cilBookmark} className="me-2 text-muted-custom opacity-50" size="sm" />
                                            <span className="fw-semibold header-title-custom">{item.subject}</span>
                                        </div>
                                    </CTableDataCell>
                                    <CTableDataCell className="py-4 border-0 border-bottom border-light-custom border-opacity-5 text-center">
                                        <CBadge className="bg-glass-premium border border-light-custom border-opacity-20 text-muted-custom rounded-pill px-3 py-2 fw-bold">
                                            {item.grade}
                                        </CBadge>
                                    </CTableDataCell>
                                    <CTableDataCell className="py-4 text-end border-0 border-bottom border-light-custom border-opacity-5">
                                        <div className="d-flex align-items-center justify-content-end">
                                            <span className="pulse-green me-2"></span>
                                            <span className="small fw-black text-success ls-1">{item.status.toUpperCase()}</span>
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </div>
            </CCardBody>

            <style>{`
                .fw-black { font-weight: 950; }
                .ls-1 { letter-spacing: 1px; }
                .shadow-orange-sm { box-shadow: 0 4px 8px rgba(224, 123, 0, 0.2); }
                
                .avatar-square-premium {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
                    color: white;
                    border-radius: 12px;
                }
                
                .pulse-green {
                    width: 8px;
                    height: 8px;
                    background-color: #198754;
                    border-radius: 50%;
                    box-shadow: 0 0 0 rgba(25, 135, 84, 0.4);
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(25, 135, 84, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
                }
                
                .custom-table-modern thead th {
                    border: none !important;
                }
                
                [data-coreui-theme="dark"] .bg-glass-premium {
                    background-color: rgba(255,255,255,0.05) !important;
                }
            `}</style>
        </CCard>
    )
}

export default TeacherSectionsList
