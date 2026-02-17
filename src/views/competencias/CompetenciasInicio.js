import React from 'react';
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CButton,
    CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilPlus,
    cilLibrary,
    cilCheckCircle,
    cilClock,
    cilArrowRight,
    cilList
} from '@coreui/icons';
import { SUBJECTS } from '../../services/schedules';

const CompetenciasInicio = ({ onSelectSubject, configData, currentYear }) => {
    // Calculate stats
    const yearConfig = configData[currentYear] || {};
    const configuredCount = Object.keys(yearConfig).length;
    const totalSubjects = SUBJECTS.length;

    // Get some subjects to show as "Quick Access"
    const featuredSubjects = SUBJECTS.slice(0, 4);

    return (
        <div className="animate__animated animate__fadeIn px-2">
            <CRow className="justify-content-center mb-5">
                <CCol md={10} lg={11}>
                    <CCard className="premium-card border-0 shadow-lg overflow-hidden position-relative main-comp-card">
                        <CCardBody className="p-4 p-md-5 position-relative text-white" style={{ zIndex: 2 }}>
                            <CRow className="align-items-center">
                                <CCol lg={7}>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="p-2 bg-white bg-opacity-10 rounded-3 me-3">
                                            <CIcon icon={cilLibrary} size="xl" />
                                        </div>
                                        <h5 className="mb-0 fw-bold text-uppercase ls-1 opacity-80">Planificación Académica</h5>
                                    </div>
                                    <h1 className="fw-black mb-3 text-uppercase ls-tight display-5">Gestión de Competencias</h1>
                                    <p className="opacity-80 mb-4 fs-5 fw-medium">
                                        Defina los criterios de evaluación y competencias por cada lapso académico. Asegure la calidad pedagógica de cada disciplina.
                                    </p>
                                    <div className="d-flex gap-3 flex-wrap">
                                        <div className="px-3 py-2 bg-white bg-opacity-10 rounded-pill d-flex align-items-center mb-2">
                                            <CIcon icon={cilCheckCircle} className="text-success me-2" />
                                            <span className="small fw-bold">{configuredCount} Configuradas</span>
                                        </div>
                                        <div className="px-3 py-2 bg-white bg-opacity-10 rounded-pill d-flex align-items-center mb-2">
                                            <CIcon icon={cilClock} className="text-warning me-2" />
                                            <span className="small fw-bold">{totalSubjects - configuredCount} Pendientes</span>
                                        </div>
                                    </div>
                                </CCol>
                                <CCol lg={5} className="d-none d-lg-block text-center position-relative">
                                    <div className="comp-abstract-graphic">
                                        <div className="circle-1"></div>
                                        <div className="circle-2"></div>
                                        <CIcon icon={cilList} className="main-icon opacity-20" />
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <h5 className="fw-bold text-uppercase ls-1 mb-4 px-2 opacity-80 d-flex align-items-center">
                <CIcon icon={cilLibrary} className="me-2 text-primary" /> Materias Disponibles
            </h5>

            <CRow className="g-4 px-2">
                {SUBJECTS.map((subject) => {
                    const isConfigured = yearConfig[subject.value];
                    const isLocked = isConfigured?.isLocked;

                    return (
                        <CCol key={subject.value} xs={12} sm={6} md={4} lg={3}>
                            <CCard
                                className={`h-100 border-0 shadow-sm hover-lift-sm transition-all cursor-pointer subject-tile ${isLocked ? 'locked' : ''}`}
                                onClick={() => onSelectSubject(subject.value)}
                            >
                                <CCardBody className="p-3 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className={`p-2 rounded-3 ${isLocked ? 'bg-success bg-opacity-10 text-success' : 'bg-primary bg-opacity-10 text-primary'}`}>
                                            <CIcon icon={cilLibrary} />
                                        </div>
                                        {isLocked ? (
                                            <CBadge color="success" className="bg-opacity-10 text-success rounded-pill px-2 py-1">BLOQUEADO</CBadge>
                                        ) : isConfigured ? (
                                            <CBadge color="warning" className="bg-opacity-10 text-warning rounded-pill px-2 py-1">EN EDICIÓN</CBadge>
                                        ) : (
                                            <CBadge color="secondary" className="bg-opacity-10 text-muted rounded-pill px-2 py-1">SIN CONFIGURAR</CBadge>
                                        )}
                                    </div>
                                    <h6 className="fw-bold mb-1 text-contrast">{subject.label}</h6>
                                    <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                                        <small className="text-muted-custom small fw-bold text-uppercase">Ver Detalles</small>
                                        <CIcon icon={cilArrowRight} className="text-primary opacity-50" />
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    );
                })}
            </CRow>

            <style>{`
                .main-comp-card {
                    background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%) !important;
                    border-radius: 30px !important;
                }

                [data-coreui-theme="dark"] .main-comp-card {
                    background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%) !important;
                    border: 1px solid rgba(255, 255, 255, 0.05) !important;
                }

                .subject-tile {
                    background: var(--neutral-50);
                    border-radius: 20px;
                }

                [data-coreui-theme="dark"] .subject-tile {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .subject-tile:hover {
                    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.1) !important;
                    transform: translateY(-5px);
                }

                .comp-abstract-graphic {
                    position: relative;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .comp-abstract-graphic .main-icon {
                    width: 120px;
                    height: 120px;
                    color: white;
                    z-index: 1;
                }

                .comp-abstract-graphic .circle-1,
                .comp-abstract-graphic .circle-2 {
                    position: absolute;
                    border-radius: 50%;
                    background: white;
                    opacity: 0.05;
                }

                .comp-abstract-graphic .circle-1 {
                    width: 180px;
                    height: 180px;
                    animation: pulse 4s infinite alternate;
                }

                .comp-abstract-graphic .circle-2 {
                    width: 120px;
                    height: 120px;
                    animation: pulse 6s infinite alternate-reverse;
                }

                @keyframes pulse {
                    from { transform: scale(0.9); opacity: 0.03; }
                    to { transform: scale(1.1); opacity: 0.08; }
                }

                .ls-1 { letter-spacing: 1px; }
                .fw-black { font-weight: 900; }
                .text-contrast { color: var(--neutral-800); }
                [data-coreui-theme="dark"] .text-contrast { color: white; }
            `}</style>
        </div>
    );
};

export default CompetenciasInicio;
