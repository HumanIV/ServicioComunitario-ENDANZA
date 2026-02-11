import React from 'react'
import { CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'

const WelcomeBanner = ({ title, subtitle, icon, colorClass = 'primary', bgIcon }) => {
    let bgSoftClass = 'bg-orange-soft';
    if (colorClass === 'success') bgSoftClass = 'bg-green-soft';
    if (colorClass === 'info') bgSoftClass = 'bg-blue-soft';
    if (colorClass === 'indigo') bgSoftClass = 'bg-purple-soft';
    // 'warning' or 'primary' defaults to orange-soft

    return (
        <CCard className="premium-card border-0 mb-5 overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className={`bg-${colorClass}`} style={{ height: '8px' }}></div>
            <CCardBody className="p-4 p-md-5 bg-transparent position-relative">
                <div className="d-flex align-items-center justify-content-between position-relative" style={{ zIndex: 2 }}>
                    <div>
                        <h2 className="fw-bold welcome-title mb-1 display-5">{title}</h2>
                        <p className="welcome-subtitle fs-5 mb-0 fw-medium">
                            {subtitle}
                        </p>
                    </div>
                    <div className={`d-none d-md-block ${bgSoftClass} p-4 rounded-circle`}>
                        <CIcon icon={icon} size="3xl" className={`text-${colorClass}`} style={{ height: '60px' }} />
                    </div>
                </div>
                {bgIcon && (
                    <div className="position-absolute bottom-0 end-0 opacity-10 mb-n5 me-n5" style={{ transform: 'rotate(-15deg)' }}>
                        <CIcon icon={bgIcon} className="welcome-icon-bg" style={{ height: '200px' }} />
                    </div>
                )}

                <style>{`
                    .welcome-title { color: var(--neutral-900); }
                    .welcome-subtitle { color: var(--neutral-600); }

                    [data-coreui-theme="dark"] .welcome-title { color: rgba(255, 255, 255, 0.95); }
                    [data-coreui-theme="dark"] .welcome-subtitle { color: rgba(255, 255, 255, 0.7); }
                `}</style>
            </CCardBody>
        </CCard>
    )
}

WelcomeBanner.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    bgIcon: PropTypes.object,
    colorClass: PropTypes.string
}

export default WelcomeBanner
