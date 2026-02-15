import React, { useState, useEffect } from 'react'
import {
    CRow,
    CCol,
    CContainer,
    CCard,
    CCardHeader,
    CCardBody,
    CFormSelect,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CAlert,
    CButton,
    CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilList,
    cilPencil,
    cilSave,
    cilLockLocked,
    cilWarning,
    cilSchool
} from '@coreui/icons'
import { SUBJECTS, getAvailableYears } from '../../services/scheduleService'

// Components
import CompetencyEvaluationPlan from './components/CompetencyEvaluationPlan'
import CompetenciasInicio from './CompetenciasInicio'

const COMPETENCIES_KEY = 'competencies_config_v1'

const CompetenciasManager = () => {
    const [currentYear, setCurrentYear] = useState('')
    const [availableYears, setAvailableYears] = useState([])
    const [selectedSubject, setSelectedSubject] = useState('')
    const [activeTab, setActiveTab] = useState(1)
    const [configData, setConfigData] = useState({})
    const [loading, setLoading] = useState(true)
    const [currentConfig, setCurrentConfig] = useState(null)
    const [unsavedChanges, setUnsavedChanges] = useState(false)

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const years = await getAvailableYears()
                setAvailableYears(years)
                if (years.length > 0) setCurrentYear(years[0])

                const stored = localStorage.getItem(COMPETENCIES_KEY)
                if (stored) {
                    setConfigData(JSON.parse(stored))
                }
            } catch (error) {
                console.error("Error loading data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Update current config based on selection
    useEffect(() => {
        if (selectedSubject && currentYear) {
            const yearConfig = configData[currentYear] || {}
            const subjectConfig = yearConfig[selectedSubject] || {
                isLocked: false,
                lapsos: {
                    1: { evaluations: [] },
                    2: { evaluations: [] },
                    3: { evaluations: [] }
                }
            }
            setCurrentConfig(subjectConfig)
        } else {
            setCurrentConfig(null)
        }
    }, [selectedSubject, currentYear, configData])

    const handleSave = () => {
        const updatedFullConfig = { ...configData }
        if (!updatedFullConfig[currentYear]) updatedFullConfig[currentYear] = {}

        // Add lock flag
        const configToSave = { ...currentConfig, isLocked: true }
        updatedFullConfig[currentYear][selectedSubject] = configToSave

        setConfigData(updatedFullConfig)
        localStorage.setItem(COMPETENCIES_KEY, JSON.stringify(updatedFullConfig))
        setUnsavedChanges(false)

        // Force ui update
        setCurrentConfig(configToSave)
    }

    const handleConfigUpdate = (newConfig) => {
        setCurrentConfig(newConfig)
        setUnsavedChanges(true)
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <CSpinner color="primary" variant="grow" />
            </div>
        )
    }

    const handleBackToStart = () => {
        setSelectedSubject('')
        window.scrollTo(0, 0)
    }

    return (
        <CContainer fluid className="px-4 pb-5">
            {/* Header Section */}
            <div className="mb-4 mt-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-4 me-3 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                            <CIcon icon={cilList} className="text-white" size="xl" />
                        </div>
                        <div>
                            <h2 className="fw-bold mb-0 text-uppercase ls-tight">Gestión de Competencias</h2>
                            <div className="text-muted small fw-medium">Configuración del Plan de Evaluación por Materia y Lapso</div>
                        </div>
                    </div>
                    {selectedSubject && (
                        <CButton
                            className="btn-back-custom rounded-pill px-4 fw-bold d-flex align-items-center"
                            onClick={handleBackToStart}
                        >
                            <CIcon icon={cilList} className="me-2" /> VOLVER AL PANEL
                        </CButton>
                    )}
                </div>
            </div>

            {/* Control Bar */}
            <CCard className="mb-4 border-0 premium-card overflow-hidden">
                <CCardBody className="p-4">
                    <CRow className="g-3 align-items-end">
                        <CCol md={4} lg={3}>
                            <label className="fw-bold small text-uppercase mb-2 text-body-secondary">Ciclo Escolar</label>
                            <CFormSelect
                                value={currentYear}
                                onChange={(e) => setCurrentYear(e.target.value)}
                                className="form-control-lg border-light bg-body-tertiary"
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol md={5} lg={5}>
                            <label className="fw-bold small text-uppercase mb-2 text-body-secondary">Materia / Disciplina</label>
                            <CFormSelect
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="form-control-lg border-light bg-body-tertiary"
                            >
                                <option value="">-- Seleccione una materia --</option>
                                {SUBJECTS.map(subj => (
                                    <option key={subj.value} value={subj.value}>{subj.label}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol md={3} lg={4}>
                            {selectedSubject && currentConfig?.isLocked ? (
                                <div className="d-flex align-items-center h-100 pb-2">
                                    <CAlert color="success" className="mb-0 w-100 py-2 d-flex align-items-center border-0 shadow-sm text-white bg-success">
                                        <CIcon icon={cilLockLocked} className="me-2" />
                                        <strong>Configuración Bloqueada</strong>
                                    </CAlert>
                                </div>
                            ) : selectedSubject ? (
                                <div className="d-flex align-items-center h-100 pb-2">
                                    <CAlert color="warning" className="mb-0 w-100 py-2 d-flex align-items-center border-0 shadow-sm text-warning bg-orange-soft">
                                        <CIcon icon={cilPencil} className="me-2" />
                                        <strong>Modo Edición</strong>
                                    </CAlert>
                                </div>
                            ) : null}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Main Content */}
            {selectedSubject ? (
                <div className="animate__animated animate__fadeIn">
                    <CCard className="border-0 premium-card overflow-visible">
                        <CCardHeader className="bg-transparent border-0 px-4 pt-4 pb-0">
                            {/* Desktop Pills - Hidden on mobile */}
                            <CNav variant="pills" className="d-none d-md-inline-flex justify-content-center bg-body-tertiary rounded-pill p-1 mb-4">
                                {[1, 2, 3].map(lapso => (
                                    <CNavItem key={lapso}>
                                        <CNavLink
                                            active={activeTab === lapso}
                                            onClick={() => setActiveTab(lapso)}
                                            className="rounded-pill px-5 py-2 fw-bold cursor-pointer"
                                            style={{ transition: 'all 0.2s', letterSpacing: '1px' }}
                                        >
                                            {lapso === 1 ? 'I ' : lapso === 2 ? 'II ' : 'III '} LAPSO
                                        </CNavLink>
                                    </CNavItem>
                                ))}
                            </CNav>

                            {/* Mobile Dropdown - Hidden on desktop */}
                            <div className="d-md-none mb-4">
                                <CFormSelect
                                    value={activeTab}
                                    onChange={(e) => setActiveTab(parseInt(e.target.value))}
                                    className="form-control-lg border-light bg-body-tertiary fw-bold text-center"
                                    style={{ letterSpacing: '1px' }}
                                >
                                    <option value={1}>I LAPSO</option>
                                    <option value={2}>II LAPSO</option>
                                    <option value={3}>III LAPSO</option>
                                </CFormSelect>
                            </div>
                        </CCardHeader>

                        <CCardBody className="px-4 pb-5 pt-0">
                            <CTabContent>
                                {[1, 2, 3].map(lapsoId => (
                                    <CTabPane visible={activeTab === lapsoId} key={lapsoId}>
                                        <div className="py-3">
                                            <CompetencyEvaluationPlan
                                                evaluations={currentConfig?.lapsos[lapsoId]?.evaluations || []}
                                                isLocked={currentConfig?.isLocked}
                                                onChange={(newEvaluations) => {
                                                    const newConf = { ...currentConfig }
                                                    newConf.lapsos[lapsoId].evaluations = newEvaluations
                                                    handleConfigUpdate(newConf)
                                                }}
                                            />
                                        </div>
                                    </CTabPane>
                                ))}
                            </CTabContent>
                        </CCardBody>

                        {/* Sticky Footer for Actions */}
                        {!currentConfig?.isLocked && (
                            <div className="sticky-bottom bg-body-tertiary border-top p-3 d-flex justify-content-end shadow-lg mt-4 save-button-container" style={{ zIndex: 10, borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                                <CButton
                                    className="btn-premium px-5 py-2 d-flex align-items-center fw-bold text-white save-config-btn"
                                    onClick={handleSave}
                                    disabled={!unsavedChanges}
                                    style={{ borderRadius: '12px' }}
                                >
                                    <CIcon icon={cilSave} className="me-2 save-icon" />
                                    <span className="save-text-full">GUARDAR CONFIGURACIÓN DEL CICLO</span>
                                    <span className="save-text-short">GUARDAR</span>
                                </CButton>
                            </div>
                        )}

                    </CCard>
                </div>
            ) : (
                <CompetenciasInicio
                    onSelectSubject={setSelectedSubject}
                    configData={configData}
                    currentYear={currentYear}
                />
            )}

            <style>{`
                .ls-tight { letter-spacing: -0.5px; }
                .border-end-lg { border-right: 1px solid var(--cui-border-color) !important; }
                
                .btn-back-custom {
                    background: transparent;
                    color: var(--neutral-600);
                    border: 1px solid var(--neutral-200);
                    transition: all 0.2s ease;
                }

                .btn-back-custom:hover {
                    background: var(--neutral-100);
                    color: var(--primary-500);
                    border-color: var(--primary-200);
                }

                [data-coreui-theme="dark"] .btn-back-custom {
                    color: rgba(255, 255, 255, 0.6);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                [data-coreui-theme="dark"] .btn-back-custom:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    border-color: rgba(255, 255, 255, 0.2);
                }
        
        /* Save Button Responsive */
        .save-text-short { display: none; }
        .save-text-full { display: inline; }
        
        @media (max-width: 991.98px) {
            .border-end-lg { border-right: none !important; border-bottom: 1px solid var(--cui-border-color) !important; padding-bottom: 1.5rem !important; margin-bottom: 1.5rem !important; }
        }
        
        @media (max-width: 768px) {
            .save-button-container {
                padding: 0.75rem !important;
                justify-content: center !important;
            }
            
            .save-config-btn {
                padding: 0.5rem 1.5rem !important;
                font-size: 0.875rem !important;
                width: 100%;
                justify-content: center !important;
            }
            
            .save-text-short { display: inline; }
            .save-text-full { display: none; }
            
            .save-icon {
                margin-right: 0.5rem !important;
            }
        }
        
        [data-coreui-theme="dark"] .bg-body-tertiary { background-color: rgba(15, 23, 42, 0.9) !important; }
        [data-coreui-theme="dark"] .sticky-bottom { background-color: #1e293b !important; border-top-color: rgba(255, 255, 255, 0.1) !important; }
      `}</style>
        </CContainer>
    )
}

export default CompetenciasManager
