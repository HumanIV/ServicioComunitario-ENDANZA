import React from 'react'
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
    CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'

const StudentListModal = ({
    show,
    onClose,
    selectedSection,
    students,
    loadingStudents
}) => {
    return (
        <CModal size="xl" visible={show} onClose={onClose} backdrop="static" scrollable className="premium-modal">
            <CModalHeader className="bg-primary text-white border-0 py-3">
                <CModalTitle className="fw-bold d-flex align-items-center ls-1 small">
                    <CIcon icon={cilPeople} className="me-2" />
                    LISTA DE ESTUDIANTES: {selectedSection?.sectionName}
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4 bg-light-custom bg-opacity-10">
                <div className="mb-4 text-center">
                    <CBadge color="warning" className="px-4 py-2 rounded-pill shadow-sm fw-bold text-uppercase">
                        NIVEL: {selectedSection?.gradeLevel}
                    </CBadge>
                    <p className="mt-3 text-muted-custom small fw-medium">
                        Los estudiantes que aparecen a continuación se vinculan automáticamente al nivel <strong className="header-title-custom">{selectedSection?.gradeLevel}</strong> al momento de su inscripción.
                    </p>
                </div>

                {loadingStudents ? (
                    <div className="text-center py-5">
                        <CSpinner color="primary" />
                    </div>
                ) : (
                    <div className="table-responsive rounded-4 border border-light-custom overflow-hidden shadow-sm">
                        <CTable hover align="middle" className="mb-0 bg-transparent">
                            <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom border-opacity-10">
                                <CTableRow>
                                    <CTableHeaderCell className="ps-4 text-muted-custom small text-uppercase fw-bold">Código</CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-bold">Estudiante</CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-bold">Estatus</CTableHeaderCell>
                                    <CTableHeaderCell className="text-muted-custom small text-uppercase fw-bold">Periodo</CTableHeaderCell>
                                    <CTableHeaderCell className="pe-4 text-end text-muted-custom small text-uppercase fw-bold">Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {students.map((student) => (
                                    <CTableRow key={student.id} className="border-0">
                                        <CTableDataCell className="ps-4 fw-bold header-title-custom border-0">{student.code}</CTableDataCell>
                                        <CTableDataCell className="border-0">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-orange-soft rounded-circle me-3 d-flex align-items-center justify-content-center text-primary fw-bold shadow-sm" style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}>
                                                    {student.name[0]}{student.lastName[0]}
                                                </div>
                                                <div>
                                                    <span className="fw-semibold d-block header-title-custom leading-tight">{student.fullName}</span>
                                                    <small className="text-muted-custom fw-medium">{student.age} • {student.gender}</small>
                                                </div>
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className="border-0">
                                            <CBadge color="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 fw-bold">
                                                {student.status}
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell className="header-title-custom fw-medium border-0">{student.academicYear}</CTableDataCell>
                                        <CTableDataCell className="pe-4 text-end border-0">
                                            <CButton variant="outline" color="primary" size="sm" className="rounded-pill px-3 fw-bold hover-lift shadow-sm">
                                                Asistencia
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                                {students.length === 0 && (
                                    <CTableRow>
                                        <CTableDataCell colSpan="5" className="text-center py-4 text-muted-custom fw-medium border-0">
                                            No hay alumnos inscritos en este nivel académico.
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                    </div>
                )}
            </CModalBody>
            <CModalFooter className="border-0 bg-light-custom bg-opacity-10 border-top border-light-custom border-opacity-10">
                <CButton className="text-muted-custom fw-bold bg-transparent border-0 hover-lift" onClick={onClose}>
                    CERRAR LISTA
                </CButton>
                <CButton className="btn-premium px-4 shadow-sm">
                    DESCARGAR LISTA (PDF)
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default StudentListModal
