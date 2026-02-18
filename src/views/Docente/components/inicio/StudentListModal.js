import React, { useState } from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CSpinner,
    CButtonGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilCheckCircle, cilXCircle, cilCalendarCheck, cilPlus, cilArrowLeft, cilSave } from '@coreui/icons'
import { saveAttendance, getStudentAttendance } from '../../../../services/attendanceService'

const StudentListModal = ({
    show,
    onClose,
    selectedSection,
    students,
    loadingStudents
}) => {
    const [isAttendanceMode, setIsAttendanceMode] = useState(false)
    const [attendance, setAttendance] = useState({})
    const [showDetails, setShowDetails] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)

    // Estado para trackear el historial por cada estudiante
    const [currentStudentHistory, setCurrentStudentHistory] = useState([])

    const today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const toggleAttendance = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }))
    }

    const resetAttendance = () => {
        setIsAttendanceMode(false)
        setAttendance({})
    }

    const handleSaveAttendance = async () => {
        try {
            // Objeto de asistencia por defecto si no se marcó nada
            const attendanceList = students.map(student => ({
                studentId: student.id,
                status: attendance[student.id] || 'present'
            }));

            const today = new Date().toISOString().split('T')[0];

            await saveAttendance({
                sectionId: selectedSection?.id,
                date: today,
                attendance: attendanceList
            });

            // Feedback visual simple (alert temporal, luego toast)
            // Se asume éxito
            resetAttendance();
        } catch (error) {
            console.error("Error saving attendance:", error);
            // Manejar error (mostrar toast si fuera posible)
        }
    }

    const getStudentHistory = (studentId) => {
        return currentStudentHistory || [];
    }

    const handleSeeDetails = async (student) => {
        setSelectedStudent(student)
        setShowDetails(true)
        setCurrentStudentHistory([]) // Limpiar previo

        try {
            const history = await getStudentAttendance(student.id);
            // Transformar si es necesario (el backend devuelve {date, status, ...})
            // El front espera {date: 'String fecha', status: 'present'}
            const formatted = history.map(h => ({
                date: new Date(h.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                status: h.status
            }));
            setCurrentStudentHistory(formatted);
        } catch (error) {
            console.error(error);
        }
    }

    const closeDetails = () => {
        setShowDetails(false)
        setSelectedStudent(null)
        setCurrentStudentHistory([])
    }

    const handleCancelAttendance = () => {
        resetAttendance()
    }

    return (
        <CModal size="xl" visible={show} onClose={onClose} backdrop="static" scrollable className="premium-modal shadow-lg">
            {/* CABECERA DINÁMICA */}
            <CModalHeader className="border-0 py-3 py-md-4 px-4 bg-transparent border-bottom border-light-custom border-opacity-10">
                <CModalTitle className="fw-bold d-flex align-items-center ls-1 header-title-custom fs-5 w-100">
                    {showDetails ? (
                        <>
                            <CButton
                                variant="ghost"
                                className="p-0 me-3 border-0 text-primary hover-lift"
                                onClick={closeDetails}
                            >
                                <CIcon icon={cilArrowLeft} size="lg" />
                            </CButton>
                            HISTORIAL ASISTENCIA: {selectedStudent?.fullName}
                        </>
                    ) : (
                        <>
                            <CIcon icon={cilPeople} className="me-3 text-primary" size="lg" />
                            LISTA DE ESTUDIANTES: {selectedSection?.sectionName}
                        </>
                    )}
                </CModalTitle>
            </CModalHeader>

            <CModalBody className="p-2 p-md-5 modal-body-premium">
                {/* SUB-HEADER / BANNER */}
                {!showDetails ? (
                    <div className="mb-4 mb-md-5 text-center px-2">
                        <div className="d-flex flex-column align-items-center mb-3 mb-md-4">
                            <CBadge color="warning" className="px-4 px-md-5 py-2 py-md-3 rounded-pill shadow-sm fw-bold text-uppercase ls-1 btn-premium text-white border-0 mb-3" style={{ fontSize: '0.7rem' }}>
                                NIVEL: {selectedSection?.gradeLevel}
                            </CBadge>
                            {isAttendanceMode && (
                                <div className="animate__animated animate__fadeInDown">
                                    <CBadge color="info" className="bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.75rem' }}>
                                        <CIcon icon={cilCalendarCheck} className="me-2" />
                                        {today}
                                    </CBadge>
                                </div>
                            )}
                        </div>
                        {!isAttendanceMode ? (
                            <p className="mt-2 text-muted-custom small fw-medium mx-auto px-2 opacity-75 d-none d-md-block" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                                Los estudiantes que aparecen a continuación se vinculan automáticamente al nivel <strong className="text-primary">{selectedSection?.gradeLevel}</strong>.
                            </p>
                        ) : (
                            <h5 className="fw-bold header-title-custom mb-2 fs-6 fs-md-5">Pase de Lista en Tiempo Real</h5>
                        )}
                    </div>
                ) : (
                    <div className="mb-4 mb-md-5 px-2">
                        <div className="d-flex align-items-center mb-4 p-3 p-md-4 rounded-4 bg-glass-premium border border-light-custom border-opacity-10 shadow-sm animate__animated animate__fadeIn">
                            <div className="bg-orange-soft rounded-circle me-3 d-flex align-items-center justify-content-center text-primary fw-bold shadow-sm flex-shrink-0" style={{ width: '48px', height: '48px', mdWidth: '64px', mdHeight: '64px', fontSize: '1.1rem' }}>
                                {selectedStudent?.name[0]}{selectedStudent?.lastName[0]}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="fw-bold mb-1 header-title-custom fs-6 fs-md-4 text-truncate">{selectedStudent?.fullName}</h4>
                                <div className="d-flex flex-wrap gap-2 gap-md-3 text-muted-custom small fw-bold text-uppercase ls-1" style={{ fontSize: '0.65rem' }}>
                                    <span>{selectedStudent?.code}</span>
                                    <span className="opacity-30 d-none d-md-inline">•</span>
                                    <span>{selectedStudent?.age} AÑOS</span>
                                    <span className="opacity-30 d-none d-md-inline">•</span>
                                    <span className="text-primary">{selectedStudent?.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENIDO PRINCIPAL (TABLAS) */}
                {loadingStudents ? (
                    <div className="text-center py-5">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                ) : showDetails ? (
                    /* VISTA DE DETALLES (HISTORIAL) */
                    <div className="animate__animated animate__fadeIn">
                        <div className="table-responsive rounded-4 border border-light-custom shadow-sm overflow-hidden">
                            <CTable hover align="middle" className="mb-0 bg-transparent">
                                <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom border-opacity-10">
                                    <CTableRow>
                                        <CTableHeaderCell className="ps-3 ps-md-4 py-3 text-muted-custom small text-uppercase fw-bold">Fecha de Clase</CTableHeaderCell>
                                        <CTableHeaderCell className="pe-3 pe-md-4 py-3 text-end text-muted-custom small text-uppercase fw-bold">Estado</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {getStudentHistory(selectedStudent?.id).map((record, idx) => (
                                        <CTableRow key={idx} className="border-0">
                                            <CTableDataCell className="ps-3 ps-md-4 py-3 py-md-4 fw-medium header-title-custom border-0 border-bottom border-light-custom border-opacity-5">
                                                <div className="d-flex align-items-center">
                                                    <CIcon icon={cilCalendarCheck} className="me-2 text-primary opacity-50 d-none d-sm-inline" />
                                                    <span className="small-mobile-text">{record.date}</span>
                                                </div>
                                            </CTableDataCell>
                                            <CTableDataCell className="pe-3 pe-md-4 py-3 py-md-4 text-end border-0 border-bottom border-light-custom border-opacity-5">
                                                {/* En móvil usamos icono, en desktop badge con texto */}
                                                <div className="d-md-none d-flex justify-content-end">
                                                    <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm ${record.status === 'present' ? 'bg-success' : 'bg-danger'}`} style={{ width: '32px', height: '32px' }}>
                                                        <CIcon icon={record.status === 'present' ? cilCheckCircle : cilXCircle} className="text-white" size="sm" />
                                                    </div>
                                                </div>
                                                <CBadge
                                                    color={record.status === 'present' ? 'success' : 'danger'}
                                                    className={`d-none d-md-inline-block px-4 py-2 rounded-pill fw-bold bg-opacity-10 border ${record.status === 'present' ? 'text-success border-success' : 'text-danger border-danger'} border-opacity-25`}
                                                    style={{ fontSize: '0.7rem' }}
                                                >
                                                    {record.status === 'present' ? 'PRESENTE' : 'AUSENTE'}
                                                </CBadge>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    </div>
                ) : (
                    /* VISTA DE LISTA / ASISTENCIA */
                    <div className="table-responsive rounded-4 border border-light-custom shadow-sm mb-4 bg-glass-premium">
                        <CTable hover responsive align="middle" className="mb-0 bg-transparent">
                            <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom border-opacity-10">
                                <CTableRow>
                                    {!isAttendanceMode && <CTableHeaderCell className="ps-4 py-3 text-muted-custom small text-uppercase fw-bold d-none d-md-table-cell">Código</CTableHeaderCell>}
                                    <CTableHeaderCell className="ps-3 ps-md-4 py-3 text-muted-custom small text-uppercase fw-bold">Estudiante</CTableHeaderCell>
                                    {!isAttendanceMode && (
                                        <>
                                            <CTableHeaderCell className="py-3 text-muted-custom small text-uppercase fw-bold d-none d-md-table-cell">Estatus</CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 text-muted-custom small text-uppercase fw-bold px-0 text-center d-none d-lg-table-cell">Periodo</CTableHeaderCell>
                                        </>
                                    )}
                                    <CTableHeaderCell className="pe-3 pe-md-4 py-3 text-end text-muted-custom small text-uppercase fw-bold">
                                        {isAttendanceMode ? 'Asistencia' : 'Acciones'}
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {students.map((student) => (
                                    <CTableRow key={student.id} className="border-0">
                                        {!isAttendanceMode && (
                                            <CTableDataCell className="ps-4 fw-bold header-title-custom border-0 border-bottom border-light-custom border-opacity-5 d-none d-md-table-cell">
                                                {student.code}
                                            </CTableDataCell>
                                        )}
                                        <CTableDataCell className={`${isAttendanceMode ? 'ps-3 ps-md-4' : 'ps-3 ps-md-4'} border-0 border-bottom border-light-custom border-opacity-5 py-2 py-md-3`}>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-orange-soft rounded-circle me-2 me-md-3 d-flex align-items-center justify-content-center text-primary fw-bold shadow-sm flex-shrink-0" style={{ width: '36px', height: '36px', mdWidth: '40px', mdHeight: '40px', fontSize: '0.9rem' }}>
                                                    {student.name[0]}{student.lastName[0]}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <span className="fw-semibold d-block header-title-custom leading-tight text-truncate" style={{ maxWidth: '160px', fontSize: '0.85rem' }}>{student.fullName}</span>
                                                    {!isAttendanceMode && <small className="text-muted-custom fw-medium d-none d-sm-block" style={{ fontSize: '0.7rem' }}>{student.age} • {student.gender}</small>}
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        {!isAttendanceMode && (
                                            <>
                                                <CTableDataCell className="border-0 border-bottom border-light-custom border-opacity-5 py-3 d-none d-md-table-cell">
                                                    <CBadge color="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 fw-bold" style={{ fontSize: '0.7rem' }}>
                                                        {student.status.toUpperCase()}
                                                    </CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell className="header-title-custom fw-bold border-0 border-bottom border-light-custom border-opacity-5 py-3 text-center small d-none d-lg-table-cell">
                                                    {student.academicYear}
                                                </CTableDataCell>
                                            </>
                                        )}
                                        <CTableDataCell className="pe-3 pe-md-4 text-end border-0 border-bottom border-light-custom border-opacity-5 py-2 py-md-3">
                                            {isAttendanceMode ? (
                                                <div className="d-flex justify-content-end">
                                                    {/* Versión Móvil: Iconos Circulares */}
                                                    <div className="d-md-none d-flex attendance-toggle-mobile bg-light-custom bg-opacity-10 rounded-pill p-1">
                                                        <div
                                                            className={`attendance-circle ${attendance[student.id] === 'present' ? 'active-present' : ''}`}
                                                            onClick={() => toggleAttendance(student.id, 'present')}
                                                        >
                                                            <CIcon icon={cilCheckCircle} />
                                                        </div>
                                                        <div
                                                            className={`attendance-circle ${attendance[student.id] === 'absent' ? 'active-absent' : ''}`}
                                                            onClick={() => toggleAttendance(student.id, 'absent')}
                                                        >
                                                            <CIcon icon={cilXCircle} />
                                                        </div>
                                                    </div>

                                                    {/* Versión Desktop: CButtonGroup */}
                                                    <CButtonGroup className="d-none d-md-flex rounded-pill overflow-hidden shadow-sm border border-light-custom border-opacity-10 bg-glass-premium p-1">
                                                        <CButton
                                                            className={`px-3 py-2 border-0 rounded-pill fw-bold transition-all ${attendance[student.id] === 'present' ? 'bg-success text-white shadow-sm' : 'bg-transparent text-muted-custom opacity-75'}`}
                                                            onClick={() => toggleAttendance(student.id, 'present')}
                                                            size="sm"
                                                        >
                                                            <CIcon icon={cilCheckCircle} className={`me-2 ${attendance[student.id] === 'present' ? 'text-white' : 'text-success'}`} />
                                                            <span>Presente</span>
                                                        </CButton>
                                                        <CButton
                                                            className={`px-3 py-2 border-0 rounded-pill fw-bold transition-all ${attendance[student.id] === 'absent' ? 'bg-danger text-white shadow-sm' : 'bg-transparent text-muted-custom opacity-75'}`}
                                                            onClick={() => toggleAttendance(student.id, 'absent')}
                                                            size="sm"
                                                        >
                                                            <CIcon icon={cilXCircle} className={`me-2 ${attendance[student.id] === 'absent' ? 'text-white' : 'text-danger'}`} />
                                                            <span>Ausente</span>
                                                        </CButton>
                                                    </CButtonGroup>
                                                </div>
                                            ) : (
                                                <CButton
                                                    variant="outline"
                                                    color="primary"
                                                    size="sm"
                                                    className="rounded-pill px-3 px-md-4 fw-bold hover-lift shadow-sm btn-sm-custom"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={() => handleSeeDetails(student)}
                                                >
                                                    Detalles
                                                </CButton>
                                            )}
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                                {students.length === 0 && (
                                    <CTableRow>
                                        <CTableDataCell colSpan="5" className="text-center py-5 text-muted-custom fw-medium border-0 opacity-50">
                                            <CIcon icon={cilPeople} size="3xl" className="mb-3 d-block mx-auto" />
                                            No hay alumnos inscritos.
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                    </div>
                )}
            </CModalBody>

            {/* FOOTER DINÁMICO */}
            <CModalFooter className="border-0 px-4 pb-4 pt-0 modal-footer-premium d-flex flex-wrap justify-content-center justify-content-md-end gap-2 gap-md-3">
                <CButton
                    className="text-primary-header fw-bold bg-transparent border-0 hover-lift px-3 px-md-4 py-2 ls-1"
                    onClick={() => {
                        if (showDetails) closeDetails()
                        else if (isAttendanceMode) handleCancelAttendance()
                        else onClose()
                    }}
                    style={{ fontSize: '0.75rem', minWidth: '100px' }}
                >
                    {showDetails ? 'VOLVER' : (isAttendanceMode ? 'CANCELAR' : 'CERRAR')}
                </CButton>

                {!isAttendanceMode && !showDetails && (
                    <CButton
                        className="bg-orange-soft text-primary fw-bold px-4 py-3 rounded-pill border-0 shadow-sm ls-1 d-flex align-items-center justify-content-center hover-lift"
                        onClick={() => setIsAttendanceMode(true)}
                        style={{ fontSize: '0.75rem', minWidth: '140px' }}
                    >
                        <CIcon icon={cilPlus} className="me-2" />
                        NUEVA CLASE
                    </CButton>
                )}

                {!showDetails && (
                    <CButton
                        className="btn-premium px-4 px-md-5 py-3 shadow-sm fw-bold ls-1 d-flex align-items-center justify-content-center rounded-pill"
                        style={{ minWidth: '180px', fontSize: '0.75rem' }}
                        onClick={isAttendanceMode ? handleSaveAttendance : null}
                    >
                        {isAttendanceMode ? (
                            <>
                                <CIcon icon={cilSave} className="me-2" />
                                GUARDAR ASISTENCIA
                            </>
                        ) : (
                            'DESCARGAR PDF'
                        )}
                    </CButton>
                )}
            </CModalFooter>

            <style>{`
                .attendance-toggle-mobile {
                    gap: 4px;
                }
                .attendance-circle {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(0,0,0,0.3);
                    background-color: rgba(0,0,0,0.05);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    border: 2px solid transparent;
                }
                [data-coreui-theme="dark"] .attendance-circle {
                    color: rgba(255,255,255,0.4);
                    background-color: rgba(255,255,255,0.1);
                }
                .attendance-circle i, .attendance-circle svg {
                    font-size: 1.2rem;
                }
                .active-present {
                    background-color: #198754 !important;
                    color: white !important;
                    border-color: #198754 !important;
                    box-shadow: 0 4px 12px rgba(25, 135, 84, 0.4);
                    transform: scale(1.1);
                }
                .active-absent {
                    background-color: #e07b00 !important;
                    color: white !important;
                    border-color: #e07b00 !important;
                    box-shadow: 0 4px 12px rgba(224, 123, 0, 0.4);
                    transform: scale(1.1);
                }
                .small-mobile-text {
                    font-size: 0.8rem;
                }
                @media (max-width: 576px) {
                    .small-mobile-text {
                        font-size: 0.75rem;
                        max-width: 140px;
                        display: inline-block;
                        line-height: 1.2;
                    }
                }
            `}</style>
        </CModal>
    )
}

export default StudentListModal
