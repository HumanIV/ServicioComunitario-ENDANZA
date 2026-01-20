    import { CCard, CCardBody, CCardHeader, CButton } from "@coreui/react"
    import CIcon from "@coreui/icons-react"
    import { useState } from "react"
    import InscripcionForm from "./Inscripcion"
    import { cilEducation, cilCheckCircle, cilLockLocked } from "@coreui/icons"

    const Inscripcion = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const inscripcionesAbiertas = true // Cambiar según necesidad

    if (mostrarFormulario) {
        return <InscripcionForm onCancelar={() => setMostrarFormulario(false)} />
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-50">
        <CCard className="text-center" style={{ maxWidth: '500px', width: '100%' }}>
            <CCardHeader className="bg-primary text-white">
            <h4 className="mb-0">
                <CIcon icon={cilEducation} className="me-2" />
                INSCRIPCIÓN DE ALUMNOS
            </h4>
            </CCardHeader>
            
            <CCardBody className="py-5">
            <CIcon 
                icon={inscripcionesAbiertas ? cilCheckCircle : cilLockLocked} 
                size="3xl" 
                className={inscripcionesAbiertas ? 'text-success mb-3' : 'text-warning mb-3'} 
            />
            
            <h3 className="mb-3">
                {inscripcionesAbiertas ? 'Inscripciones Abiertas' : 'Inscripciones Cerradas'}
            </h3>
            
            <p className="text-muted mb-4">
                {inscripcionesAbiertas 
                ? 'Complete el formulario para registrar un nuevo alumno'
                : 'Vuelva más tarde para el próximo período'}
            </p>
            
            <CButton 
                color={inscripcionesAbiertas ? "success" : "secondary"}
                size="lg"
                onClick={() => inscripcionesAbiertas && setMostrarFormulario(true)}
                disabled={!inscripcionesAbiertas}
                className="px-5"
            >
                {inscripcionesAbiertas ? 'COMENZAR INSCRIPCIÓN' : 'NO DISPONIBLE'}
            </CButton>
            </CCardBody>
        </CCard>
        </div>
    )
    }

    export default Inscripcion