import React, { useState, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CForm,
    CFormInput,
    CModalFooter,
    CButton,
    CFormSelect,
    CRow,
    CCol,
    CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilUser, cilSchool,cilInfo } from '@coreui/icons';

const TeacherForm = ({ visible, onClose, onSave, initial = null, specialties = [] }) => {
    const [dni, setDni] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('active');
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initial) {
                setDni(initial.dni || '');
                setFirstName(initial.first_name || '');
                setLastName(initial.last_name || '');
                setPassword('');
                setPhone(initial.phone || '');
                setEmail(initial.email || '');
                setStatus(initial.status || 'active');
            } else {
                setDni('V-');
                setFirstName('');
                setLastName('');
                setPassword('');
                setPhone('');
                setEmail('');
                setStatus('active');
            }
            setErrors({});
        }
    }, [visible, initial]);

    const handleDniChange = (e) => {
        let value = e.target.value.toUpperCase();
        if (!value.startsWith('V-')) {
            value = 'V-' + value.replace(/V-|\s/g, '');
        }
        if (value === 'V') value = 'V-';
        const docValue = value.substring(2);
        const cleanedDocValue = docValue.replace(/[^0-9]/g, '');
        setDni('V-' + cleanedDocValue);
    };

    const validate = () => {
        const newErrors = {};
        if (!first_name.trim()) newErrors.first_name = 'El nombre es obligatorio';
        if (!last_name.trim()) newErrors.last_name = 'El apellido es obligatorio';
        if (!dni.trim() || dni.trim() === 'V-') newErrors.dni = 'La cédula es obligatoria';
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email inválido';
        if (!initial && (!password.trim() || password.length < 4)) newErrors.password = 'Contraseña débil (mín. 4 caracteres)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            const payload = {
                dni,
                first_name,
                last_name,
                phone,
                email,
                role: 'docente', // Fijo: siempre docente
                status,
                ...(password.trim() && { password })
            };
            await onSave(payload);
            onClose();
        } catch (error) {
            console.error('Error saving teacher:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <CModal size="lg" visible={visible} onClose={onClose} backdrop="static" className="animate-fade-in premium-modal">
            <CModalHeader className="border-0 pb-3" style={{ borderBottom: '1px solid rgba(224,122,0,0.2)' }}>
                <CModalTitle className="fw-bold d-flex align-items-center">
                    <CIcon icon={cilSchool} className="me-2" style={{ color: '#E07A00' }} />
                    {initial ? 'Editar Docente' : 'Nuevo Registro Docente'}
                </CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleSubmit}>
                <CModalBody className="p-4">
                    <CRow className="g-4">
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Nombre</label>
                            <CFormInput
                                placeholder="Ej: María"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="input-premium bg-light-custom border-light-custom"
                                invalid={!!errors.first_name}
                            />
                        </CCol>
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Apellido</label>
                            <CFormInput
                                placeholder="Ej: González"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                                className="input-premium bg-light-custom border-light-custom"
                                invalid={!!errors.last_name}
                            />
                        </CCol>
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Cédula (V-)</label>
                            <CFormInput
                                placeholder="V-12345678"
                                value={dni}
                                onChange={handleDniChange}
                                className="input-premium bg-light-custom border-light-custom"
                                invalid={!!errors.dni}
                            />
                        </CCol>
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Teléfono</label>
                            <CFormInput
                                placeholder="04XX-XXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-premium bg-light-custom border-light-custom"
                            />
                        </CCol>
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Email</label>
                            <CFormInput
                                type="email"
                                placeholder="docente@institucion.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-premium bg-light-custom border-light-custom"
                                invalid={!!errors.email}
                            />
                        </CCol>
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Estado de la cuenta</label>
                            <CFormSelect
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="input-premium bg-light-custom border-light-custom"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="suspended">Suspendido</option>
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">
                                {initial ? 'Nueva Contraseña (opcional)' : 'Contraseña de Acceso'}
                            </label>
                            <CFormInput
                                type="password"
                                placeholder="Mínimo 4 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-premium bg-light-custom border-light-custom"
                                invalid={!!errors.password}
                                required={!initial}
                            />
                        </CCol>
                        <CCol md={12}>
                            <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(224,122,0,0.05)', border: '1px solid rgba(224,122,0,0.1)' }}>
                                <small className="text-muted-custom">
                                    <CIcon icon={cilInfo} className="me-1" style={{ color: '#E07A00' }} />
                                    La especialidad y grados se asignarán después de crear el docente.
                                </small>
                            </div>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter className="border-0 p-4 pt-0">
                    <CButton 
                        color="light" 
                        onClick={onClose} 
                        className="px-4 fw-bold text-muted-custom bg-transparent border-0"
                    >
                        CANCELAR
                    </CButton>
                    <CButton
                        type="submit"
                        className="px-4 fw-bold text-white border-0"
                        style={{ backgroundColor: '#E07A00' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#C66900'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#E07A00'}
                        disabled={saving}
                    >
                        {saving ? <CSpinner size="sm" /> : <CIcon icon={cilSave} className="me-2" />}
                        {initial ? 'ACTUALIZAR DOCENTE' : 'REGISTRAR DOCENTE'}
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default TeacherForm;