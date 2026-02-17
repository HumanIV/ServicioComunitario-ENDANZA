import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CButton,
    CSpinner,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilPlus,
    cilUserPlus,
    cilHistory,
    cilChevronRight,
    cilSearch
} from '@coreui/icons';
import { listStudents } from '../../services/studentsService';

const PreinscripcionInicio = ({ onStart }) => {
    const [recentPreenrolled, setRecentPreenrolled] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const allStudents = await listStudents();
            const preenrolled = allStudents.filter(s => s.status === 'Preinscrito');
            setRecentPreenrolled(preenrolled.slice(-5).reverse());
        } catch (error) {
            console.error("Error fetching pre-enrolled students:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <CRow className="justify-content-center mb-5">
                <CCol md={10} lg={9}>
                    <CCard className="premium-card border-0 shadow-lg overflow-hidden position-relative main-pre-card">
                        <CCardBody className="p-4 p-md-5 position-relative text-white text-center" style={{ zIndex: 2 }}>
                            <div className="mb-4">
                                <div className="d-inline-flex p-3 rounded-circle bg-white bg-opacity-10 mb-3 shadow-sm">
                                    <CIcon icon={cilUserPlus} size="3xl" className="text-white" />
                                </div>
                                <h1 className="fw-black mb-3 text-uppercase ls-tight display-5">Preinscripción</h1>
                                <p className="opacity-80 mb-4 fs-5 fw-medium mx-auto" style={{ maxWidth: '600px' }}>
                                    Inicie el registro de nuevos aspirantes y representantes para el ciclo escolar.
                                </p>
                            </div>
                            <CButton
                                onClick={onStart}
                                className="btn-pre-action px-5 py-3 rounded-pill shadow-lg fw-bold d-inline-flex align-items-center transition-all hover-lift"
                                style={{ fontSize: '1.2rem' }}
                            >
                                COMENZAR NUEVO REGISTRO <CIcon icon={cilPlus} size="lg" className="ms-3" />
                            </CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CRow className="justify-content-center">
                <CCol md={11} lg={10}>
                    <div className="d-flex align-items-center mb-4 px-2">
                        <div className="p-2 bg-primary bg-opacity-10 rounded-pill me-3">
                            <CIcon icon={cilHistory} className="text-primary" />
                        </div>
                        <h5 className="mb-0 fw-bold header-title-custom text-uppercase ls-1">Registros Recientes</h5>
                    </div>

                    <CCard className="premium-card border-0 shadow-sm bg-glass-premium overflow-hidden">
                        <CCardBody className="p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="warning" variant="grow" size="sm" />
                                    <p className="mt-3 text-muted-custom small fw-bold">CARGANDO...</p>
                                </div>
                            ) : recentPreenrolled.length > 0 ? (
                                <div className="table-responsive">
                                    <CTable align="middle" hover className="mb-0">
                                        <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom">
                                            <CTableRow>
                                                <CTableHeaderCell className="border-0 small fw-bold text-muted-custom ps-4 py-3">ASPIRANTE</CTableHeaderCell>
                                                <CTableHeaderCell className="border-0 small fw-bold text-muted-custom py-3">REPRESENTANTE</CTableHeaderCell>
                                                <CTableHeaderCell className="border-0 small fw-bold text-muted-custom py-3">GRADO</CTableHeaderCell>
                                                <CTableHeaderCell className="border-0 small fw-bold text-muted-custom py-3 text-end pe-4">DETALLES</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {recentPreenrolled.map((student, idx) => (
                                                <CTableRow key={student.id || idx} className="hover-row transition-all">
                                                    <CTableDataCell className="ps-4 py-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="avatar-initials me-3">
                                                                {student.name ? student.name.charAt(0) : '?'}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-contrast">{student.name} {student.lastName}</div>
                                                                <small className="text-muted-custom">{student.dni}</small>
                                                            </div>
                                                        </div>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <div className="small fw-medium text-muted-custom opacity-75">{student.representative || 'Pendiente'}</div>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CBadge className="grade-pill px-3 py-2 rounded-pill fw-bold">
                                                            {student.gradeLevel || 'N/A'}
                                                        </CBadge>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="text-end pe-4">
                                                        <CButton color="primary" variant="ghost" size="sm" className="rounded-pill p-2">
                                                            <CIcon icon={cilChevronRight} size="lg" />
                                                        </CButton>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <CIcon icon={cilSearch} size="3xl" className="mb-3 opacity-10 text-primary" />
                                    <h6 className="text-muted-custom fw-bold">No hay registros recientes</h6>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <style>{`
                .main-pre-card {
                    background: linear-gradient(135deg, #F28C0F 0%, #E07A00 100%) !important;
                    border-radius: 30px !important;
                }

                .btn-pre-action {
                    background: white !important;
                    color: #E07A00 !important;
                    border: none !important;
                }

                .btn-pre-action:hover {
                    background: #f8f9fa !important;
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;
                }

                [data-coreui-theme="dark"] .main-pre-card {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
                    border: 1px solid rgba(255, 255, 255, 0.05) !important;
                }

                [data-coreui-theme="dark"] .btn-pre-action {
                    background: var(--primary-500) !important;
                    color: white !important;
                }

                [data-coreui-theme="dark"] .btn-pre-action:hover {
                    background: var(--primary-600) !important;
                    box-shadow: 0 15px 30px rgba(242, 140, 15, 0.3) !important;
                }
                
                .avatar-initials {
                    width: 38px;
                    height: 38px;
                    background: rgba(224, 122, 0, 0.1);
                    color: #E07A00;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    border: 1px solid rgba(224, 122, 0, 0.1);
                }

                .grade-pill {
                    background: rgba(105, 165, 195, 0.1);
                    color: #4F8BAA;
                    border: 1px solid rgba(105, 165, 195, 0.1);
                    font-size: 0.75rem;
                }

                [data-coreui-theme="dark"] .avatar-initials {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    border-color: rgba(255, 255, 255, 0.1);
                }

                [data-coreui-theme="dark"] .grade-pill {
                    background: rgba(105, 165, 195, 0.2);
                    color: #69A5C3;
                    border-color: rgba(105, 165, 195, 0.2);
                }
            `}</style>
        </div>
    );
};

export default PreinscripcionInicio;
