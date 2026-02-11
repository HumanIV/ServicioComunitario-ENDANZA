const KEY = 'mock_students_v1'

const initialStudents = [
    {
        id: 1,
        code: 'END-2024-001',
        name: 'Ana Sofía',
        lastName: 'Rodríguez',
        fullName: 'Ana Sofía Rodríguez',
        gradeLevel: '4to Grado',
        section: 'A',
        status: 'Inscrito',
        academicYear: '2024-2025',
        birthDate: '2014-02-15',
        gender: 'Femenino',
        representative: 'María Rodríguez',
        RepresentanteNombre: 'María',
        RepresentanteApellido: 'Rodríguez',
        RepresentanteCedula: 'V-44555666',
        RepresentanteId: 4,
        entryDate: '2023-09-10'
    },
    {
        id: 2,
        code: 'END-2024-002',
        name: 'Luis Eduardo',
        lastName: 'Rodríguez',
        fullName: 'Luis Eduardo Rodríguez',
        gradeLevel: '2do Grado',
        section: 'A',
        status: 'Inscrito',
        academicYear: '2024-2025',
        birthDate: '2016-05-20',
        gender: 'Masculino',
        representative: 'María Rodríguez',
        RepresentanteNombre: 'María',
        RepresentanteApellido: 'Rodríguez',
        RepresentanteCedula: 'V-44555666',
        RepresentanteId: 4,
        entryDate: '2024-01-15'
    },
    {
        id: 3,
        code: 'END-2024-089',
        name: 'Lucía Isabela',
        lastName: 'Méndez',
        fullName: 'Lucía Isabela Méndez',
        NombreEstudiante: 'Lucía Isabela',
        ApellidoEstudiante: 'Méndez',
        gradeLevel: '1er Grado',
        Grado: '1er Grado',
        section: 'A',
        Seccion: 'A',
        status: 'Inscrito',
        Estatus: 'Activo',
        avatar: '',
        academicYear: '2025-2026',
        birthDate: '2017-09-12',
        FechaNacimiento: '12 de Septiembre del 2017',
        age: '7 años',
        Edad: '7 Años',
        gender: 'Femenino',
        Sexo: 'Femenino',
        bloodType: 'O+',
        TipoSangre: 'O+',
        address: 'Calle Real, Chacao, Caracas',
        Direccion: 'Calle Real, Casa #12',
        Ciudad: 'Caracas',
        Estado: 'Distrito Capital',
        Telefono: '0412-5556677',
        Email: 'isabela.mendez@gmail.com',
        representative: 'Mariana Méndez',
        RepresentanteNombre: 'Mariana',
        RepresentanteApellido: 'Méndez',
        RepresentanteCedula: 'V-15.678.901',
        NutricionPeso: '24 kg',
        NutricionAltura: '1.20 m',
        NutricionIMC: '16.7 Normal',
        NutricionObs: 'Saludable.',
        Alergias: 'Ninguna',
        Medicamentos: 'Ninguno',
        Enfermedades: 'Ninguna',
        PromedioGeneral: '19.0',
        Conducta: 'Excelente',
        entryDate: '2024-09-10'
    },
    {
        id: 4,
        code: 'END-2024-090',
        name: 'Mateo Sebastián',
        lastName: 'Rivas',
        fullName: 'Mateo Sebastián Rivas',
        NombreEstudiante: 'Mateo Sebastián',
        ApellidoEstudiante: 'Rivas',
        gradeLevel: '1er Grado',
        Grado: '1er Grado',
        section: 'A',
        Seccion: 'A',
        status: 'Inscrito',
        Estatus: 'Activo',
        avatar: '',
        academicYear: '2025-2026',
        birthDate: '2017-11-05',
        age: '7 años',
        gender: 'Masculino',
        representative: 'Pedro Rivas',
        NutricionPeso: '26 kg',
        NutricionAltura: '1.22 m',
        NutricionIMC: '17.5 Normal',
        Alergias: 'Ninguna',
        Medicamentos: 'Ninguno',
        Enfermedades: 'Ninguna',
        PromedioGeneral: '18.0',
        Conducta: 'Buena',
        entryDate: '2024-09-12'
    }
]

function load() {
    try {
        const raw = localStorage.getItem(KEY)
        let students = raw ? JSON.parse(raw) : initialStudents

        // Inyectar Estudiantes de Prueba si no existen (1er Grado A)
        const mockCodes = ['END-2024-089', 'END-2024-090']
        mockCodes.forEach(code => {
            if (!students.some(s => s.code === code)) {
                const mockStudent = initialStudents.find(s => s.code === code)
                if (mockStudent) {
                    students.push(mockStudent)
                    save(students)
                }
            }
        })

        return students
    } catch (e) {
        return initialStudents
    }
}

function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items))
}

function nextId(items) {
    const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0)
    return maxId + 1
}

export async function createStudent(payload) {
    let data = load()
    const id = nextId(data)
    const newStudent = {
        id,
        ...payload,
        createdAt: new Date().toISOString()
    }
    data.push(newStudent)
    save(data)
    return Promise.resolve(newStudent)
}

export async function listStudents(filters = {}) {
    let data = load()
    if (filters.gradeLevel) {
        data = data.filter(s => s.gradeLevel === filters.gradeLevel)
    }
    if (filters.status) {
        data = data.filter(s => s.status === filters.status)
    }
    return Promise.resolve(data)
}

export async function getStudent(id) {
    const data = load()
    return Promise.resolve(data.find(s => s.id === Number(id)) || null)
}

export async function updateStudent(id, payload) {
    let data = load()
    const idx = data.findIndex(s => s.id === Number(id))
    if (idx === -1) return Promise.reject('Student not found')
    data[idx] = { ...data[idx], ...payload }
    save(data)
    return Promise.resolve(data[idx])
}
