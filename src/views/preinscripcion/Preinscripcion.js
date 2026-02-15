import React, { useState } from 'react';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CSpinner
} from '@coreui/react';
import { cilEducation, cilUser, cilPeople, cilCheckCircle } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import WelcomeBanner from '../Inicio/components/WelcomeBanner';
import RegistroRepresentante from './RegistroRepresentante';
import RegistroEstudiante from './RegistroEstudiante';
import { createUser, listUsers, updateUser } from "../../services/userService";
import { createStudent, listStudents } from '../../services/students';
import SystemMessageModal from '../../components/SystemMessageModal';

const Preinscripcion = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [representativeData, setRepresentativeData] = useState(null);
    const [existingStudents, setExistingStudents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({});

    const handleRepresentativeNext = async (data) => {
        setLoading(true);
        setRepresentativeData(data);
        try {
            // Si el representante ya tiene ID, buscamos sus estudiantes
            if (data.id || data.dni) {
                const allStudents = await listStudents();
                const filtered = allStudents.filter(s =>
                    s.RepresentanteId === data.id ||
                    s.RepresentanteCedula === data.dni
                );
                setExistingStudents(filtered);
            } else {
                setExistingStudents([]);
            }
            setStep(2);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        window.scrollTo(0, 0);
    };

    const handleFinalSave = async (studentsList) => {
        setLoading(true);
        try {
            let rep;

            // 1. Crear o actualizar el usuario representante
            if (representativeData.id) {
                // Si ya existe, actualizamos datos sin tocar la contraseña si es '****'
                const { password, ...payloadWithoutPassword } = representativeData;
                const updatePayload = password === '****' ? payloadWithoutPassword : representativeData;
                rep = await updateUser(representativeData.id, updatePayload);
            } else {
                // Si es nuevo, lo creamos
                rep = await createUser(representativeData);
            }

            // 2. Crear los estudiantes
            for (const student of studentsList) {
                const relationship = representativeData.parentesco === 'Otro'
                    ? representativeData.parentesco_otro
                    : representativeData.parentesco;

                const studentPayload = {
                    ...student,
                    representative: `${rep.first_name} ${rep.last_name}`,
                    RepresentanteNombre: rep.first_name,
                    RepresentanteApellido: rep.last_name,
                    RepresentanteCedula: rep.dni,
                    RepresentanteId: rep.id,
                    RepresentanteParentesco: relationship,
                    status: 'Preinscrito',
                    academicYear: '2024-2025'
                };

                // Si el representante es Madre o Padre, inyectamos sus datos en los campos específicos
                if (representativeData.parentesco === 'Madre') {
                    studentPayload.MadreNombre = rep.first_name;
                    studentPayload.MadreApellido = rep.last_name;
                    studentPayload.MadreCedula = rep.dni;
                    studentPayload.MadreTelefono = rep.phone;
                    studentPayload.MadreEmail = rep.email;
                    studentPayload.MadreParentesco = 'Madre';
                } else if (representativeData.parentesco === 'Padre') {
                    studentPayload.PadreNombre = rep.first_name;
                    studentPayload.PadreApellido = rep.last_name;
                    studentPayload.PadreCedula = rep.dni;
                    studentPayload.PadreTelefono = rep.phone;
                    studentPayload.PadreEmail = rep.email;
                    studentPayload.PadreParentesco = 'Padre';
                }

                await createStudent(studentPayload);
            }

            setModalConfig({
                type: 'success',
                title: 'REGISTRO COMPLETADO',
                message: `El representante ${rep.first_name} ${rep.last_name} y ${studentsList.length} estudiante(s) han sido registrados exitosamente.`,
                confirmText: 'ENTENDIDO',
                onConfirm: () => {
                    setModalVisible(false);
                    setStep(1);
                    setRepresentativeData(null);
                }
            });
            setModalVisible(true);
        } catch (error) {
            console.error("Error in preinscripcion:", error);
            setModalConfig({
                type: 'error',
                title: 'ERROR EN EL REGISTRO',
                message: 'Ocurrió un error al intentar guardar los datos. Por favor reintente.',
                confirmText: 'CERRAR'
            });
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CContainer fluid className="mt-4 pb-5">
            <CRow>
                <CCol>
                    <WelcomeBanner
                        title="Módulo de Preinscripción"
                        subtitle="Central de registro para nuevos representantes y estudiantes (Solo Administrador)."
                        icon={cilPeople}
                        bgIcon={cilEducation}
                        colorClass="warning"
                    />

                    {/* Stepper Indictor */}
                    <div className="d-flex justify-content-center mb-5 mt-2">
                        <div className="d-flex align-items-center position-relative w-100" style={{ maxWidth: '600px' }}>
                            <div className="flex-fill text-center">
                                <div
                                    className={`rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2 transition-all position-relative ${step >= 1 ? 'bg-warning text-white shadow' : 'bg-light-custom'}`}
                                    style={{ width: '50px', height: '50px', zIndex: 2 }}
                                >
                                    <CIcon icon={cilUser} />
                                </div>
                                <span className={`small fw-bold text-uppercase ls-1 ${step >= 1 ? 'text-warning' : 'opacity-50'}`}>Representante</span>
                            </div>

                            <div className="position-absolute w-50" style={{ left: '25%', top: '25px', height: '3px', backgroundColor: step >= 2 ? 'var(--cui-warning)' : 'var(--neutral-200)', zIndex: 0 }}></div>

                            <div className="flex-fill text-center">
                                <div
                                    className={`rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2 transition-all position-relative ${step >= 2 ? 'bg-warning text-white shadow' : 'bg-light-custom'}`}
                                    style={{ width: '50px', height: '50px', zIndex: 2, opacity: step >= 2 ? 1 : 0.5 }}
                                >
                                    <CIcon icon={cilEducation} />
                                </div>
                                <span className={`small fw-bold text-uppercase ls-1 ${step >= 2 ? 'text-warning' : 'opacity-50'}`}>Estudiante(s)</span>
                            </div>
                        </div>
                    </div>

                    <div className="preinscripcion-content mx-auto" style={{ maxWidth: '900px' }}>
                        {loading && (
                            <div className="text-center py-5">
                                <CSpinner color="warning" />
                                <p className="mt-3 text-muted-custom fw-bold">PROCESANDO REGISTRO...</p>
                            </div>
                        )}

                        {!loading && step === 1 && (
                            <RegistroRepresentante
                                onNext={handleRepresentativeNext}
                                initialData={representativeData}
                            />
                        )}

                        {!loading && step === 2 && (
                            <RegistroEstudiante
                                representative={representativeData}
                                existingStudents={existingStudents}
                                onBack={handleBack}
                                onSave={handleFinalSave}
                            />
                        )}
                    </div>
                </CCol>
            </CRow>

            <SystemMessageModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                {...modalConfig}
            />

            <style>{`
                .ls-1 { letter-spacing: 1px; }
                .transition-all { transition: all 0.3s ease; }
                .border-light-custom { border-color: rgba(0, 0, 0, 0.05) !important; }
                [data-coreui-theme="dark"] .border-light-custom { border-color: rgba(255, 255, 255, 0.05) !important; }
            `}</style>
        </CContainer>
    );
};

export default Preinscripcion;
