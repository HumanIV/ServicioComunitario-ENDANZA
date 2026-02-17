const KEY = 'mock_sections_v2'
const YEARS_KEY = 'mock_years_v2'

const initialSections = [
    {
        id: 1,
        sectionName: "1er Grado A",
        gradeLevel: "1er Grado",
        section: "A",
        status: "Active",
        academicYear: "2025-2026",
        totalHoursPerWeek: 15,
        createdAt: new Date().toISOString(),
        schedules: [
            {
                id: 101,
                subject: "Danza Clásica",
                teacherName: "Fiorella Márquez",
                teacherId: 2,
                dayOfWeek: "MARTES",
                startTime: "14:00",
                endTime: "14:40",
                classroom: "Salón Rosado"
            },
            {
                id: 102,
                subject: "Danza Clásica",
                teacherName: "Fiorella Márquez",
                teacherId: 2,
                dayOfWeek: "JUEVES",
                startTime: "14:00",
                endTime: "14:40",
                classroom: "Salón Blanco"
            },
            {
                id: 103,
                subject: "Danza Creativa",
                teacherName: "Valeria Urbina",
                teacherId: 3,
                dayOfWeek: "MARTES",
                startTime: "16:10",
                endTime: "16:50",
                classroom: "Salón Blanco"
            },
            {
                id: 104,
                subject: "Danza Tradicional",
                teacherName: "Arianna Amaya",
                teacherId: 1,
                dayOfWeek: "JUEVES",
                startTime: "16:10",
                endTime: "16:50",
                classroom: "Patio"
            },
            {
                id: 105,
                subject: "Preparación Física",
                teacherName: "María Laura Castro",
                teacherId: 4,
                dayOfWeek: "VIERNES",
                startTime: "14:00",
                endTime: "14:40",
                classroom: "Placa 1"
            },
            {
                id: 106,
                subject: "Música",
                teacherName: "Moises Ramírez",
                teacherId: 5,
                dayOfWeek: "VIERNES",
                startTime: "15:20",
                endTime: "15:50",
                classroom: "Salón Verde"
            }
        ]
    },
    {
        id: 2,
        sectionName: "Preparatorio",
        gradeLevel: "Preparatorio",
        section: null,
        status: "Active",
        academicYear: "2025-2026",
        totalHoursPerWeek: 12,
        createdAt: new Date().toISOString(),
        schedules: [
            {
                id: 201,
                subject: "Danza Tradicional",
                teacherName: "Arianna Amaya",
                teacherId: 1,
                dayOfWeek: "MARTES",
                startTime: "14:00",
                endTime: "14:40",
                classroom: "Salón Colores 1"
            },
            {
                id: 202,
                subject: "Iniciación a la Danza",
                teacherName: "María Laura Castro",
                teacherId: 4,
                dayOfWeek: "MIÉRCOLES",
                startTime: "14:00",
                endTime: "14:40",
                classroom: "Salón Azul"
            },
            {
                id: 203,
                subject: "Preparación Física",
                teacherName: "Sofia Ojeda",
                teacherId: 6,
                dayOfWeek: "MARTES",
                startTime: "16:10",
                endTime: "16:50",
                classroom: "Salón Colores 1"
            },
            {
                id: 204,
                subject: "Música",
                teacherName: "María José Roa",
                teacherId: 7,
                dayOfWeek: "MIÉRCOLES",
                startTime: "16:10",
                endTime: "16:50",
                classroom: "Salón Violeta"
            }
        ]
    },
    {
        id: 3,
        sectionName: "2do Grado",
        gradeLevel: "2do Grado",
        section: null,
        status: "Active",
        academicYear: "2025-2026",
        totalHoursPerWeek: 15,
        createdAt: new Date().toISOString(),
        schedules: [
            {
                id: 301,
                subject: "Preparación Física",
                teacherName: "Valeria Urbina",
                teacherId: 3,
                dayOfWeek: "LUNES",
                startTime: "14:00",
                endTime: "14:40",
                classroom: "Salón Rosado"
            },
            {
                id: 302,
                subject: "Danza Clásica",
                teacherName: "Camily Cáceres",
                teacherId: 8,
                dayOfWeek: "MIÉRCOLES",
                startTime: "14:00",
                endTime: "14:40",
                classroom: "Salón Blanco"
            },
            {
                id: 303,
                subject: "Danza Clásica",
                teacherName: "Camily Cáceres",
                teacherId: 8,
                dayOfWeek: "VIERNES",
                startTime: "14:00",
                endTime: "14:40",
                classroom: "Salón Rosado"
            },
            {
                id: 304,
                subject: "Danza Tradicional",
                teacherName: "Arianna Amaya",
                teacherId: 1,
                dayOfWeek: "LUNES",
                startTime: "16:10",
                endTime: "16:50",
                classroom: "Salón Rosado"
            },
            {
                id: 305,
                subject: "Danza Contemporánea",
                teacherName: "Valeria Urbina",
                teacherId: 3,
                dayOfWeek: "MIÉRCOLES",
                startTime: "16:10",
                endTime: "16:50",
                classroom: "Salón Colores 1"
            },
            {
                id: 306,
                subject: "Francés",
                teacherName: "Paola Rico",
                teacherId: 9,
                dayOfWeek: "VIERNES",
                startTime: "15:20",
                endTime: "15:50",
                classroom: "Salón Amarillo"
            },
            {
                id: 307,
                subject: "Música",
                teacherName: "María José Roa",
                teacherId: 7,
                dayOfWeek: "VIERNES",
                startTime: "16:50",
                endTime: "17:30",
                classroom: "Salón Violeta"
            }
        ]
    }
]

function load() {
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) {
            save(initialSections)
            return initialSections
        }
        const parsed = JSON.parse(raw)
        return parsed && parsed.length > 0 ? parsed : initialSections
    } catch (e) {
        console.error('Error loading sections:', e)
        return initialSections
    }
}

function save(items) {
    try {
        localStorage.setItem(KEY, JSON.stringify(items))
    } catch (e) {
        console.warn('Error saving sections:', e)
    }
}

function nextId(items) {
    const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0)
    return maxId + 1
}

export async function listSections(filters = {}) {
    const data = load()

    let filtered = data

    if (filters.gradeLevel) {
        filtered = filtered.filter(s => s.gradeLevel === filters.gradeLevel)
    }

    if (filters.status) {
        filtered = filtered.filter(s => s.status === filters.status)
    }

    if (filters.academicYear) {
        filtered = filtered.filter(s => s.academicYear === filters.academicYear)
    }

    filtered.sort((a, b) => b.id - a.id)

    return Promise.resolve(filtered)
}

export async function getSection(id) {
    const items = load()
    return Promise.resolve(items.find(s => s.id === id) || null)
}

export async function createSection(payload) {
    const items = load()
    const id = nextId(items)

    const section = {
        id,
        sectionName: payload.sectionName || '',
        gradeLevel: payload.gradeLevel || '',
        section: payload.section || null,
        status: payload.status || 'Active',
        academicYear: payload.academicYear || '2025-2026',
        totalHoursPerWeek: payload.totalHoursPerWeek || 0,
        schedules: payload.schedules || [],
        createdAt: new Date().toISOString()
    }

    items.unshift(section)
    save(items)
    return Promise.resolve(section)
}

export async function updateSection(id, payload) {
    const items = load()
    const idx = items.findIndex(s => s.id === id)
    if (idx === -1) return Promise.reject(new Error('Section not found'))

    items[idx] = {
        ...items[idx],
        ...payload
    }
    save(items)
    return Promise.resolve(items[idx])
}

export async function deleteSection(id) {
    const items = load()
    const filtered = items.filter(s => s.id !== id)
    save(filtered)
    return Promise.resolve({ success: true })
}

export async function addScheduleToSection(sectionId, scheduleData) {
    const items = load()
    const idx = items.findIndex(s => s.id === sectionId)
    if (idx === -1) return Promise.reject(new Error('Section not found'))

    const scheduleId = Math.max(...items[idx].schedules.map(s => s.id), 0) + 1
    const newSchedule = {
        id: scheduleId,
        ...scheduleData
    }

    items[idx].schedules.push(newSchedule)

    items[idx].totalHoursPerWeek = calculateTotalHours(items[idx].schedules)

    save(items)
    return Promise.resolve(newSchedule)
}

export async function removeScheduleFromSection(sectionId, scheduleId) {
    const items = load()
    const idx = items.findIndex(s => s.id === sectionId)
    if (idx === -1) return Promise.reject(new Error('Section not found'))

    items[idx].schedules = items[idx].schedules.filter(s => s.id !== scheduleId)

    items[idx].totalHoursPerWeek = calculateTotalHours(items[idx].schedules)

    save(items)
    return Promise.resolve({ success: true })
}

function calculateTotalHours(schedules) {
    if (!schedules || schedules.length === 0) return 0

    let totalMinutes = 0
    schedules.forEach(schedule => {
        const start = new Date(`2000-01-01T${schedule.startTime}:00`)
        const end = new Date(`2000-01-01T${schedule.endTime}:00`)
        totalMinutes += (end - start) / (1000 * 60)
    })

    return Math.round(totalMinutes / 60)
}

// ================= VALIDACIÓN DE AULAS =================
function timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

export async function checkClassroomAvailability(academicYear, day, start, end, classroom, excludeSectionId = null) {
    const sections = load();
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);

    for (const section of sections) {
        if (section.academicYear !== academicYear) continue;
        if (excludeSectionId && section.id === excludeSectionId) continue; // Si estamos editando una sección existente

        if (section.schedules) {
            for (const sch of section.schedules) {
                if (sch.dayOfWeek === day && sch.classroom === classroom) {
                    const sMin = timeToMinutes(sch.startTime);
                    const eMin = timeToMinutes(sch.endTime);

                    // Verificación de solapamiento
                    // Max(start1, start2) < Min(end1, end2) indica solapamiento
                    if (Math.max(startMin, sMin) < Math.min(endMin, eMin)) {
                        return {
                            available: false,
                            conflict: {
                                sectionName: section.sectionName,
                                subject: sch.subject,
                                startTime: sch.startTime,
                                endTime: sch.endTime
                            }
                        };
                    }
                }
            }
        }
    }
    return { available: true };
}

export const DAYS_OF_WEEK = [
    { value: 'LUNES', label: 'Lunes' },
    { value: 'MARTES', label: 'Martes' },
    { value: 'MIÉRCOLES', label: 'Miércoles' },
    { value: 'JUEVES', label: 'Jueves' },
    { value: 'VIERNES', label: 'Viernes' }
]

export const GRADE_LEVELS = [
    { value: 'Preparatorio', label: 'Preparatorio' },
    { value: '1er Grado', label: '1er Grado' },
    { value: '2do Grado', label: '2do Grado' },
    { value: '3er Grado', label: '3er Grado' },
    { value: '4to Grado', label: '4to Grado' },
    { value: '5to Grado', label: '5to Grado' },
    { value: '6to Grado', label: '6to Grado' },
    { value: '7mo Grado', label: '7mo Grado' },
    { value: '8vo Grado', label: '8vo Grado' }
]

export const SUBJECTS = [
    { value: 'Danza Clásica', label: 'Danza Clásica' },
    { value: 'Danza Contemporánea', label: 'Danza Contemporánea' },
    { value: 'Danza Tradicional', label: 'Danza Tradicional' },
    { value: 'Danza Creativa', label: 'Danza Creativa' },
    { value: 'Preparación Física', label: 'Preparación Física' },
    { value: 'Música', label: 'Música' },
    { value: 'Historia de la Danza', label: 'Historia de la Danza' },
    { value: 'Nutrición', label: 'Nutrición' },
    { value: 'Kinesiología', label: 'Kinesiología' },
    { value: 'Francés', label: 'Francés' },
    { value: 'Composición Coreográfica', label: 'Composición Coreográfica' },
    { value: 'Danza de Carácter', label: 'Danza de Carácter' }
]

export const CLASSROOMS = [
    { value: 'Salón Rosado', label: 'Salón Rosado' },
    { value: 'Salón Azul', label: 'Salón Azul' },
    { value: 'Salón Violeta', label: 'Salón Violeta' },
    { value: 'Salón Amarillo', label: 'Salón Amarillo' },
    { value: 'Salón Blanco', label: 'Salón Blanco' },
    { value: 'Salón Gris', label: 'Salón Gris' },
    { value: 'Salón de Colores 1', label: 'Salón de Colores 1' },
    { value: 'Salón de Colores 2', label: 'Salón de Colores 2' },
    { value: 'Salón Verde', label: 'Salón Verde' },
    { value: 'Patio', label: 'Patio' },
    { value: 'Tarima', label: 'Tarima' },
    { value: 'Placa I', label: 'Placa I' },
    { value: 'Placa II', label: 'Placa II' },
    { value: 'Placa III', label: 'Placa III' },
    { value: 'Salón Nutrición', label: 'Salón Nutrición' }
]



export async function getAvailableYears() {
    const sections = load()
    const sectionYears = sections.map(s => s.academicYear).filter(Boolean)

    let storedYears = []
    try {
        const raw = localStorage.getItem(YEARS_KEY)
        storedYears = raw ? JSON.parse(raw) : []
    } catch (e) {
        console.warn('Error loading years:', e)
    }

    const uniqueYears = [...new Set([...sectionYears, ...storedYears, "2025-2026"])]
    uniqueYears.sort().reverse()

    return Promise.resolve(uniqueYears)
}

export async function addAcademicYear(year) {
    if (!year) return Promise.reject(new Error('Year is required'))

    try {
        const raw = localStorage.getItem(YEARS_KEY)
        let storedYears = raw ? JSON.parse(raw) : []

        if (!storedYears.includes(year)) {
            storedYears.push(year)
            localStorage.setItem(YEARS_KEY, JSON.stringify(storedYears))
        }
        return Promise.resolve(year)
    } catch (e) {
        console.warn('Error saving year:', e)
        return Promise.reject(e)
    }
}