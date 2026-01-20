import React, { useEffect, useState } from 'react'
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CRow,
    CCol,
    CFormInput,
    CFormSelect,
    CFormLabel,
    CFormTextarea,
    CInputGroup,
    CInputGroupText,
    CBadge,
    CCard,
    CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilUser,
    cilNotes,
    cilMedicalCross,
    cilCloudDownload,
    cilWarning,
    cilCheckCircle
} from '@coreui/icons'
import { NUTRITIONAL_STATUS } from 'src/services/nutrition'

const NutricionForm = ({ visible, onClose, onSave, editing, availableYears, currentYear }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        academicYear: currentYear || '2025-2026',
        weight: '',
        height: '',
        imc: '',
        status: 'Normopeso',
        observations: '',
        lastCheckup: new Date().toISOString().split('T')[0]
    })

    useEffect(() => {
        if (editing) {
            setFormData({ ...editing })
        } else {
            setFormData({
                studentName: '',
                academicYear: currentYear || '2025-2026',
                weight: '',
                height: '',
                imc: '',
                status: 'Normopeso',
                observations: '',
                lastCheckup: new Date().toISOString().split('T')[0]
            })
        }
    }, [editing, visible, currentYear])

    const calculateIMC = (w, h) => {
        if (w && h) {
            const imc = (w / (h * h)).toFixed(1)
            return imc
        }
        return ''
    }

    const updateIMCAndStatus = (w, h) => {
        const imc = calculateIMC(w, h)
        let status = 'Normopeso'
        if (imc) {
            const imcVal = parseFloat(imc)
            if (imcVal < 18.5) status = 'Déficit Nutricional'
            else if (imcVal < 25.0) status = 'Normopeso'
            else status = 'Sobrepeso'
        }
        return { imc, status }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        let updatedData = { ...formData, [name]: value }

        if (name === 'weight' || name === 'height') {
            const { imc, status } = updateIMCAndStatus(
                name === 'weight' ? value : formData.weight,
                name === 'height' ? value : formData.height
            )
            updatedData.imc = imc
            updatedData.status = status
        }

        setFormData(updatedData)
    }

    const handleDownloadGuide = (type) => {
        // Simulación de descarga de guía
        const guideName = type === 'deficit' ? 'Guia_Nutricion_Bajo_Peso.pdf' : 'Guia_Nutricion_Sobrepeso.pdf'
        alert(`Descargando: ${guideName}\n(En un sistema real, esto iniciaría la descarga del PDF técnico con recomendaciones nutricionales específicas).`)
    }

    const getStatusBadge = (status) => {
        const category = NUTRITIONAL_STATUS.find(s => s.value === status)
        return <CBadge color={category?.color || 'secondary'}>{status}</CBadge>
    }

    return (
        <CModal size="lg" visible={visible} onClose={onClose} backdrop="static">
            <CModalHeader className="bg-success text-white">
                <CModalTitle>
                    <CIcon icon={cilMedicalCross} className="me-2" />
                    {editing ? 'Editar Registro Nutricional' : 'Nuevo Registro Nutricional'}
                </CModalTitle>
            </CModalHeader>
            <CModalBody className="p-4">
                <CRow className="g-3">
                    <CCol md={8}>
                        <CFormLabel className="fw-bold">Estudiante</CFormLabel>
                        <CInputGroup>
                            <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                            <CFormInput
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleInputChange}
                                placeholder="Nombre completo del estudiante"
                                required
                            />
                        </CInputGroup>
                    </CCol>
                    <CCol md={4}>
                        <CFormLabel className="fw-bold">Año Académico</CFormLabel>
                        <CFormSelect
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleInputChange}
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    <CCol md={4}>
                        <CFormLabel className="fw-bold">Peso (Kg)</CFormLabel>
                        <CFormInput
                            type="number"
                            step="0.1"
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            placeholder="Ej: 52.3"
                        />
                    </CCol>
                    <CCol md={4}>
                        <CFormLabel className="fw-bold">Estatura (Metros)</CFormLabel>
                        <CFormInput
                            type="number"
                            step="0.01"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            placeholder="Ej: 1.60"
                        />
                    </CCol>
                    <CCol md={4}>
                        <CFormLabel className="fw-bold">Resultado IMC</CFormLabel>
                        <div className="p-2 border rounded bg-body-tertiary text-center fw-bold fs-5" style={{ height: '38px', lineHeight: '22px' }}>
                            {formData.imc || '--.-'}
                        </div>
                    </CCol>

                    <CCol md={12}>
                        <CCard className="bg-body-tertiary border-0 shadow-sm">
                            <CCardBody className="d-flex align-items-center justify-content-between p-3">
                                <div>
                                    <div className="text-body-secondary small text-uppercase fw-bold mb-1">Diagnóstico Sugerido</div>
                                    <div className="d-flex align-items-center">
                                        {formData.status === 'Normopeso' ? (
                                            <CIcon icon={cilCheckCircle} className="text-success me-2" size="xl" />
                                        ) : (
                                            <CIcon icon={cilWarning} className="text-warning me-2" size="xl" />
                                        )}
                                        <h5 className="mb-0">{getStatusBadge(formData.status)}</h5>
                                    </div>
                                </div>

                                {formData.status === 'Déficit Nutricional' && (
                                    <CButton
                                        color="warning"
                                        variant="outline"
                                        onClick={() => handleDownloadGuide('deficit')}
                                        className="d-flex align-items-center"
                                    >
                                        <CIcon icon={cilCloudDownload} className="me-2" />
                                        Guía Nutricional (Déficit)
                                    </CButton>
                                )}

                                {formData.status === 'Sobrepeso' && (
                                    <CButton
                                        color="danger"
                                        variant="outline"
                                        onClick={() => handleDownloadGuide('sobrepeso')}
                                        className="d-flex align-items-center"
                                    >
                                        <CIcon icon={cilCloudDownload} className="me-2" />
                                        Guía Nutricional (Sobrepeso)
                                    </CButton>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol md={12}>
                        <CFormLabel className="fw-bold"><CIcon icon={cilNotes} className="me-1" /> Observaciones Técnicas</CFormLabel>
                        <CFormTextarea
                            name="observations"
                            value={formData.observations}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Escriba aquí las recomendaciones o notas del especialista..."
                        />
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" variant="ghost" onClick={onClose}>
                    Cancelar
                </CButton>
                <CButton
                    color="success"
                    className="text-white px-4"
                    onClick={() => onSave(formData)}
                    disabled={!formData.studentName || !formData.weight || !formData.height}
                >
                    {editing ? 'Actualizar Registro' : 'Guardar Registro'}
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default NutricionForm
