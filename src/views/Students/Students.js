    import React, { useEffect, useState } from "react"
    import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CContainer,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CToast,
    CToastHeader,
    CToastBody,
    CToaster,
    CRow,
    CCol,
    } from "@coreui/react"

    import CIcon from "@coreui/icons-react"
    import { cilBook, cilTrash } from "@coreui/icons"
    import { cibAddthis } from "@coreui/icons"
    import { Link } from "react-router-dom"

    const Students = () => {

    // ---------------------- CRUD (SIMULADO) ---------------------- //
    const [students, setStudents] = useState([])

    const staticStudents = [
        {
        id: 1,
        Grado: "1er Grado",
        Seccion: "D1",
        NombreEstudiante: "María",
        ApellidoEstudiante: "González",
        RepresentanteNombre: "Ana",
        RepresentanteApellido: "González",
        RepresentanteCedula: "V-12345678"
        },
        {
        id: 2,
        Grado: "2do Grado",
        Seccion: "D2",
        NombreEstudiante: "Carlos",
        ApellidoEstudiante: "Pérez",
        RepresentanteNombre: "José",
        RepresentanteApellido: "Pérez",
        RepresentanteCedula: "V-98765432"
        },
        {
        id: 3,
        Grado: "3er Grado",
        Seccion: "D2",
        NombreEstudiante: "Lucía",
        ApellidoEstudiante: "Ramírez",
        RepresentanteNombre: "Carmen",
        RepresentanteApellido: "Ramírez",
        RepresentanteCedula: "V-56789123"
        }
    ]

    useEffect(() => {
        setStudents(staticStudents)
    }, [])

    // ---------------------- BUSCADOR Y FILTROS ---------------------- //
    const [searchText, setSearchText] = useState("")
    const [filterGrade, setFilterGrade] = useState("")
    const [filterSection, setFilterSection] = useState("")

    const filteredStudents = students.filter((s) => {
        const matchSearch = `${s.NombreEstudiante} ${s.ApellidoEstudiante}`
        .toLowerCase()
        .includes(searchText.toLowerCase())

        const matchGrade = filterGrade ? s.Grado === filterGrade : true
        const matchSection = filterSection ? s.Seccion === filterSection : true

        return matchSearch && matchGrade && matchSection
    })

    // ---------------------- TOAST ---------------------- //
    const [toasts, setToasts] = useState([])
    const showToast = (type, message) => {
        setToasts((prev) => [...prev, { id: Date.now(), type, message }])
    }

    // ---------------------- MODAL ---------------------- //
    const [modalVisible, setModalVisible] = useState(false)
    const [modalType, setModalType] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)

    const openModal = (type, item = null) => {
        setModalType(type)
        setSelectedItem(item)
        setModalVisible(true)
    }

    const deleteItem = () => {
        const newList = students.filter((s) => s.id !== selectedItem.id)
        setStudents(newList)
        showToast("danger", "Estudiante eliminado correctamente")
        setModalVisible(false)
    }

    return (
        <>
        <h1>Estudiantes</h1>

        <CContainer>

            {/* ---------- RESUMEN ---------- */}
            <CCard className="mb-4">
            <CCardBody>
                <p>Módulo para gestionar estudiantes inscritos.</p>
            </CCardBody>
            </CCard>

            {/* ---------- TABLA ---------- */}
            <CCard>
            <CCardBody>

                <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Listado de Estudiantes</h4>

                <Link to="/inscripcion">
                    <CButton color="primary">
                    Inscripción
                    <CIcon className="ms-2" icon={cibAddthis} />
                    </CButton>
                </Link>
                </div>

                {/* ----------- BUSCADOR Y FILTROS ----------- */}
                <CCard className="mb-4 p-3">


                <CRow className="g-3">

                    {/* BUSCADOR */}
                    <CCol xs={12} md={6} lg={4}>
                    <label className="fw-bold">Buscar Estudiante</label>
                    <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Buscar por nombre o apellido..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    </CCol>

                    {/* FILTRO GRADO */}
                    <CCol xs={12} md={6} lg={4}>
                    <label className="fw-bold">Grado</label>
                    <select
                        className="form-select mt-2"
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option>1er Grado</option>
                        <option>2do Grado</option>
                        <option>3er Grado</option>
                        <option>4to Grado</option>
                        <option>5to Grado</option>
                        <option>6to Grado</option>
                        <option>7mo Grado</option>
                        <option>8vo Grado</option>
                    </select>
                    </CCol>

                    {/* FILTRO SECCIÓN */}
                    <CCol xs={12} md={6} lg={4}>
                    <label className="fw-bold">Sección</label>
                    <select
                        className="form-select mt-2"
                        value={filterSection}
                        onChange={(e) => setFilterSection(e.target.value)}
                    >
                        <option value="">Todas</option>
                        <option>D1</option>
                        <option>D2</option>
                        <option>D3</option>
                    </select>
                    </CCol>

                </CRow>
                </CCard>

                <CTable hover align="middle" className="border">
                <CTableHead color="light">
                    <CTableRow>
                    <CTableHeaderCell className="text-center">Matrícula</CTableHeaderCell>
                    <CTableHeaderCell>Grado</CTableHeaderCell>
                    <CTableHeaderCell>Sección</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Apellido</CTableHeaderCell>
                    <CTableHeaderCell>Representante Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Representante Apellido</CTableHeaderCell>
                    <CTableHeaderCell>Cédula</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Acciones</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>

                <CTableBody>
                    {filteredStudents.map((item) => (
                    <CTableRow key={item.id}>

                        <CTableDataCell className="text-center">{item.id}</CTableDataCell>
                        <CTableDataCell>{item.Grado}</CTableDataCell>
                        <CTableDataCell>{item.Seccion}</CTableDataCell>
                        <CTableDataCell>{item.NombreEstudiante}</CTableDataCell>
                        <CTableDataCell>{item.ApellidoEstudiante}</CTableDataCell>
                        <CTableDataCell>{item.RepresentanteNombre}</CTableDataCell>
                        <CTableDataCell>{item.RepresentanteApellido}</CTableDataCell>
                        <CTableDataCell>{item.RepresentanteCedula}</CTableDataCell>

                        <CTableDataCell className="text-center">
                        <CButtonGroup>
                            <CButton
                            size="sm"
                            color="primary"
                            onClick={() => openModal("view", item)}
                            >
                            Ver Ficha
                            <CIcon icon={cilBook} className="ms-2" />
                            </CButton>

                            <CButton
                            size="sm"
                            color="danger"
                            onClick={() => openModal("delete", item)}
                            >
                            Eliminar
                            <CIcon icon={cilTrash} className="ms-2" />
                            </CButton>
                        </CButtonGroup>
                        </CTableDataCell>

                    </CTableRow>
                    ))}
                </CTableBody>
                </CTable>

            </CCardBody>

            <CCardFooter className="text-muted">
                Mostrando {students.length} estudiantes
            </CCardFooter>
            </CCard>
        </CContainer>

        {/* TOASTER */}
        <CToaster placement="top-end">
            {toasts.map((t) => (
            <CToast key={t.id} autohide delay={2600} color={t.type} visible>
                <CToastHeader closeButton>
                <strong>{t.message}</strong>
                </CToastHeader>
                <CToastBody>Operación realizada correctamente.</CToastBody>
            </CToast>
            ))}
        </CToaster>

        {/* MODAL */}
        <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)}>
            <CModalHeader>
            <CModalTitle>
                {modalType === "view" && "Ficha del Estudiante"}
                {modalType === "delete" && "Eliminar Estudiante"}
            </CModalTitle>
            </CModalHeader>

            <CModalBody>

            {modalType === "view" && selectedItem && (
            <>
                <h5 className="mt-2">¿Está seguro que quiere ver los datos del estudiante?</h5>

                <p><strong>Nombre:</strong> {selectedItem.NombreEstudiante}</p>
                <p><strong>Apellido:</strong> {selectedItem.ApellidoEstudiante}</p>
                <p><strong>Grado:</strong> {selectedItem.Grado}</p>
                <p><strong>Sección:</strong> {selectedItem.Seccion}</p>

                <Link to={`/PerfilStudents/${selectedItem.id}`}>
                <CButton color="success" onClick={() => setModalVisible(false)}>
                    Aceptar
                </CButton>
                </Link>
            </>
            )}


            {modalType === "delete" && (
                <>
                <h5>¿Seguro que deseas eliminar este estudiante?</h5>
                <p className="fw-bold">{selectedItem?.NombreEstudiante}</p>

                <CButton color="danger" onClick={deleteItem}>
                    Eliminar
                </CButton>
                </>
            )}

            </CModalBody>
        </CModal>
        </>
    )
    }

    export default Students
