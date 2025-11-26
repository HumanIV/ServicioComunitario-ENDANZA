    // src/views/Students/PerfilStudents.jsx

    import React, { useEffect, useState } from "react"
    import {
    CCard,
    CCardBody,
    CCardHeader,
    CContainer,
    CRow,
    CCol,
    CButton,
    } from "@coreui/react"
    import { useParams, Link } from "react-router-dom"
    import CIcon from "@coreui/icons-react"
    import { cilArrowLeft } from "@coreui/icons"

    const PerfilStudents = () => {
    const { id } = useParams()

    // En tu caso luego vendrá de un API
    const dummyData = [
        {
        id: 1,
        Grado: "1er Grado",
        Seccion: "D1",
        NombreEstudiante: "María",
        ApellidoEstudiante: "González",
        FechaNacimiento: "2014-02-15",
        Sexo: "Femenino",
        Direccion: "Av. Sucre - Caracas",
        RepresentanteNombre: "Ana",
        RepresentanteApellido: "González",
        RepresentanteCedula: "V-12345678",
        RepresentanteTelefono: "0424-1234567",
        NutricionPeso: "32 kg",
        NutricionAltura: "1.35 m",
        NutricionObs: "Buen estado nutricional",
        ObservacionesAcad: "Excelente rendimiento"
        }
    ]

    const [student, setStudent] = useState(null)

    useEffect(() => {
        const found = dummyData.find((s) => s.id === Number(id))
        setStudent(found)
    }, [id])

    if (!student) {
        return (
        <CContainer className="mt-4">
            <h3>No se encontró el estudiante</h3>
        </CContainer>
        )
    }

    return (
        <CContainer className="mt-4">

        {/* BOTÓN REGRESAR */}
        <Link to="/students">
            <CButton color="secondary" className="mb-3">
            <CIcon icon={cilArrowLeft} className="me-2" />
            Volver
            </CButton>
        </Link>

        <h1 className="mb-4">
            Perfil del Estudiante – {student.NombreEstudiante} {student.ApellidoEstudiante}
        </h1>

        {/* ============ DATOS PERSONALES ============ */}
        <CCard className="mb-4">
            <CCardHeader className="fw-bold">Datos Personales</CCardHeader>
            <CCardBody>
            <CRow>
                <CCol md={4}><strong>Nombre:</strong><br />{student.NombreEstudiante}</CCol>
                <CCol md={4}><strong>Apellido:</strong><br />{student.ApellidoEstudiante}</CCol>
                <CCol md={4}><strong>Fecha de Nacimiento:</strong><br />{student.FechaNacimiento}</CCol>
            </CRow>

            <CRow className="mt-3">
                <CCol md={4}><strong>Sexo:</strong><br />{student.Sexo}</CCol>
                <CCol md={4}><strong>Grado:</strong><br />{student.Grado}</CCol>
                <CCol md={4}><strong>Sección:</strong><br />{student.Seccion}</CCol>
            </CRow>

            <CRow className="mt-3">
                <CCol md={12}>
                <strong>Dirección:</strong><br />
                {student.Direccion}
                </CCol>
            </CRow>
            </CCardBody>
        </CCard>

        {/* ============ DATOS DEL REPRESENTANTE ============ */}
        <CCard className="mb-4">
            <CCardHeader className="fw-bold">Representante</CCardHeader>
            <CCardBody>
            <CRow>
                <CCol md={4}><strong>Nombre:</strong><br />{student.RepresentanteNombre}</CCol>
                <CCol md={4}><strong>Apellido:</strong><br />{student.RepresentanteApellido}</CCol>
                <CCol md={4}><strong>Cédula:</strong><br />{student.RepresentanteCedula}</CCol>
            </CRow>

            <CRow className="mt-3">
                <CCol md={4}>
                <strong>Teléfono:</strong><br />
                {student.RepresentanteTelefono}
                </CCol>
            </CRow>
            </CCardBody>
        </CCard>

        {/* ============ SECCIÓN NUTRICIÓN ============ */}
        <CCard className="mb-4">
            <CCardHeader className="fw-bold">Datos Nutricionales</CCardHeader>
            <CCardBody>
            <CRow>
                <CCol md={4}><strong>Peso:</strong><br />{student.NutricionPeso}</CCol>
                <CCol md={4}><strong>Altura:</strong><br />{student.NutricionAltura}</CCol>
                <CCol md={4}><strong>Observaciones:</strong><br />{student.NutricionObs}</CCol>
            </CRow>
            </CCardBody>
        </CCard>

        {/* ============ SECCIÓN ACADÉMICA ============ */}
        <CCard className="mb-4">
            <CCardHeader className="fw-bold">Datos Académicos</CCardHeader>
            <CCardBody>
            <strong>Observaciones:</strong>
            <p>{student.ObservacionesAcad}</p>

            <CButton color="primary">
                Ver / Cargar Notas
            </CButton>
            </CCardBody>
        </CCard>

        </CContainer>
    )
    }

    export default PerfilStudents
