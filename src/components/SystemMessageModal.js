import React from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning, cilCheckCircle, cilInfo, cilXCircle } from '@coreui/icons'

const SystemMessageModal = ({
    visible,
    onClose,
    onConfirm,
    variant = 'alert',
    type = 'info',
    title,
    message,
    confirmText,
    cancelText = 'CANCELAR'
}) => {

    const config = {
        success: { icon: cilCheckCircle, color: 'success', btnColor: 'success' },
        warning: { icon: cilWarning, color: 'warning', btnColor: 'warning' },
        error: { icon: cilXCircle, color: 'danger', btnColor: 'danger' },
        info: { icon: cilInfo, color: 'info', btnColor: 'info' }
    }[type] || { icon: cilInfo, color: 'primary', btnColor: 'primary' }

    return (
        <CModal
            visible={visible}
            onClose={onClose}
            alignment="center"
            backdrop="static"
            className="premium-modal animate-fade-in"
        >
            <div className={`border-top border-4 border-${config.color} rounded-top`}>
                <CModalHeader closeButton={false} className="border-0 bg-transparent pt-4 pb-2 justify-content-center flex-column align-items-center">
                    <div className={`p-3 rounded-circle bg-${config.color} bg-opacity-10 mb-3`}>
                        <CIcon icon={config.icon} size="3xl" className={`text-${config.color}`} />
                    </div>
                    <CModalTitle className="fw-bold fs-4 text-center header-title-custom">
                        {title}
                    </CModalTitle>
                </CModalHeader>

                <CModalBody className="text-center py-2 px-4">
                    <p className="text-muted-custom mb-0 fs-6">
                        {message}
                    </p>
                </CModalBody>

                <CModalFooter className="border-0 bg-transparent pb-4 pt-3 justify-content-center gap-3">
                    {variant === 'confirm' && (
                        <CButton
                            color="secondary"
                            variant="ghost"
                            onClick={onClose}
                            className="px-4 fw-bold text-muted-custom hover-lift"
                        >
                            {cancelText}
                        </CButton>
                    )}
                    <CButton
                        color={config.btnColor}
                        onClick={variant === 'confirm' ? onConfirm : onClose}
                        className={`px-5 fw-bold text-white shadow-sm hover-lift btn-${config.btnColor}`}
                        style={{ borderRadius: '10px' }}
                    >
                        {confirmText || (variant === 'confirm' ? 'CONFIRMAR' : 'ENTENDIDO')}
                    </CButton>
                </CModalFooter>
            </div>
            <style>{`
                .btn-warning { color: white !important; }
            `}</style>
        </CModal>
    )
}

export default SystemMessageModal
