    /** PANEL RRHH — VERSIÓN CORPORATIVA MEJORADA VISUALMENTE **/

    import React, { useState, useEffect, useRef } from 'react'
    import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CContainer,
    CCol,
    CForm,
    CFormInput,
    CFormSelect,
    CFormLabel,
    CRow,
    CWidgetStatsA,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    } from '@coreui/react'

    import { CChart, CChartLine } from '@coreui/react-chartjs'
    import CIcon from '@coreui/icons-react'
    import { cilPencil, cilTrash, cilMagnifyingGlass, cilArrowTop, cilOptions } from '@coreui/icons'
    import { cibAddthis } from '@coreui/icons'
    import { getStyle } from '@coreui/utils'

    export const PanelRRHH = () => {
    // ------------------ ESTADOS ------------------
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [dateFilter, setDateFilter] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('')

    // ------------------ DATOS ------------------
    const tableExample = [
        {
        ID: 1,
        Asunto: 'EJEMPLO 2, DENUNCIA',
        FechaCreacion: '2024-11-01',
        Estatus: 'EN PROCESO',
        DEPARTAMENTO: 'RRHH',
        },
        {
        ID: 9,
        Asunto: 'EJEMPLO 2, FALTA',
        FechaCreacion: '2025-10-17',
        Estatus: 'FINALIZADO',
        DEPARTAMENTO: 'RRHH',
        },
        {
        ID: 3,
        Asunto: 'EJEMPLO 3, Reunión',
        FechaCreacion: '2025-10-20',
        Estatus: 'PENDIENTE',
        DEPARTAMENTO: 'RRHH',
        },
    ]

    // ------------------ ACCIONES ------------------
    const handleEdit = (item) => console.log('Editar:', item)
    const handleDelete = (item) => console.log('Eliminar:', item)

    // ------------------ GRAFICO ------------------
    const chartRef = useRef(null)

    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        chart.options.plugins.legend.labels.color = getStyle('--cui-body-color')
        chart.options.scales.x.ticks.color = getStyle('--cui-body-color')
        chart.options.scales.y.ticks.color = getStyle('--cui-body-color')

        chart.update()
    }, [])

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
        {
            label: 'Ingresos',
            borderColor: 'rgba(16, 255, 124, 1)',
            backgroundColor: 'rgba(16,255,124,0.20)',
            data: [4, 10, 9, 2, 4],
            fill: true,
            tension: 0.4,
        },
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
        x: { ticks: { color: getStyle('--cui-body-color') } },
        y: { ticks: { color: getStyle('--cui-body-color') } },
        },
    }

    return (
        <>
        <h1 className="mb-4 fw-bold" style={{ letterSpacing: '0.5px', fontSize: '2rem' }}>
            Resumen General RRHH
        </h1>

        <CContainer>

            {/* ------------------ WIDGETS PRINCIPALES ------------------ */}
            <CCard className="mb-4 shadow border-0" style={{ borderRadius: '16px' }}>
            <CCardBody className="py-4">
                <CRow className="gy-4">
                <CCol sm={6}>
                    <CWidgetStatsA
                    className="shadow-sm"
                    color="primary"
                    style={{ borderRadius: '14px' }}
                    value={
                        <>
                        20{' '}
                        <span className="fs-6 fw-normal">
                            (5% <CIcon icon={cilArrowTop} />)
                        </span>
                        </>
                    }
                    title="Empleados Activos"
                    />
                </CCol>

                <CCol sm={6}>
                    <CWidgetStatsA
                    className="shadow-sm"
                    color="info"
                    style={{ borderRadius: '14px' }}
                    value={
                        <>
                        3{' '}
                        <span className="fs-6 fw-normal">
                            (1% <CIcon icon={cilArrowTop} />)
                        </span>
                        </>
                    }
                    title="Permisos Pendientes"
                    />
                </CCol>
                </CRow>
            </CCardBody>
            </CCard>

            {/* ------------------ GRAFICO PRINCIPAL ------------------ */}
            <CCard className="mb-4 shadow border-0" style={{ borderRadius: '16px' }}>
            <CCardBody>
                <h5 className="fw-bold mb-3">Estadística de Ingresos</h5>

                <div
                className="p-4"
                style={{
                    background: 'rgba(0,0,0,0.03)',
                    borderRadius: '12px',
                }}
                >
                <CChart type="line" data={chartData} options={chartOptions} ref={chartRef} />
                </div>
            </CCardBody>
            </CCard>

            {/* ------------------ WIDGETS GRANDES ------------------ */}
            <CCard className="mb-4 shadow border-0" style={{ borderRadius: '16px' }}>
            <CCardBody>
                <CRow className="gy-4">

                {/* REGISTRADOS */}
                <CCol xs={12} md={6}>
                    <CWidgetStatsA
                    color="primary"
                    className="shadow-sm"
                    style={{ borderRadius: '14px' }}
                    value={
                        <>
                        9.000{' '}
                        <span className="fs-6 fw-normal">
                            (40.9% <CIcon icon={cilArrowTop} />)
                        </span>
                        </>
                    }
                    title="Trámites Registrados"
                    action={
                        <CDropdown alignment="end">
                        <CDropdownToggle color="transparent" caret={false} className="p-0">
                            <CIcon icon={cilOptions} className="text-white" />
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem>Ver detalles</CDropdownItem>
                            <CDropdownItem>Descargar reporte</CDropdownItem>
                        </CDropdownMenu>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                        className="mt-3 mx-3"
                        style={{ height: '70px' }}
                        data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                            datasets: [
                            {
                                label: 'Trámites',
                                backgroundColor: 'transparent',
                                borderColor: 'rgba(255,255,255,.55)',
                                pointBackgroundColor: '#5856d6',
                                data: [65, 59, 84, 84, 51, 55, 40],
                            },
                            ],
                        }}
                        options={{
                            plugins: { legend: { display: false } },
                            maintainAspectRatio: false,
                            scales: {
                            x: { display: false },
                            y: { display: false },
                            },
                        }}
                        />
                    }
                    />
                </CCol>

                {/* FINALIZADOS */}
                <CCol xs={12} md={6}>
                    <CWidgetStatsA
                    color="info"
                    className="shadow-sm"
                    style={{ borderRadius: '14px' }}
                    value={
                        <>
                        37{' '}
                        <span className="fs-6 fw-normal">
                            (+5% <CIcon icon={cilArrowTop} />)
                        </span>
                        </>
                    }
                    title="Trámites Finalizados"
                    action={
                        <CDropdown alignment="end">
                        <CDropdownToggle color="transparent" caret={false} className="p-0">
                            <CIcon icon={cilOptions} className="text-white" />
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem>Ver finalizados</CDropdownItem>
                            <CDropdownItem>Exportar</CDropdownItem>
                        </CDropdownMenu>
                        </CDropdown>
                    }
                    chart={
                        <CChartLine
                        className="mt-3 mx-3"
                        style={{ height: '70px' }}
                        data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                            datasets: [
                            {
                                label: 'Finalizados',
                                backgroundColor: 'transparent',
                                borderColor: 'rgba(255,255,255,.55)',
                                pointBackgroundColor: '#39f',
                                data: [5, 10, 9, 17, 22, 25, 18],
                            },
                            ],
                        }}
                        options={{
                            plugins: { legend: { display: false } },
                            maintainAspectRatio: false,
                            scales: {
                            x: { display: false },
                            y: { display: false },
                            },
                        }}
                        />
                    }
                    />
                </CCol>

                </CRow>
            </CCardBody>
            </CCard>

            {/* ------------------ TABLA ------------------ */}
            <CCard className="shadow border-0" style={{ borderRadius: '16px' }}>
            <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Gestión Administrativa</h4>

                <CButton color="primary" className="shadow-sm px-4 py-2">
                    Nuevo Trámite
                    <CIcon className="ms-2" icon={cibAddthis} />
                </CButton>
                </div>

                {/* FILTROS */}
                <CForm className="mb-4">
                <CRow className="g-3">
                    <CCol xs={12} md={3}>
                    <CFormLabel>Buscar</CFormLabel>
                    <CFormInput
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="shadow-sm"
                    />
                    </CCol>

                    <CCol xs={12} md={3}>
                    <CFormLabel>Estatus</CFormLabel>
                    <CFormSelect
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="shadow-sm"
                    >
                        <option value="">Todos</option>
                        <option value="EN PROCESO">En Proceso</option>
                        <option value="FINALIZADO">Finalizado</option>
                        <option value="PENDIENTE">Pendiente</option>
                    </CFormSelect>
                    </CCol>

                    <CCol xs={12} md={3}>
                    <CFormLabel>Fecha</CFormLabel>
                    <CFormSelect
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="shadow-sm"
                    >
                        <option value="">Todas</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </CFormSelect>
                    </CCol>

                    <CCol xs={12} md={3}>
                    <CFormLabel>Departamento</CFormLabel>
                    <CFormSelect
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="shadow-sm"
                    >
                        <option value="">Todos</option>
                        <option value="RRHH">RRHH</option>
                    </CFormSelect>
                    </CCol>
                </CRow>
                </CForm>

                {/* TABLA */}
                <CTable hover responsive align="middle" className="shadow-sm">
                <CTableHead>
                    <CTableRow style={{ background: 'rgba(0,0,0,0.05)' }}>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Asunto</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Estatus</CTableHeaderCell>
                    <CTableHeaderCell>Departamento</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>

                <CTableBody>
                    {tableExample.map((item) => (
                    <CTableRow key={item.ID}>
                        <CTableDataCell className="fw-semibold">{item.ID}</CTableDataCell>
                        <CTableDataCell>{item.Asunto}</CTableDataCell>
                        <CTableDataCell>{item.FechaCreacion}</CTableDataCell>
                        <CTableDataCell>
                        <span
                            className={`badge ${
                            item.Estatus === 'FINALIZADO'
                                ? 'bg-success'
                                : item.Estatus === 'EN PROCESO'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary'
                            }`}
                        >
                            {item.Estatus}
                        </span>
                        </CTableDataCell>
                        <CTableDataCell>{item.DEPARTAMENTO}</CTableDataCell>

                        <CTableDataCell>
                        <CButtonGroup>
                            <CButton
                            color="primary"
                            size="sm"
                            className="shadow-sm"
                            onClick={() => handleEdit(item)}
                            >
                            Editar <CIcon className="ms-2" icon={cilPencil} />
                            </CButton>

                            <CButton
                            color="danger"
                            size="sm"
                            className="shadow-sm"
                            onClick={() => handleDelete(item)}
                            >
                            Eliminar <CIcon className="ms-2" icon={cilTrash} />
                            </CButton>
                        </CButtonGroup>
                        </CTableDataCell>
                    </CTableRow>
                    ))}
                </CTableBody>
                </CTable>
            </CCardBody>

            <CCardFooter className="fw-semibold text-center py-3">
                Mostrando {tableExample.length} trámites
            </CCardFooter>
            </CCard>
        </CContainer>
        </>
    )
    }

    export default PanelRRHH
