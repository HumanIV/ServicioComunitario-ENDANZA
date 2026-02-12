import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CButton,
    CRow,
    CCol,
    CSpinner,
    CAlert,
    CListGroup,
    CListGroupItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilUser, cilEnvelopeClosed, cilPhone, cilBadge, cilArrowRight, cilSearch } from '@coreui/icons';




const RegistroRepresentante = ({ onNext, initialData = {} }) => {
    const [formData, setFormData] = useState({
        dni: initialData?.dni || 'V-',
        first_name: initialData?.first_name || '',
        last_name: initialData?.last_name || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        password: initialData?.password || '1234',
        role: 'representante',
        status: 'active',
        parentesco: initialData?.parentesco || 'Madre',
        parentesco_otro: initialData?.parentesco_otro || ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [existingReps, setExistingReps] = useState([]);
    const [filteredReps, setFilteredReps] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [errors, setErrors] = useState({});
    const [loadingReps, setLoadingReps] = useState(false);

    useEffect(() => {
        fetchReps();
    }, []);

    const fetchReps = async () => {
        setLoadingReps(true);
        try {
            const users = await listUsers();
            const reps = users.filter(u => u.role === 'representante');
            setExistingReps(reps);
        } catch (error) {
            console.error("Error fetching representatives:", error);
        } finally {
            setLoadingReps(false);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim().length > 1) {
            const filtered = existingReps.filter(rep =>
                `${rep.first_name} ${rep.last_name}`.toLowerCase().includes(term.toLowerCase()) ||
                rep.dni.includes(term) ||
                rep.email.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredReps(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectRep = (rep) => {
        setFormData({
            ...formData,
            id: rep.id,
            dni: rep.dni,
            first_name: rep.first_name,
            last_name: rep.last_name,
            phone: rep.phone,
            email: rep.email,
            password: '****',
            parentesco: rep.parentesco || 'Madre',
            parentesco_otro: rep.parentesco_otro || ''
        });
        setSearchTerm(`${rep.first_name} ${rep.last_name}`);
        setShowSuggestions(false);
    };

    const handleDniChange = (e) => {
        let value = e.target.value.toUpperCase();
        if (!value.startsWith('V-')) {
            value = 'V-' + value.replace(/V-|\s/g, '');
        }
        if (value === 'V') value = 'V-';
        const docValue = value.substring(2);
        const cleanedDocValue = docValue.replace(/[^0-9]/g, '');
        setFormData({ ...formData, dni: 'V-' + cleanedDocValue });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.first_name.trim()) newErrors.first_name = 'El nombre es obligatorio';
        if (!formData.last_name.trim()) newErrors.last_name = 'El apellido es obligatorio';
        if (!formData.dni.trim() || formData.dni.trim() === 'V-') newErrors.dni = 'La cédula es obligatoria';
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
        if (formData.parentesco === 'Otro' && !formData.parentesco_otro.trim()) newErrors.parentesco_otro = 'Especifique el parentesco';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        onNext(formData);
    };

    return (
        <div className="animate-fade-in">
            <h4 className="fw-bold mb-4 text-warning d-flex align-items-center">
                <div className="p-2 bg-warning bg-opacity-10 rounded-circle me-3">
                    <CIcon icon={cilUser} size="lg" />
                </div>
                DATOS DEL REPRESENTANTE
            </h4>

            {/* Buscador de Representantes Existentes */}
            <CCard
                className="premium-card border-0 mb-4 shadow-sm position-relative"
                style={{ backgroundColor: 'rgba(245, 185, 55, 0.03)', zIndex: 100 }}
            >
                <CCardBody className="p-4" style={{ overflow: 'visible' }}>
                    <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">
                        🔍 Buscar Representante Existente
                    </label>
                    <div className="position-relative">
                        <CFormInput
                            placeholder="Buscar por nombre, cédula o correo..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                            className="input-premium py-2"
                        />
                        {showSuggestions && (
                            <CListGroup className="position-absolute w-100 shadow-lg mt-1 search-suggestions-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {filteredReps.length > 0 ? (
                                    filteredReps.map(rep => (
                                        <CListGroupItem
                                            key={rep.id}
                                            component="button"
                                            onClick={() => selectRep(rep)}
                                            className="d-flex justify-content-between align-items-center list-group-item-action border-light-custom"
                                        >
                                            <div>
                                                <div className="fw-bold text-contrast">{rep.first_name} {rep.last_name}</div>
                                                <small className="text-muted-custom">{rep.dni} | {rep.email}</small>
                                            </div>
                                            <CIcon icon={cilArrowRight} className="text-warning" />
                                        </CListGroupItem>
                                    ))
                                ) : (
                                    <CListGroupItem className="text-muted-custom small py-3">
                                        No se encontraron coincidencias. Puede registrarlo como nuevo abajo.
                                    </CListGroupItem>
                                )}
                            </CListGroup>
                        )}
                    </div>
                </CCardBody>
            </CCard>

            <CCard className="premium-card border-0 mb-4 shadow-sm">
                <CCardBody className="p-4">
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1 d-block mb-3">
                            📌 El Representante es el/la:
                        </label>
                        <div className="d-flex gap-2">
                            {['Madre', 'Padre', 'Otro'].map((option) => (
                                <CButton
                                    key={option}
                                    type="button"
                                    color={formData.parentesco === option ? 'warning' : 'light'}
                                    variant={formData.parentesco === option ? 'solid' : 'ghost'}
                                    className={`flex-fill py-2 fw-bold border-2 ${formData.parentesco === option ? 'text-white shadow-sm' : 'text-muted-custom border-light-custom'}`}
                                    onClick={() => setFormData({ ...formData, parentesco: option })}
                                    style={{ borderRadius: '12px' }}
                                >
                                    {option.toUpperCase()}
                                </CButton>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 d-flex align-items-center">
                        <div className="flex-grow-1 border-bottom border-light-custom"></div>
                        <span className="px-3 small fw-bold text-uppercase opacity-50">Complete los datos del {formData.parentesco.toLowerCase()}</span>
                        <div className="flex-grow-1 border-bottom border-light-custom"></div>
                    </div>

                    <CForm onSubmit={handleSubmit}>
                        <CRow className="g-4">
                            <CCol md={6}>
                                <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Nombre(s) <span className="text-danger">*</span></label>
                                <CFormInput
                                    placeholder="Ej: Carlos Eduardo"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="input-premium py-2"
                                    invalid={!!errors.first_name}
                                />
                            </CCol>
                            <CCol md={6}>
                                <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Apellido(s) <span className="text-danger">*</span></label>
                                <CFormInput
                                    placeholder="Ej: Rodríguez"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="input-premium py-2"
                                    invalid={!!errors.last_name}
                                />
                            </CCol>
                            <CCol md={6}>
                                <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Cédula de Identidad <span className="text-danger">*</span></label>
                                <CFormInput
                                    placeholder="V-12345678"
                                    value={formData.dni}
                                    onChange={handleDniChange}
                                    className="input-premium py-2"
                                    invalid={!!errors.dni}
                                />
                            </CCol>
                            <CCol md={6}>
                                <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Teléfono Principal <span className="text-danger">*</span></label>
                                <CFormInput
                                    placeholder="04XX-XXXXXXX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input-premium py-2"
                                />
                            </CCol>
                            <CCol md={12}>
                                <label className="form-label small fw-bold text-uppercase text-muted-custom ls-1">Correo Electrónico <span className="text-danger">*</span></label>
                                <CFormInput
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-premium py-2"
                                    invalid={!!errors.email}
                                />
                                <div className="form-text mt-2 opacity-50">Se utilizará para el acceso al sistema {formData.id ? '(Usuario existente)' : '(Contraseña por defecto: 1234)'}</div>
                            </CCol>

                            {formData.parentesco === 'Otro' && (
                                <CCol md={12} className="animate-fade-in">
                                    <div className="p-3 rounded-4 bg-warning bg-opacity-10 border border-warning border-opacity-10">
                                        <label className="form-label small fw-bold text-uppercase text-warning ls-1">Parentesco / Relación con el alumno <span className="text-danger">*</span></label>
                                        <CFormInput
                                            placeholder="Ej: Tío, Abuela, Tutor Legal..."
                                            value={formData.parentesco_otro}
                                            onChange={(e) => setFormData({ ...formData, parentesco_otro: e.target.value })}
                                            className="input-premium py-2 border-warning border-opacity-25"
                                            invalid={!!errors.parentesco_otro}
                                        />
                                        {errors.parentesco_otro && <div className="text-danger small mt-1">{errors.parentesco_otro}</div>}
                                    </div>
                                </CCol>
                            )}
                        </CRow>

                        <div className="d-flex justify-content-end mt-5 pt-4 border-top border-light-custom">
                            <CButton
                                type="submit"
                                className="btn-premium px-5 d-flex align-items-center fw-bold"
                            >
                                CONTINUAR A ESTUDIANTE
                                <CIcon icon={cilArrowRight} className="ms-2" />
                            </CButton>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>

            <style>{`
                .ls-1 { letter-spacing: 0.5px; }
                .search-suggestions-list { 
                    z-index: 9999 !important; 
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow-x: hidden;
                    background: #fff;
                }
                
                [data-coreui-theme="dark"] .search-suggestions-list {
                    background-color: #1a1a2e;
                    border-color: rgba(255,255,255,0.1);
                }

                [data-coreui-theme="dark"] .list-group-item {
                    background-color: #1a1a2e;
                    border-color: rgba(255,255,255,0.05);
                    color: rgba(255,255,255,0.8);
                }

                [data-coreui-theme="dark"] .list-group-item:hover {
                    background-color: rgba(245, 185, 55, 0.1);
                }

                [data-coreui-theme="dark"] .list-group-item .text-contrast {
                    color: #fff;
                }

                .border-light-custom {
                    border-color: rgba(0,0,0,0.05) !important;
                }

                [data-coreui-theme="dark"] .border-light-custom {
                    border-color: rgba(255,255,255,0.05) !important;
                }

                [data-coreui-theme="dark"] .premium-card[style*="backgroundColor"] {
                    background-color: rgba(245, 185, 55, 0.05) !important;
                }

                .opacity-50 {
                    opacity: 0.6 !important;
                }

                [data-coreui-theme="dark"] .opacity-50 {
                    color: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
};

export default RegistroRepresentante;
