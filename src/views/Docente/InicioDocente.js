import React, { useState, useEffect, useMemo } from 'react'
import { CContainer, CRow, CCol, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSchool } from '@coreui/icons'
import { listSections } from 'src/services/scheduleService'
import { getAvailableYears, getActiveYear } from 'src/services/configService'
import { listStudents } from 'src/services/studentsService'

// Components
import WelcomeHeader from './components/inicio/WelcomeHeader'
import ClassGroupsList from './components/inicio/ClassGroupsList'
import StudentListModal from './components/inicio/StudentListModal'

const InicioDocente = () => {
    const [loading, setLoading] = useState(true)
    const [sections, setSections] = useState([])
    const [academicYears, setAcademicYears] = useState([])
    const [selectedYear, setSelectedYear] = useState('') // Nombre del año
    const [selectedYearId, setSelectedYearId] = useState(null) // ID del año
    const [selectedTeacher, setSelectedTeacher] = useState('')
    const [fullTeachersList, setFullTeachersList] = useState([])
    const [selectedSection, setSelectedSection] = useState(null)
    const [students, setStudents] = useState([])
    const [showStudentModal, setShowStudentModal] = useState(false)
    const [loadingStudents, setLoadingStudents] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        // 1. Obtener usuario del localStorage
        const userStr = localStorage.getItem('user')
        if (userStr) {
            const user = JSON.parse(userStr)
            console.log("👤 INICIO: Usuario recuperado de localStorage:", user);
            const normalizedUser = { ...user, id: user.id || user.Id_usuario };
            setCurrentUser(normalizedUser)
            // Si es docente, seteamos su nombre completo
            const fullName = `${user.nombre} ${user.apellido}`.trim()
            setSelectedTeacher(fullName)
        }

        loadInitialData()
    }, [])

    useEffect(() => {
        if (selectedYear && selectedTeacher) {
            fetchDashboardData()
        }
    }, [selectedTeacher, selectedYear, selectedYearId, currentUser])

    const loadInitialData = async () => {
        try {
            // Cargar años disponibles (objetos completos)
            const years = await getAvailableYears()
            setAcademicYears(years)

            // 2. Obtener año activo REAL del backend
            const activeYearObj = await getActiveYear()

            if (activeYearObj && activeYearObj.name) {
                setSelectedYear(activeYearObj.name)
                setSelectedYearId(activeYearObj.id)
            } else if (years.length > 0) {
                // Fallback al primero de la lista si no hay activo
                setSelectedYear(years[0].name)
                setSelectedYearId(years[0].id)
            }
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
        console.log("🔍 DASHBOARD: Buscando datos para:", { teacher: selectedTeacher, year: selectedYear, yearId: selectedYearId })
        try {
            // Pasamos el ID del año al backend para que filtre allí directamente
            const allSections = await listSections({ academicYearId: selectedYearId })
            console.log("📦 DASHBOARD: Secciones del backend:", allSections.length)

            // Por si acaso, filtramos también en cliente por el nombre para asegurar coincidencia visual
            const normalizedSelectedYear = (selectedYear || '').trim()
            const yearFiltered = allSections.filter(s => {
                const sYear = (s.academicYear || '').trim()
                return sYear === normalizedSelectedYear
            })

            // Poblar lista de profesores
            const teachers = extractTeachers(yearFiltered)
            setFullTeachersList(teachers)

            // 3. Filtrar secciones donde el profesor sea el usuario logueado
            // Asegurar obtener el ID del usuario actual, incluso si el estado currentUser tiene latencia
            const userStr = localStorage.getItem('user');
            const localUser = userStr ? JSON.parse(userStr) : null;
            const currentUserId = currentUser?.id || currentUser?.Id_usuario || localUser?.id || localUser?.Id_usuario;
            const currentTeacherName = (selectedTeacher || '').trim().toLowerCase();

            console.log("👤 DASHBOARD: Perfil para filtrado:", {
                currentUserId,
                currentTeacherName,
                userInState: !!currentUser,
                userInLocal: !!localUser
            });

            const teacherGroups = yearFiltered.filter(section => {
                const hasMatch = section.schedules?.some(s => {
                    // Normalización de datos del horario
                    const schedUserId = s.teacherUserId ? Number(s.teacherUserId) : null;
                    const schedTeacherName = (s.teacherName || '').trim().toLowerCase();

                    // Prioridad 1: Match por ID de Usuario
                    if (currentUserId && schedUserId) {
                        const idMatch = Number(currentUserId) === schedUserId;
                        if (idMatch) {
                            console.log(`✅ MATCH ID [${section.sectionName}]: User ${currentUserId} coincide con horario.`);
                            return true;
                        }
                    }

                    // Prioridad 2: Match por Nombre (fallback)
                    if (currentTeacherName && schedTeacherName) {
                        const nameMatch = schedTeacherName === currentTeacherName || schedTeacherName.includes(currentTeacherName);
                        if (nameMatch) {
                            console.log(`✅ MATCH NAME [${section.sectionName}]: "${schedTeacherName}" coincide con "${currentTeacherName}".`);
                            return true;
                        }
                    }

                    return false;
                });

                if (!hasMatch) {
                    const firstSched = section.schedules?.[0];
                    console.log(`❌ NO MATCH [${section.sectionName}]: SchedTeacherID=${firstSched?.teacherUserId}, SchedName="${firstSched?.teacherName}"`);
                }

                return hasMatch;
            });

            console.log("🎯 DASHBOARD: Grupos finales asignados:", teacherGroups.length);
            setSections(teacherGroups);

        } catch (error) {
            console.error("Error fetching teacher dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeeStudents = async (section) => {
        setSelectedSection(section)
        setLoadingStudents(true)
        setShowStudentModal(true)
        try {
            const studentsList = await listStudents({ sectionId: section.id })
            // Transformar al formato que espera el modal
            const transformed = studentsList.map(s => {
                const firstName = s.first_name || s.nombre || ''
                const lastName = s.last_name || s.apellido || ''
                const birthDate = s.birth_date || s.fecha_nacimiento
                let age = ''
                if (birthDate) {
                    const birth = new Date(birthDate)
                    const today = new Date()
                    age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000))
                }
                return {
                    id: s.id || s.Id_estudiante,
                    name: firstName,
                    lastName: lastName,
                    fullName: `${firstName} ${lastName}`.trim(),
                    code: s.dni || s.cedula || 'N/A',
                    status: 'Inscrito',
                    age: age || 'N/A',
                    gender: s.gender || s.genero || 'N/A',
                    academicYear: selectedYear || ''
                }
            })
            setStudents(transformed)
        } catch (error) {
            console.error("Error loading students:", error)
        } finally {
            setLoadingStudents(false)
        }
    }

    const teacherStats = useMemo(() => {
        const normalizedTeacher = (selectedTeacher || '').trim().toLowerCase()
        const totalClasses = sections.reduce((acc, sec) =>
            acc + sec.schedules.filter(s => {
                const schedTeacher = (s.teacherName || '').trim().toLowerCase()
                return schedTeacher === normalizedTeacher || schedTeacher.includes(normalizedTeacher)
            }).length, 0
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
                        setSelectedYear={(name) => {
                            setSelectedYear(name)
                            const yearObj = academicYears.find(y => y.name === name)
                            if (yearObj) setSelectedYearId(yearObj.id)
                        }}
                        academicYears={academicYears.map(y => y.name)}
                        selectedTeacher={selectedTeacher}
                        setSelectedTeacher={setSelectedTeacher}
                        fullTeachersList={fullTeachersList}
                        teacherStats={teacherStats}
                        isTeacherView={true}
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
                            currentUserId={currentUser?.id || currentUser?.Id_usuario}
                        />
                    )}
                </CCol>
            </CRow>

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
