import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCol,
    CContainer,
    CRow,
    CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilPeople } from '@coreui/icons'
import { listStudents } from 'src/services/students'

// Importar los nuevos componentes
import WelcomeBanner from './components/WelcomeBanner'
import StudentSelectionCard from './components/StudentSelectionCard'

const InicioNotas = () => {
    const navigate = useNavigate();
    const [children, setChildren] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        fetchChildren()
    }, [])

    const fetchChildren = async () => {
        setLoading(true)
        try {
            const data = await listStudents()
            setChildren(data)
        } catch (error) {
            console.error("Error loading children:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewNotas = (studentId) => {
        navigate(`/notas-estudiante`);
    }

    return (
        <CContainer fluid className="mt-4 pb-5">
            <CRow>
                <CCol>
                    <WelcomeBanner
                        title="Mis Notas"
                        subtitle="Seleccione un estudiante para ver el detalle de sus calificaciones parciales y evaluaciones continuas."
                        icon={cilNotes}
                        bgIcon={cilNotes}
                        colorClass="warning"
                    />

                    <h4 className="mb-4 fw-bold section-title text-uppercase ls-1 d-flex align-items-center">
                        <CIcon icon={cilPeople} className="me-2 text-warning" />
                        Seleccionar Estudiante
                    </h4>

                    <CRow className="g-4">
                        {loading ? (
                            <CCol className="text-center py-5"><CSpinner color="warning" /></CCol>
                        ) : children.map((child) => (
                            <CCol key={child.id} lg={6}>
                                <StudentSelectionCard
                                    child={child}
                                    colorClass="warning"
                                    buttonText="VER CALIFICACIONES"
                                    onClick={handleViewNotas}
                                />
                            </CCol>
                        ))}
                    </CRow>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default InicioNotas
