import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCol,
    CContainer,
    CRow,
    CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilClock, cilPeople } from '@coreui/icons'
import { getMyStudents } from 'src/services/studentsService' // 👈 CAMBIO AQUÍ

// Importar los nuevos componentes
import WelcomeBanner from './components/WelcomeBanner'
import StudentSelectionCard from './components/StudentSelectionCard'

const InicioHorarios = () => {
    const navigate = useNavigate();
    const [children, setChildren] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        fetchChildren()
    }, [])

    const fetchChildren = async () => {
        setLoading(true)
        try {
            // ✅ Usar getMyStudents
            const data = await getMyStudents()
            setChildren(data)
        } catch (error) {
            console.error("Error loading children:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewHorario = (studentId) => {
        navigate(`/horario-estudiante/${studentId}`); // 👈 MEJOR: pasar el ID
    }

    return (
        <CContainer fluid className="mt-4 pb-5">
            <CRow>
                <CCol>
                    <WelcomeBanner
                        title="Horarios Académicos"
                        subtitle="Consulte el cronograma de clases, aulas asignadas y docentes por día."
                        icon={cilClock}
                        bgIcon={cilClock}
                        colorClass="warning"
                    />

                    <h4 className="mb-4 fw-bold section-title text-uppercase ls-1 d-flex align-items-center">
                        <CIcon icon={cilPeople} className="me-2 text-warning" />
                        Seleccionar Estudiante
                    </h4>

                    <CRow className="g-4">
                        {loading ? (
                            <CCol className="text-center py-5"><CSpinner color="warning" /></CCol>
                        ) : children.length > 0 ? (
                            children.map((child) => (
                                <CCol key={child.id} lg={6}>
                                    <StudentSelectionCard
                                        child={child}
                                        colorClass="warning"
                                        buttonText="VER HORARIO"
                                        onClick={handleViewHorario}
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

export default InicioHorarios