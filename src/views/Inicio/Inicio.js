    import React from 'react'
        import { Link } from 'react-router-dom'
        import {
        CCard,
        CCardBody,
        CCardHeader,
        CButton,
        CCol,
        CContainer,
        CRow,
        } from '@coreui/react'

        import CIcon from '@coreui/icons-react'
        import { cilApps, cilBook, cilCart, cilDollar, cilLibraryBuilding, cilReportSlash } from '@coreui/icons'

        const Usuarios = () => {
        return (
            <CContainer className="mt-4">

            <CCard className="shadow-lg border-0">
                <CCardHeader className="text-center fs-3 fw-semibold bg-dark text-white py-3">
                Módulos del Sistema
                </CCardHeader>

                <CCardBody className="p-4">
                <CRow className="g-4 justify-content-center">

                    {/* CARD 1 */}
                    <CCol md={4}>
                    <CCard className="p-4 text-center shadow-lg border-0 module-card h-100">
                        <CIcon icon={cilLibraryBuilding} height={48} className="mb-3 text-primary" />
                        <h4 className="fw-bold">Módulo 1</h4>
                        <p className="text-muted">Gestión Administrativa</p>
                        <Link to="/AdminPanel">
                        <CButton color="primary" className="px-4 mt-2">
                            Entrar
                        </CButton>
                        </Link>
                    </CCard>
                    </CCol>

                    {/* CARD 2 */}
                    <CCol md={4}>
                    <CCard className="p-4 text-center shadow-lg border-0 module-card h-100">
                        <CIcon icon={cilBook} height={48} className="mb-3 text-success" />
                        <h4 className="fw-bold">Módulo 2</h4>
                        <p className="text-muted">Gestion de Recuros Humanos</p>
                        <Link to="/PanelRRHH">
                        <CButton color="success" className="px-4 mt-2">
                            Entrar
                        </CButton>
                        </Link>
                    </CCard>
                    </CCol>

                    {/* CARD 3 */}
                    <CCol md={4}>
                    <CCard className="p-4 text-center shadow-lg border-0 module-card h-100">
                        <CIcon icon={cilReportSlash} height={48} className="mb-3 text-warning" />
                        <h4 className="fw-bold">Módulo 3</h4>
                        <p className="text-muted">Generación de reportes.</p>
                        <Link to="/Reports">
                        <CButton color="warning" className="px-4 mt-2 text-dark">
                            Entrar
                        </CButton>
                        </Link>
                    </CCard>
                    </CCol>

                </CRow>
                </CCardBody>
            </CCard>

            {/* Estilo hover bonito */}
            <style>
                {`
                .module-card {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                    border-radius: 15px;
                }
                .module-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.18);
                }
                `}
            </style>

            </CContainer>
        )
        }

        export default Usuarios
