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
    CRow,
    CCol,
    CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilUser, cilEnvelopeClosed, cilPhone, cilBadge } from '@coreui/icons';

const RepForm = ({ visible, onClose, onSave, initial = null }) => {
    const [dni, setDni] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initial) {
                setDni(initial.dni || 'V-');
                setFirstName(initial.first_name || '');
                setLastName(initial.last_name || '');
                setPhone(initial.phone || '');
                setEmail(initial.email || '');
            } else {
                setDni('V-');
                setFirstName('');
                setLastName('');
                setPhone('');
                setEmail('');
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
                role: 'representante' // Siempre representante en este módulo
            };
            await onSave(payload);
            onClose();
        } catch (error) {
            console.error('Error saving representative:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <CModal size="lg" visible={visible} onClose={onClose} backdrop="static" className="animate-fade-in premium-modal">
            <CModalHeader className="border-0 bg-warning text-white pb-3">
                <CModalTitle className="fw-bold d-flex align-items-center">
                    <CIcon icon={cilUser} className="me-2 text-white-50" />
                    {initial ? 'Editar Representante' : 'Nuevo Representante'}
                </CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleSubmit}>
                <CModalBody className="p-4 bg-light-custom bg-opacity-10">
                    <CRow className="g-4">
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Nombre(s)</label>
                            <CFormInput
                                placeholder="Ej: Juan"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="input-premium bg-light-custom border-light-custom"
                                invalid={!!errors.first_name}
                            />
                        </CCol>
                        <CCol md={6}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Apellido(s)</label>
                            <CFormInput
                                placeholder="Ej: Pérez"
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
                        <CCol md={12}>
                            <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Email / Usuario de Acceso</label>
                            <CFormInput
                                type="email"
                                placeholder="usuario@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-premium bg-light-custom border-light-custom"
                                invalid={!!errors.email}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter className="border-0 p-4 pt-0 bg-light-custom bg-opacity-10">
                    <CButton color="light" onClick={onClose} className="px-4 fw-bold text-muted-custom bg-transparent border-0 hover-lift">
                        CANCELAR
                    </CButton>
                    <CButton
                        type="submit"
                        className="btn-premium px-4 bg-warning border-0"
                        disabled={saving}
                    >
                        {saving ? <CSpinner size="sm" /> : <CIcon icon={cilSave} className="me-2 text-white" />}
                        <span className="text-white">GUARDAR CAMBIOS</span>
                    </CButton>
                </CModalFooter>
            </CForm>
        </CModal>
    );
};

export default RepForm;
