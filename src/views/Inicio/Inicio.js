import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import {
    CCol,
    CContainer,
    CRow,
    CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilSchool, cilPeople } from '@coreui/icons'
import { getMyStudents } from 'src/services/studentsService'

// Importar los nuevos componentes
import WelcomeBanner from './components/WelcomeBanner'
import StudentSelectionCard from './components/StudentSelectionCard'

const InicioParent = () => {
    const navigate = useNavigate();
    const [children, setChildren] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        fetchChildren()
    }, [])

    const fetchChildren = async () => {
        setLoading(true)
        try {
            const data = await getMyStudents()
            console.log("📥 Estudiantes del representante:", data)
            setChildren(data)
        } catch (error) {
            console.error("Error loading children:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewProfile = (studentId) => {
        console.log("🔍 Navegando a:", `/perfilRepresentanteEstudiante/${studentId}`)
        // 👇 PASAR LA LISTA COMPLETA DE ESTUDIANTES
        navigate(`/perfilRepresentanteEstudiante/${studentId}`, {
            state: { studentsList: children }
        })
    }

    return (
        <CContainer fluid className="mt-4 pb-5">
            <CRow>
                <CCol>
                    <WelcomeBanner
                        title="¡Bienvenido!"
                        subtitle="Gestione la actividad académica de sus hijos desde este panel central."
                        icon={cilPeople}
                        bgIcon={cilSchool}
                        colorClass="warning"
                    />

                    <h4 className="mb-4 fw-bold section-title text-uppercase ls-1 d-flex align-items-center">
                        <CIcon icon={cilSchool} className="me-2 text-warning" />
                        Estudiantes a su cargo
                    </h4>

                    <CRow className="g-4">
                        {loading ? (
                            <CCol className="text-center py-5">
                                <CSpinner color="warning" />
                                <p className="mt-3">Cargando estudiantes...</p>
                            </CCol>
                        ) : children.length > 0 ? (
                            children.map((child) => (
                                <CCol key={child.id} lg={6}>
                                    <StudentSelectionCard
                                        child={child}
                                        colorClass="warning"
                                        buttonText="VER PERFIL ACADÉMICO"
                                        onClick={handleViewProfile}
                                    />
                                </CCol>
                            ))
                        ) : (
                            <CCol className="text-center py-5">
                                <p className="text-muted">No tiene estudiantes registrados</p>
                            </CCol>
                        )}
                    </CRow>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default InicioParent