import React, { useEffect, useState, useMemo } from 'react'
import {
    CCard, CCardBody, CCardHeader, CContainer, CRow, CCol,
    CButton, CTable, CTableHead, CTableRow, CTableHeaderCell,
    CTableBody, CTableDataCell, CBadge, CSpinner,
    CToaster, CToast, CToastHeader, CToastBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPeople, cilInfo, cilSearch, cilCheckCircle, cilWarning, cilUser, cilChild, cilEnvelopeClosed, cilPhone, cilBadge
} from '@coreui/icons'

// IMPORTAR EL SERVICIO ACTUALIZADO
import { listRepresentantes, getRepresentanteConEstudiantes } from '../../services/representanteService';
import AvatarLetter from 'src/components/AvatarLetter'
import SearchInput from 'src/components/SearchInput'
import Pagination from 'src/components/Pagination'
import InfoRepresentante from './components/InfoRepresentante'

const Representantes = () => {
    const [representatives, setRepresentatives] = useState([])
    const [loading, setLoading] = useState(true)
    const [showInfo, setShowInfo] = useState(false)
    const [selectedRep, setSelectedRep] = useState(null)
    const [toasts, setToasts] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(8)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        try {
            console.log("🔍 Cargando representantes...");
            // Usar el nuevo servicio de listado
            const reps = await listRepresentantes();
            console.log("📥 Representantes recibidos:", reps);
            
            setRepresentatives(reps || []);
            
            if (reps.length === 0) {
                showToast('No hay representantes registrados', 'info');
            }
        } catch (error) {
            console.error('Error fetching representatives:', error);
            showToast('Error al cargar representantes', 'danger');
        } finally {
            setLoading(false)
        }
    }

    const showToast = (message, color = 'success') => {
        setToasts(prev => [...prev, { id: Date.now(), message, color }])
    }

    // Filtrar representantes por término de búsqueda
    const filteredReps = useMemo(() => {
        if (!searchTerm) return representatives;
        
        const searchLower = searchTerm.toLowerCase();
        return representatives.filter(rep => 
            rep.first_name?.toLowerCase().includes(searchLower) ||
            rep.last_name?.toLowerCase().includes(searchLower) ||
            rep.dni?.toLowerCase().includes(searchLower) ||
            rep.email?.toLowerCase().includes(searchLower)
        );
    }, [representatives, searchTerm]);

    // Calcular representantes sin estudiantes
    const orphanReps = useMemo(() => {
        // Esta información se podría calcular si tuviéramos los estudiantes
        // Por ahora lo dejamos como 0
        return 0;
    }, []);

    const totalPages = Math.ceil(filteredReps.length / itemsPerPage)
    const currentPageData = filteredReps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleSeeDetails = async (rep) => {
        try {
            setLoading(true);
            console.log("🔍 Obteniendo detalles para representante ID:", rep.id_representante);
            
            // Obtener representante con sus estudiantes usando el nuevo servicio
            const data = await getRepresentanteConEstudiantes(rep.id_representante);
            console.log("📥 Detalles recibidos:", data);
            
            if (data && data.ok) {
                setSelectedRep({
                    ...data.representante,
                    representados: data.estudiantes || []
                });
                setShowInfo(true);
            } else {
                showToast('Error al cargar detalles del representante', 'danger');
            }
        } catch (error) {
            console.error('Error fetching representative details:', error);
            showToast('Error al cargar detalles', 'danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CContainer fluid className="mt-4 pb-5">
            <CCard className="shadow-lg border-0 mb-4 premium-card" style={{ borderRadius: '20px' }}>
                <div className="bg-warning" style={{ height: '8px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}></div>
                <CCardHeader className="bg-light-custom border-0 pt-4 px-4" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h3 className="fw-bold header-title-custom mb-1">
                                <CIcon icon={cilUser} className="me-2 text-warning" size="lg" />
                                Gestión de Representantes
                            </h3>
                            <p className="text-muted-custom mb-0 small fw-medium">Administración de apoderados y vinculación con estudiantes</p>
                        </div>
                        {orphanReps > 0 && (
                            <CBadge color="warning" className="bg-opacity-10 text-warning border border-warning border-opacity-10 px-3 py-2 rounded-pill d-flex align-items-center">
                                <CIcon icon={cilWarning} className="me-2" />
                                {orphanReps} Representantes sin alumnos vinculados
                            </CBadge>
                        )}
                    </div>
                </CCardHeader>
                <CCardBody className="p-4 bg-light-custom">
                    <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 bg-light-custom bg-opacity-10 p-3 rounded-4 border border-light-custom border-opacity-10 shadow-sm">
                        <div className="small fw-bold text-muted-custom text-uppercase ls-1">
                            Total Representantes: <span className="text-warning">{filteredReps.length}</span>
                        </div>
                        <div style={{ maxWidth: '400px', width: '100%' }}>
                            <SearchInput
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                placeholder="Buscar por nombre, cédula o email..."
                                className="bg-transparent border border-light-custom border-opacity-25 text-contrast placeholder-opacity-50"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner color="warning" variant="grow" />
                            <div className="mt-3 text-muted fw-medium">Cargando representantes...</div>
                        </div>
                    ) : currentPageData.length > 0 ? (
                        <>
                            <div className="table-responsive rounded-4 border border-light-custom shadow-sm">
                                <CTable align="middle" hover responsive className="mb-0 border-0 custom-premium-table">
                                    <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom border-opacity-10">
                                        <CTableRow>
                                            <CTableHeaderCell className="border-0 bg-transparent py-3 text-muted-custom small fw-bold ls-1 ps-4">REPRESENTANTE</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 bg-transparent py-3 text-muted-custom small fw-bold ls-1">CONTACTO</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 bg-transparent py-3 text-muted-custom small fw-bold ls-1 text-end pe-4">ACCIONES</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {currentPageData.map(rep => (
                                            <CTableRow key={rep.id_representante || rep.id_usuario} className="hover-row transition-all align-middle">
                                                <CTableDataCell className="ps-4 py-3 border-bottom-light">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3 flex-shrink-0">
                                                            <AvatarLetter
                                                                name={rep.first_name}
                                                                lastName={rep.last_name}
                                                                size="md"
                                                                className="shadow-sm border border-light"
                                                            />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="fw-bold header-title-custom text-truncate" style={{ maxWidth: '180px' }}>
                                                                {rep.first_name} {rep.last_name}
                                                            </div>
                                                            <div className="text-muted-custom small d-flex align-items-center">
                                                                <CIcon icon={cilBadge} size="sm" className="me-1 opacity-50" />
                                                                {rep.dni}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="border-bottom-light">
                                                    <div className="d-flex flex-column gap-1">
                                                        <div className="text-muted-custom small d-flex align-items-center">
                                                            <CIcon icon={cilEnvelopeClosed} size="sm" className="me-2 text-warning opacity-75" />
                                                            {rep.email}
                                                        </div>
                                                        <div className="text-muted-custom small d-flex align-items-center">
                                                            <CIcon icon={cilPhone} size="sm" className="me-2 text-warning opacity-75" />
                                                            {rep.phone || 'S/N'}
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end pe-4 border-bottom-light">
                                                    <CButton
                                                        color="light"
                                                        size="sm"
                                                        onClick={() => handleSeeDetails(rep)}
                                                        className="px-2 px-md-3 rounded-pill fw-bold border-0 bg-info bg-opacity-10 text-info hover-lift shadow-sm d-inline-flex align-items-center"
                                                    >
                                                        <CIcon icon={cilInfo} className="me-0 me-md-2" />
                                                        <span className="d-none d-md-inline">VER FICHA</span>
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </div>
                            {totalPages > 1 && (
                                <div className="mt-4 d-flex justify-content-center">
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-5 border rounded-4 border-dashed bg-light">
                            <CIcon icon={cilSearch} size="3xl" className="text-muted opacity-25 mb-3" />
                            <h5 className="text-muted">No se encontraron representantes</h5>
                            <CButton color="link" className="text-warning" onClick={() => setSearchTerm('')}>Limpiar criterios de búsqueda</CButton>
                        </div>
                    )}
                </CCardBody>
            </CCard>

            <InfoRepresentante
                visible={showInfo}
                onClose={() => setShowInfo(false)}
                representative={selectedRep}
            />

            <CToaster placement="top-end">
                {toasts.map(t => (
                    <CToast key={t.id} autohide={true} visible={true} color={t.color} className="text-white shadow">
                        <CToastHeader closeButton className="bg-transparent border-0 text-white">
                            <CIcon icon={cilCheckCircle} className="me-2" />
                            <strong className="me-auto">Sistema ENDANZA</strong>
                        </CToastHeader>
                        <CToastBody className="pt-0">{t.message}</CToastBody>
                    </CToast>
                ))}
            </CToaster>
            <style>{`
                [data-coreui-theme="dark"] .bg-warning.bg-opacity-10 {
                    background-color: rgba(245, 185, 55, 0.15) !important;
                }
            `}</style>
        </CContainer>
    )
}

export default Representantes