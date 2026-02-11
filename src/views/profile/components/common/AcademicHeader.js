import React from 'react'
import { CCardHeader, CRow, CCol, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'

const AcademicHeader = ({
    title,
    subtitle,
    studentCode,
    icon,
    colorClass = 'primary'
}) => {
    // Determine soft background class based on colorClass
    let bgSoftClass = 'bg-orange-soft';
    if (colorClass === 'success') bgSoftClass = 'bg-green-soft';
    if (colorClass === 'info') bgSoftClass = 'bg-blue-soft';
    if (colorClass === 'indigo') bgSoftClass = 'bg-purple-soft';

    return (
        <CCardHeader className={`${bgSoftClass} border-0 py-3 py-md-4 px-3 px-md-5 academic-header-card`}>
            <CRow className="align-items-center">
                <CCol xs={12} md={8}>
                    <div className="d-flex align-items-center">
                        <div className={`p-3 bg-${colorClass} rounded-circle me-3 shadow-sm d-none d-lg-block header-icon-box`}>
                            <CIcon icon={icon} size="xl" className="text-white" />
                        </div>
                        <div>
                            <h3 className={`mb-0 fw-bold ls-1 text-${colorClass} text-uppercase fs-5 fs-md-4`}>{title}</h3>
                            <p className="mb-0 header-subtitle small text-uppercase ls-1 fw-bold d-none d-sm-block" style={{ fontSize: '0.7rem' }}>
                                {subtitle}
                            </p>
                            <p className="mb-0 header-subtitle small text-uppercase ls-1 fw-bold d-sm-none" style={{ fontSize: '0.6rem' }}>
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </CCol>
                <CCol xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                    <CBadge className={`badge-id text-${colorClass} border border-${colorClass} border-opacity-10 px-3 py-2 rounded-pill shadow-sm w-100 w-md-auto d-flex align-items-center justify-content-center`}>
                        <span className="small">ID: {studentCode}</span>
                    </CBadge>
                </CCol>
            </CRow>

            <style>{`
                .header-subtitle { color: var(--neutral-600); }
                .badge-id { background-color: white; }

                [data-coreui-theme="dark"] .academic-header-card {
                    background-color: rgba(255, 255, 255, 0.02) !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                }
                [data-coreui-theme="dark"] .header-subtitle { color: rgba(255, 255, 255, 0.5); }
                [data-coreui-theme="dark"] .badge-id {
                    background-color: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }
                [data-coreui-theme="dark"] .header-icon-box {
                    opacity: 0.9;
                }
            `}</style>
        </CCardHeader>
    )
}

AcademicHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    studentCode: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    colorClass: PropTypes.string
}

export default AcademicHeader
