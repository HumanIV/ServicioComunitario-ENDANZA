import React, { useState, useEffect, useMemo } from 'react'
import { CContainer, CRow, CCol, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSchool } from '@coreui/icons'
import { listSections, getAvailableYears } from 'src/services/schedules'
import { listStudents } from 'src/services/studentsService'

// Components
import WelcomeHeader from './components/inicio/WelcomeHeader'
import ClassGroupsList from './components/inicio/ClassGroupsList'
import StudentListModal from './components/inicio/StudentListModal'

const InicioDocente = () => {
    const [loading, setLoading] = useState(true)
    const [sections, setSections] = useState([])
    const [academicYears, setAcademicYears] = useState([])
    const [selectedYear, setSelectedYear] = useState('2025-2026')
    const [selectedTeacher, setSelectedTeacher] = useState('Fiorella Márquez')
    const [fullTeachersList, setFullTeachersList] = useState([])
    const [selectedSection, setSelectedSection] = useState(null)
    const [students, setStudents] = useState([])
    const [showStudentModal, setShowStudentModal] = useState(false)
    const [loadingStudents, setLoadingStudents] = useState(false)

    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        fetchDashboardData()
    }, [selectedTeacher, selectedYear])

    const loadInitialData = async () => {
        try {
            const years = await getAvailableYears()
            setAcademicYears(years)
            if (years.length > 0) setSelectedYear(years[0])
        } catch (error) {
            console.error("Error loading years:", error)
        }
    }

    const extractTeachers = (sectionsData) => {
        const teachers = new Set()
        sectionsData.forEach(section => {
            section.schedules.forEach(sched => {
                if (sched.teacherName) teachers.add(sched.teacherName)
            })
        })
        return Array.from(teachers).sort()
    }

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const allSections = await listSections()

            // Poblar lista de profesores
            const teachers = extractTeachers(allSections)
            setFullTeachersList(teachers)

            // Filtrar secciones por año y docente
            const teacherGroups = allSections.filter(section =>
                section.academicYear === selectedYear &&
                section.schedules.some(s => s.teacherName === selectedTeacher)
            )
            setSections(teacherGroups)
        } catch (error) {
            console.error("Error fetching teacher dashboard:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSeeStudents = async (section) => {
        setSelectedSection(section)
        setLoadingStudents(true)
        setShowStudentModal(true)
        try {
            // Lógica de "Inscripción Automática": 
            // Buscamos a todos los estudiantes que pertenezcan al Grado de esta sección
            const studentsList = await listStudents({ gradeLevel: section.gradeLevel, status: 'Inscrito' })
            setStudents(studentsList)
        } catch (error) {
            console.error("Error loading students:", error)
        } finally {
            setLoadingStudents(false)
        }
    }

    const teacherStats = useMemo(() => {
        const totalClasses = sections.reduce((acc, sec) =>
            acc + sec.schedules.filter(s => s.teacherName === selectedTeacher).length, 0
        )
        return {
            groups: sections.length,
            classes: totalClasses
        }
    }, [sections, selectedTeacher])

    return (
        <CContainer fluid className="pb-5">
            <CRow>
                <CCol>
                    {/* BIENVENIDA DOCENTE */}
                    <WelcomeHeader
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        academicYears={academicYears}
                        selectedTeacher={selectedTeacher}
                        setSelectedTeacher={setSelectedTeacher}
                        fullTeachersList={fullTeachersList}
                        teacherStats={teacherStats}
                    />

                    <h4 className="mb-4 fw-bold header-title-custom text-uppercase ls-1 d-flex align-items-center">
                        <CIcon icon={cilSchool} className="me-2 text-primary" />
                        Mis Grupos de Clase
                    </h4>

                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner color="primary" variant="grow" />
                        </div>
                    ) : (
                        <ClassGroupsList
                            sections={sections}
                            selectedTeacher={selectedTeacher}
                            onSeeStudents={handleSeeStudents}
                        />
                    )}
                </CCol>
            </CRow>

            {/* MODAL DE LISTA DE ESTUDIANTES */}
            <StudentListModal
                show={showStudentModal}
                onClose={() => setShowStudentModal(false)}
                selectedSection={selectedSection}
                students={students}
                loadingStudents={loadingStudents}
            />


        </CContainer>
    )
}

export default InicioDocente
