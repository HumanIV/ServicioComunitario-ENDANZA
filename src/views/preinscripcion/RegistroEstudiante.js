import React, { useState } from 'react';
import {
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CFormSelect,
    CButton,
    CRow,
    CCol,
    CBadge
} from '@coreui/react';
import { cilSave, cilEducation, cilArrowLeft, cilPlus, cilTrash, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const RegistroEstudiante = ({ representative, existingStudents = [], onBack, onSave }) => {
    const [newStudents, setNewStudents] = useState([
        {
            name: '',
            lastName: '',
            gradeLevel: '',
            section: 'A',
            birthDate: '',
            gender: ''
        }
    ]);

    const handleAddNewStudent = () => {
        setNewStudents([...newStudents, {
            name: '',
            lastName: '',
            gradeLevel: '',
            section: 'A',
            birthDate: '',
            gender: ''
        }]);
    };

    const handleRemoveNewStudent = (index) => {
        const list = [...newStudents];
        list.splice(index, 1);
        setNewStudents(list);
    };

    const handleStudentChange = (index, field, value) => {
        const list = [...newStudents];
        list[index][field] = value;
        setNewStudents(list);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Solo guardamos los nuevos. onSave los procesará.
        onSave(newStudents.filter(s => s.name.trim() !== ''));
    };

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-warning d-flex align-items-center mb-0">
                    <div className="p-2 bg-warning bg-opacity-10 rounded-circle me-3">
                        <CIcon icon={cilEducation} size="lg" />
                    </div>
                    GESTIÓN DE ESTUDIANTES
                </h4>
                <div className="p-2 px-3 bg-light-custom rounded-pill small fw-bold text-muted-custom">
                    Representante: <span className="text-warning">{representative?.first_name} {representative?.last_name}</span>
                </div>
            </div>

            {/* Listado de Estudiantes ya inscritos */}
            {existingStudents.length > 0 && (
                <div className="mb-5">
                    <h6 className="small fw-bold text-uppercase ls-1 opacity-50 mb-3 px-1">
                        Estudiantes ya vinculados ({existingStudents.length})
                    </h6>
                    <CRow className="g-3">
                        {existingStudents.map((stud, idx) => (
                            <CCol md={6} key={idx}>
                                <CCard className="premium-card border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(0, 56, 118, 0.02)' }}>
                                    <CCardBody className="p-3 d-flex align-items-center">
                                        <div className="p-2 bg-primary bg-opacity-10 rounded text-primary me-3">
                                            <CIcon icon={cilUser} />
                                        </div>
                                        <div>
                                            <div className="fw-bold small">{stud.name} {stud.lastName}</div>
                                            <div className="text-muted-custom extra-small">{stud.gradeLevel} | {stud.status || 'Activo'}</div>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        ))}
                    </CRow>
                </div>
            )}

            <div className="mb-4 d-flex align-items-center">
                <div className="flex-grow-1 border-bottom border-light-custom"></div>
                <span className="px-3 small fw-bold text-uppercase opacity-50">Inscribir Nuevos Estudiantes</span>
                <div className="flex-grow-1 border-bottom border-light-custom"></div>
            </div>

            <CForm onSubmit={handleSubmit}>
                {newStudents.map((student, idx) => (
                    <CCard key={idx} className="premium-card border-0 mb-4 shadow-sm position-relative overflow-visible">
                        {newStudents.length > 1 && (
                            <div
                                className="position-absolute"
                                style={{ top: '-15px', right: '-15px', zIndex: 10 }}
                            >
                                <CButton
                                    color="danger"
                                    onClick={() => handleRemoveNewStudent(idx)}
                                    className="rounded-circle p-2 shadow-sm text-white"
                                    size="sm"
                                >
                                    <CIcon icon={cilTrash} />
                                </CButton>
                            </div>
                        )}
                        <CCardBody className="p-4">
                            <div className="mb-3 d-flex align-items-center">
                                <CBadge color="warning" className="me-2">NUEVO #{idx + 1}</CBadge>
                                <span className="small fw-bold text-uppercase opacity-50">Carga de Datos</span>
                            </div>
                            <CRow className="g-4">
                                <CCol md={6}>
                                    <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Nombre(s) <span className="text-danger">*</span></label>
                                    <CFormInput
                                        placeholder="Ej: Sofía Isabella"
                                        value={student.name}
                                        onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                                        className="input-premium py-2"
                                        required
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Apellido(s) <span className="text-danger">*</span></label>
                                    <CFormInput
                                        placeholder="Ej: Rodríguez"
                                        value={student.lastName}
                                        onChange={(e) => handleStudentChange(idx, 'lastName', e.target.value)}
                                        className="input-premium py-2"
                                        required
                                    />
                                </CCol>
                                <CCol md={4}>
                                    <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Grado <span className="text-danger">*</span></label>
                                    <CFormSelect
                                        value={student.gradeLevel}
                                        onChange={(e) => handleStudentChange(idx, 'gradeLevel', e.target.value)}
                                        className="input-premium py-2"
                                        required
                                    >
                                        <option value="" disabled>Seleccione Grado</option>
                                        <option value="1er Grado">1er Grado</option>
                                        <option value="2do Grado">2do Grado</option>
                                        <option value="3er Grado">3er Grado</option>
                                        <option value="4to Grado">4to Grado</option>
                                        <option value="5to Grado">5to Grado</option>
                                        <option value="6to Grado">6to Grado</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol md={4}>
                                    <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Fecha de Nacimiento <span className="text-danger">*</span></label>
                                    <CFormInput
                                        type="date"
                                        value={student.birthDate}
                                        onChange={(e) => handleStudentChange(idx, 'birthDate', e.target.value)}
                                        className="input-premium py-2"
                                        required
                                    />
                                </CCol>
                                <CCol md={4}>
                                    <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Género <span className="text-danger">*</span></label>
                                    <CFormSelect
                                        value={student.gender}
                                        onChange={(e) => handleStudentChange(idx, 'gender', e.target.value)}
                                        className="input-premium py-2"
                                        required
                                    >
                                        <option value="" disabled>Seleccione Género</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Masculino">Masculino</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                ))}

                <CButton
                    color="warning"
                    variant="ghost"
                    onClick={handleAddNewStudent}
                    className="w-100 py-3 mb-5 border-2 border-dashed fw-bold d-flex align-items-center justify-content-center hover-lift"
                    style={{ borderStyle: 'dashed', borderRadius: '16px' }}
                >
                    <CIcon icon={cilPlus} className="me-2" />
                    AGREGAR OTRO ESTUDIANTE AL MISMO REPRESENTANTE
                </CButton>

                <div className="d-flex justify-content-between mt-5 pt-4 border-top border-light-custom pb-5">
                    <CButton
                        type="button"
                        color="secondary"
                        variant="ghost"
                        onClick={onBack}
                        className="px-5 d-flex align-items-center fw-bold text-muted-custom transition-all"
                    >
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        VOLVER A REPRESENTANTE
                    </CButton>
                    <CButton
                        type="submit"
                        className="btn-premium px-5 d-flex align-items-center fw-bold shadow-lg"
                    >
                        COMPLETE EL REGISTRO
                        <CIcon icon={cilSave} className="ms-2" />
                    </CButton>
                </div>
            </CForm>

            <style>{`
                .extra-small { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default RegistroEstudiante;
