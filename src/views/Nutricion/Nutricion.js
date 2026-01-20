import React, { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CContainer,
    CRow,
    CCol,
    CSpinner,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CFormSelect,
    CBadge,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPlus,
    cilPencil,
    cilTrash,
    cilSearch,
    cilMedicalCross,
    cilUser,
    cilClock
} from '@coreui/icons'
import NutricionForm from './NutricionForm'
import {
    listNutritionRecords,
    createNutritionRecord,
    updateNutritionRecord,
    deleteNutritionRecord,
    getNutritionYears,
    NUTRITIONAL_STATUS
} from 'src/services/nutrition'
import ConfirmationModal from 'src/components/ConfirmationModal'

const Nutricion = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [availableYears, setAvailableYears] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        academicYear: '2025-2026',
        status: ''
    })

    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)

    const [deleteModal, setDeleteModal] = useState({
        visible: false,
        id: null,
        name: ''
    })

    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        fetchData()
    }, [filters, searchTerm])

    const loadInitialData = async () => {
        try {
            const years = await getNutritionYears()
            setAvailableYears(years)
            if (years.length > 0) {
                setFilters(prev => ({ ...prev, academicYear: years[0] }))
            }
        } catch (error) {
            console.error("Error loading initial data:", error)
        }
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await listNutritionRecords({ ...filters, searchTerm })
            setData(res)
        } catch (error) {
            console.error('Error fetching nutrition records:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async (formData) => {
        try {
            if (editing) {
                await updateNutritionRecord(editing.id, formData)
            } else {
                await createNutritionRecord(formData)
            }
            setShowModal(false)
            fetchData()
        } catch (error) {
            alert('Error al guardar el registro')
        }
    }

    const openEdit = (record) => {
        setEditing(record)
        setShowModal(true)
    }

    const openCreate = () => {
        setEditing(null)
        setShowModal(true)
    }

    const getStatusBadge = (status) => {
        const category = NUTRITIONAL_STATUS.find(s => s.value === status)
        return <CBadge color={category?.color || 'secondary'}>{status}</CBadge>
    }

    return (
        <CContainer fluid>
            <CRow>
                <CCol>
                    <CCard className="shadow-sm border-0 mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div className="bg-success" style={{ height: '5px' }}></div>

                        <CCardHeader className="border-bottom-0 pt-4 pb-3 px-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <h4 className="mb-1 fw-bold">
                                        <CIcon icon={cilMedicalCross} className="me-2 text-success" />
                                        Módulo de Nutrición
                                    </h4>
                                    <p className="text-muted mb-0 small">
                                        Seguimiento nutricional y antropométrico de estudiantes
                                    </p>
                                </div>
                                <CButton
                                    color="success"
                                    onClick={openCreate}
                                    className="d-flex align-items-center px-4 text-white"
                                    shape="rounded-pill"
                                >
                                    <CIcon icon={cilPlus} className="me-2 fw-bold" />
                                    NUEVO REGISTRO
                                </CButton>
                            </div>
                        </CCardHeader>

                        <CCardBody className="px-4 pb-4">
                            <div className="mb-4 p-3 rounded-3 border bg-body-tertiary">
                                <CRow className="g-3">
                                    <CCol md={4}>
                                        <CInputGroup>
                                            <CInputGroupText className="bg-transparent border-end-0">
                                                <CIcon icon={cilSearch} className="text-muted" />
                                            </CInputGroupText>
                                            <CFormInput
                                                className="bg-transparent border-start-0"
                                                placeholder="Buscar estudiante..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </CInputGroup>
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormSelect
                                            value={filters.academicYear}
                                            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                                        >
                                            {availableYears.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormSelect
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                        >
                                            <option value="">Todos los estados</option>
                                            {NUTRITIONAL_STATUS.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="success" variant="grow" />
                                    <div className="mt-3 text-muted">Cargando registros...</div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <CTable hover align="middle" className="border-secondary-subtle">
                                        <CTableHead color="dark">
                                            <CTableRow>
                                                <CTableHeaderCell>Estudiante</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center">Peso (kg)</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center">Estatura (m)</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center">IMC</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center">Estado Nutricional</CTableHeaderCell>
                                                <CTableHeaderCell>Última Evaluación</CTableHeaderCell>
                                                <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {data.length > 0 ? (
                                                data.map((record) => (
                                                    <CTableRow key={record.id}>
                                                        <CTableDataCell className="fw-semibold">
                                                            <CIcon icon={cilUser} className="me-2 text-muted" />
                                                            {record.studentName}
                                                        </CTableDataCell>
                                                        <CTableDataCell className="text-center">{record.weight}</CTableDataCell>
                                                        <CTableDataCell className="text-center">{record.height}</CTableDataCell>
                                                        <CTableDataCell className="text-center">
                                                            <CBadge color="secondary" shape="rounded-pill" variant="outline" className="text-body fw-bold">{record.imc}</CBadge>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="text-center">
                                                            {getStatusBadge(record.status)}
                                                        </CTableDataCell>
                                                        <CTableDataCell className="small text-body-secondary">
                                                            <CIcon icon={cilClock} className="me-1" size="sm" />
                                                            {record.lastCheckup || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell className="text-center">
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                variant="outline"
                                                                className="me-2"
                                                                onClick={() => openEdit(record)}
                                                            >
                                                                <CIcon icon={cilPencil} />
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="danger"
                                                                variant="outline"
                                                                onClick={() => setDeleteModal({
                                                                    visible: true,
                                                                    id: record.id,
                                                                    name: record.studentName
                                                                })}
                                                            >
                                                                <CIcon icon={cilTrash} />
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))
                                            ) : (
                                                <CTableRow>
                                                    <CTableDataCell colSpan="7" className="text-center py-4">
                                                        No se encontraron registros nutricionales.
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Nutricion Form Modal */}
            <NutricionForm
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                editing={editing}
                availableYears={availableYears}
                currentYear={filters.academicYear}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={deleteModal.visible}
                onClose={() => setDeleteModal({ visible: false, id: null, name: '' })}
                onConfirm={async () => {
                    await deleteNutritionRecord(deleteModal.id)
                    setDeleteModal({ visible: false, id: null, name: '' })
                    fetchData()
                }}
                title="Eliminar Registro"
                message={`¿Estás seguro de que deseas eliminar el registro nutricional de "${deleteModal.name}"?`}
                confirmText="Eliminar"
                type="danger"
            />
        </CContainer>
    )
}

export default Nutricion
