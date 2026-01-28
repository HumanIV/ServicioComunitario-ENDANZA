const KEY = 'mock_students_v1'

const initialStudents = [
    {
        id: 1,
        code: 'END-2024-001',
        name: 'Ana Sofía',
        lastName: 'Rodríguez',
        fullName: 'Ana Sofía Rodríguez',
        NombreEstudiante: 'Ana Sofía',
        ApellidoEstudiante: 'Rodríguez',
        gradeLevel: '4to Grado',
        Grado: '4to Grado',
        section: 'A',
        Seccion: 'A',
        status: 'Inscrito',
        Estatus: 'Activo',
        avatar: '',
        academicYear: '2024-2025',
        birthDate: '2014-02-15',
        FechaNacimiento: '15 de Febrero del 2014',
        age: '10 años',
        Edad: '10 Años',
        gender: 'Femenino',
        Sexo: 'Femenino',
        bloodType: 'O+',
        TipoSangre: 'O+',
        address: 'Av. Sucre, Urbanización El Paraíso, Caracas 1010',
        Direccion: 'Av. Sucre, Urbanización El Paraíso, Casa #45',
        Ciudad: 'Caracas',
        Estado: 'Distrito Capital',
        Telefono: '0414-1234567',
        Email: 'ana.rodriguez@gmail.com',
        representative: 'Carlos Rodríguez',
        RepresentanteNombre: 'Carlos',
        RepresentanteApellido: 'Rodríguez',
        RepresentanteCedula: 'V-12.345.678',
        PadreNombre: 'Carlos',
        PadreApellido: 'Rodríguez',
        PadreCedula: 'V-12.345.678',
        PadreParentesco: 'Padre',
        PadreOcupacion: 'Ingeniero Comercial',
        PadreTelefono: '0414-1234567',
        PadreEmail: 'carlos.rod@gmail.com',
        MadreNombre: 'María',
        MadreApellido: 'López',
        MadreCedula: 'V-13.987.654',
        MadreParentesco: 'Madre',
        MadreOcupacion: 'Docente Universitaria',
        MadreTelefono: '0424-9876543',
        MadreEmail: 'maria.lopez@yahoo.com',
        NutricionPeso: '32 kg',
        NutricionAltura: '1.40 m',
        NutricionIMC: '16.3 Normal',
        NutricionObs: 'La estudiante mantiene un peso acorde a su estatura y edad. Se recomienda mantener dieta balanceada.',
        Alergias: 'Ninguna',
        Medicamentos: 'Ninguno',
        Enfermedades: 'Ninguna',
        PromedioGeneral: '18.5',
        Conducta: 'Excelente',
        entryDate: '2023-09-10'
    },
    {
        id: 2,
        code: 'END-2024-045',
        name: 'Luis Eduardo',
        lastName: 'Rodríguez',
        fullName: 'Luis Eduardo Rodríguez',
        NombreEstudiante: 'Luis Eduardo',
        ApellidoEstudiante: 'Rodríguez',
        gradeLevel: '2do Grado',
        Grado: '2do Grado',
        section: 'A',
        Seccion: 'A',
        status: 'Inscrito',
        Estatus: 'Activo',
        avatar: '',
        academicYear: '2024-2025',
        birthDate: '2016-05-20',
        FechaNacimiento: '20 de Mayo del 2016',
        age: '8 años',
        Edad: '8 Años',
        gender: 'Masculino',
        Sexo: 'Masculino',
        bloodType: 'A+',
        TipoSangre: 'A+',
        address: 'Av. Sucre, Urbanización El Paraíso, Caracas 1010',
        Direccion: 'Av. Sucre, Urbanización El Paraíso, Casa #45',
        Ciudad: 'Caracas',
        Estado: 'Distrito Capital',
        Telefono: '0414-1234567',
        Email: 'carlos.rod@gmail.com',
        representative: 'Carlos Rodríguez',
        RepresentanteNombre: 'Carlos',
        RepresentanteApellido: 'Rodríguez',
        RepresentanteCedula: 'V-12.345.678',
        PadreNombre: 'Carlos',
        PadreApellido: 'Rodríguez',
        PadreCedula: 'V-12.345.678',
        PadreParentesco: 'Padre',
        PadreOcupacion: 'Ingeniero Comercial',
        PadreTelefono: '0414-1234567',
        PadreEmail: 'carlos.rod@gmail.com',
        MadreNombre: 'María',
        MadreApellido: 'López',
        MadreCedula: 'V-13.987.654',
        MadreParentesco: 'Madre',
        MadreOcupacion: 'Docente Universitaria',
        MadreTelefono: '0424-9876543',
        MadreEmail: 'maria.lopez@yahoo.com',
        NutricionPeso: '28 kg',
        NutricionAltura: '1.25 m',
        NutricionIMC: '17.9 Normal',
        NutricionObs: 'Crecimiento adecuado para su edad. Se observa buen apetito y hábitos alimenticios.',
        Alergias: 'Polen',
        Medicamentos: 'Antialérgicos (S.O.S)',
        Enfermedades: 'Rinitis Alérgica',
        PromedioGeneral: '17.0',
        Conducta: 'Buena',
        entryDate: '2024-01-15'
    }
]

function load() {
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) {
            save(initialStudents)
            return initialStudents
        }
        return JSON.parse(raw)
    } catch (e) {
        return initialStudents
    }
}

function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items))
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
