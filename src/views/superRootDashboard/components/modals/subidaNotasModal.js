import React, { useState, useEffect } from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormInput,
    CFormLabel,
    CButton,
    CRow,
    CCol,
    CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload, cilClock, cilSave, cilWarning, cilCalendar, cilPowerStandby, cilCheckCircle } from '@coreui/icons'

const SubidaNotasModal = ({
    visible,
    onClose,
    periodoSubida,
    onSave
}) => {
    const [localData, setLocalData] = useState({
        fechaInicio: '',
        fechaFin: '',
        activo: false
    })

    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (!localData.fechaInicio || !localData.fechaFin) {
            alert('Por favor complete ambas fechas')
            return
        }
        setLoading(true)
        try {
            await onSave(localData)
        } finally {
            setLoading(false)
        }
    }

    // Normalizar fecha para el input type="date" (YYYY-MM-DD)
    const normalizeDate = (dateStr) => {
        if (!dateStr) return ''
        // Si ya es YYYY-MM-DD, devolverlo tal cual (evita desfases UTC)
        if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
            return dateStr.split('T')[0]
        }
        try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return ''
            // Para objetos Date, usargetFullYear/Month/Date para evitar shift UTC
            const y = date.getFullYear()
            const m = String(date.getMonth() + 1).padStart(2, '0')
            const d = String(date.getDate()).padStart(2, '0')
            return `${y}-${m}-${d}`
        } catch (e) {
            return ''
        }
    }

    useEffect(() => {
        if (periodoSubida && visible) {
            setLocalData({
                fechaInicio: normalizeDate(periodoSubida.fechaInicio),
                fechaFin: normalizeDate(periodoSubida.fechaFin),
                activo: periodoSubida.activo || false
            })
        }
    }, [periodoSubida, visible])

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '---'
        try {
            // Priorizar parseo manual para evitar desfase de zona horaria (UTC shifts)
            const s = String(dateStr).split('T')[0]
            const parts = s.split('-')
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`
            }

            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return '---'
            return date.toLocaleDateString('es-ES')
        } catch (e) {
            return '---'
        }
    }

    const getStatus = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startDate = new Date(localData.fechaInicio)
        const endDate = new Date(localData.fechaFin)

        // ✅ PRIMERO: Verificar si está activo
        if (localData.activo) {
            return {
                type: 'active',
                message: 'Carga Habilitada',
                detail: `Los docentes pueden subir notas hasta el ${formatDateDisplay(localData.fechaFin)}`,
                icon: cilCheckCircle,
                color: 'success'
            }
        }

        // ❌ SOLO si NO está activo, verificar fechas
        if (today > endDate) {
            return { type: 'expired', message: 'Periodo Finalizado', detail: `La recepción cerró el ${formatDateDisplay(localData.fechaFin)}`, icon: cilWarning, color: 'danger' }
        }

        if (today < startDate) {
            return { type: 'pending', message: 'Programado', detail: `Habilitación automática el ${formatDateDisplay(localData.fechaInicio)}`, icon: cilClock, color: 'warning' }
        }

        // Si no está activo pero está en fechas
        return { type: 'closed', message: 'Recepción Desactivada', detail: 'Los docentes no tienen permiso para cargar notas', icon: cilPowerStandby, color: 'muted' }
    }

    const status = getStatus()

    return (
        <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" className="animate-fade-in premium-modal">
            <div className="bg-info" style={{ height: '8px', borderTopLeftRadius: 'var(--cui-modal-border-radius)', borderTopRightRadius: 'var(--cui-modal-border-radius)' }}></div>
            <CModalHeader className="border-0 py-4 px-4 bg-transparent outline-none">
                <CModalTitle className="fw-bold d-flex align-items-center header-title-custom w-100">
                    <div className="bg-info bg-opacity-10 p-3 rounded-4 me-3">
                        <CIcon icon={cilCloudUpload} className="text-info" size="xl" />
                    </div>
                    <div className="flex-grow-1">
                        <h4 className="mb-0 fw-black header-title-custom ls-tight">Control de Calificaciones</h4>
                        <div className="small text-muted-custom fw-medium">Gestión de tiempos para la subida de notas</div>
                    </div>
                    <CButton
                        color={localData.activo ? 'info' : 'secondary'}
                        variant="outline"
                        className={`rounded-pill px-4 py-2 fw-bold ls-1 d-flex align-items-center transition-all ${localData.activo ? 'bg-info bg-opacity-10' : 'bg-secondary bg-opacity-10'}`}
                        onClick={() => setLocalData({ ...localData, activo: !localData.activo })}
                        style={{ fontSize: '0.75rem' }}
                    >
                        <CIcon icon={cilPowerStandby} className="me-2" />
                        {localData.activo ? 'RECEPCIÓN ON' : 'RECEPCIÓN OFF'}
                    </CButton>
                </CModalTitle>
            </CModalHeader>

            <CModalBody className="p-4 pt-2">
                <CForm>
                    <div className="p-4 rounded-5 bg-light-custom bg-opacity-10 border border-light-custom border-opacity-20 mb-4 shadow-inner text-center">
                        <CRow className="g-4">
                            <CCol xs={12} md={6}>
                                <div className="p-4 bg-white rounded-4 shadow-sm border border-light-custom border-opacity-10 dark-card-fix text-start">
                                    <CFormLabel className="small fw-black text-uppercase text-muted-custom ls-1 mb-3 d-block">
                                        <CIcon icon={cilCalendar} className="me-2 text-info" />
                                        Inicio de Carga
                                    </CFormLabel>
                                    <CFormInput
                                        type="date"
                                        value={localData.fechaInicio}
                                        onChange={(e) => setLocalData({ ...localData, fechaInicio: e.target.value })}
                                        className="input-premium-clean p-0 border-0 fs-4 fw-bold header-title-custom bg-transparent outline-none"
                                    />
                                </div>
                            </CCol>
                            <CCol xs={12} md={6}>
                                <div className="p-4 bg-white rounded-4 shadow-sm border border-light-custom border-opacity-10 dark-card-fix text-start">
                                    <CFormLabel className="small fw-black text-uppercase text-muted-custom ls-1 mb-3 d-block">
                                        <CIcon icon={cilWarning} className="me-2 text-danger" />
                                        Cierre de Carga
                                    </CFormLabel>
                                    <CFormInput
                                        type="date"
                                        value={localData.fechaFin}
                                        onChange={(e) => setLocalData({ ...localData, fechaFin: e.target.value })}
                                        className="input-premium-clean p-0 border-0 fs-4 fw-bold header-title-custom bg-transparent outline-none"
                                    />
                                </div>
                            </CCol>
                        </CRow>
                    </div>

                    <div className={`p-4 rounded-5 text-center transition-all border-status-${status.color} bg-status-light-${status.color}`}>
                        <div className="d-flex align-items-center justify-content-center gap-4">
                            <div className={`status-icon-blob bg-${status.color} bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm`}>
                                <CIcon icon={status.icon} size="xl" className={`text-${status.color}`} />
                            </div>
                            <div className="text-start">
                                <h6 className={`fw-black mb-0 text-uppercase ls-1 text-${status.color}`}>{status.message}</h6>
                                <div className="small fw-medium opacity-75">{status.detail}</div>
                            </div>
                        </div>
                    </div>
                </CForm>
            </CModalBody>

            <CModalFooter className="border-0 p-4 pt-1">
                <CButton variant="ghost" className="px-4 fw-bold text-muted-custom hover-lift shadow-none border-0" onClick={onClose}>
                    CANCELAR
                </CButton>
                <CButton
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-premium px-5 py-3 rounded-pill fw-bold ms-auto shadow-sm text-white bg-info border-0"
                >
                    {loading ? (
                        <CSpinner size="sm" className="me-2" />
                    ) : (
                        <CIcon icon={cilSave} className="me-2" />
                    )}
                    {loading ? 'GUARDANDO...' : 'ACTUALIZAR PERIODO'}
                </CButton>
            </CModalFooter>

            <style>{`
        .ls-tight { letter-spacing: -0.04em; }
        .fw-black { font-weight: 900; }
        .input-premium-clean:focus { outline: none !important; box-shadow: none !important; }
        
        .border-status-success { border: 2px solid rgba(25, 135, 84, 0.2); }
        .bg-status-light-success { background-color: rgba(25, 135, 84, 0.05); }
        .border-status-warning { border: 2px solid rgba(255, 193, 7, 0.2); }
        .bg-status-light-warning { background-color: rgba(255, 193, 7, 0.05); }
        .border-status-danger { border: 2px solid rgba(220, 53, 69, 0.2); }
        .bg-status-light-danger { background-color: rgba(220, 53, 69, 0.05); }
        .border-status-muted { border: 2px solid rgba(108, 117, 125, 0.2); }
        .bg-status-light-muted { background-color: rgba(108, 117, 125, 0.05); }

        [data-coreui-theme="dark"] .dark-card-fix { background-color: rgba(255,255,255,0.05) !important; }
        .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
      `}</style>
        </CModal>
    )
}

export default SubidaNotasModal