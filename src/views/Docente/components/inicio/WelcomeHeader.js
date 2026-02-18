import React from 'react'
import { CCard, CCardBody, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilUser, cilChevronBottom } from '@coreui/icons'

const WelcomeHeader = ({
    selectedYear,
    setSelectedYear,
    academicYears,
    selectedTeacher,
    setSelectedTeacher,
    fullTeachersList,
    teacherStats,
    isTeacherView
}) => {
    return (
        <CCard className="shadow-lg border-0 mb-5 premium-card position-relative" style={{ borderRadius: '20px', zIndex: 10 }}>
            <div className="bg-primary" style={{ height: '8px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}></div>
            <CCardBody className="p-3 p-md-4 bg-light-custom" style={{ borderRadius: '20px' }}>
                <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 gap-lg-4">
                    <div className="mb-2 mb-lg-0 text-center text-lg-start">
                        <h2 className="fw-bold header-title-custom mb-1 fs-2 fs-md-1">¡Bienvenido!</h2>
                    </div>

                    <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-md-3 w-100 w-lg-auto">
                        {/* CONTENEDOR DE FILTROS EN MOVIL: Full Width */}
                        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                            {/* SELECTOR DE CICLO */}
                            <div className="bg-glass-premium p-2 px-3 rounded-pill border border-light-custom hover-shadow-sm transition-all shadow-sm w-100 d-flex justify-content-center" style={{ cursor: 'pointer' }}>
                                <CDropdown className="w-100 text-center">
                                    <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center justify-content-center w-100" style={{ whiteSpace: 'nowrap' }}>
                                        <CIcon icon={cilCalendar} className="me-2 opacity-50" />
                                        {selectedYear ? `Ciclo ${selectedYear}` : 'Seleccionar Ciclo'}
                                        <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                    </CDropdownToggle>
                                    <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 animate-fade-in dropdown-menu-premium-scroll w-100 text-center">
                                        {academicYears.map(y => (
                                            <CDropdownItem key={y} onClick={() => setSelectedYear(y)} active={selectedYear === y} className="dropdown-item py-2 px-3 fw-semibold text-secondary hover-bg-light transition-all cursor-pointer">
                                                Ciclo {y}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>

                            {/* SELECTOR DE PROFESOR - Si es docente, solo muestra su nombre */}
                            <div className="bg-glass-premium p-2 px-3 rounded-pill border border-light-custom hover-shadow-sm transition-all shadow-sm w-100 d-flex justify-content-center" style={{ cursor: isTeacherView ? 'default' : 'pointer' }}>
                                {isTeacherView ? (
                                    <div className="w-100 text-center border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center justify-content-center">
                                        <CIcon icon={cilUser} className="me-2 opacity-50" />
                                        {selectedTeacher || 'Docente'}
                                    </div>
                                ) : (
                                    <CDropdown className="w-100 text-center">
                                        <CDropdownToggle caret={false} className="border-0 bg-transparent fw-bold text-primary shadow-none p-0 py-1 d-flex align-items-center justify-content-center w-100" style={{ whiteSpace: 'nowrap' }}>
                                            <CIcon icon={cilUser} className="me-2 opacity-50" />
                                            {selectedTeacher || 'Seleccionar'}
                                            <CIcon icon={cilChevronBottom} size="sm" className="ms-2 opacity-50" />
                                        </CDropdownToggle>
                                        <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 animate-fade-in dropdown-menu-premium-scroll w-100" style={{ minWidth: '220px' }}>
                                            {fullTeachersList.map(t => (
                                                <CDropdownItem key={t} onClick={() => setSelectedTeacher(t)} active={selectedTeacher === t} className="py-2 px-3 dropdown-item-premium">
                                                    {t}
                                                </CDropdownItem>
                                            ))}
                                        </CDropdownMenu>
                                    </CDropdown>
                                )}
                            </div>
                        </div>

                        {/* ESTADISTICAS */}
                        <div className="d-flex gap-4 gap-md-3 ms-md-3 border-top border-md-top-0 border-start-md border-light-custom ps-md-3 pt-3 pt-md-0 w-100 w-md-auto justify-content-center mt-2 mt-md-0">
                            <div className="text-center">
                                <h3 className="mb-0 fw-bold text-primary fs-4 fs-md-3">{teacherStats.groups}</h3>
                                <small className="text-muted-custom text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>Grupos</small>
                            </div>
                            <div className="text-center ms-3 border-start border-light-custom ps-3">
                                <h3 className="mb-0 fw-bold text-primary fs-4 fs-md-3">{teacherStats.classes}</h3>
                                <small className="text-muted-custom text-uppercase fw-bold ls-1" style={{ fontSize: '0.6rem' }}>Clases/Sem</small>
                            </div>
                        </div>
                    </div>
                </div>
            </CCardBody>
        </CCard >
    )
}

export default WelcomeHeader
