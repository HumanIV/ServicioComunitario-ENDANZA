// data/datosEjemplo.js
export const horarioUsuario = {
  estudiante: {
    id: 1,
    nombre: "Ana López Rodríguez",
    codigo: "END-2024-001",
    grado: "4to Grado",
    seccion: "A",
    representante: "María Rodríguez Pérez",
    anoAcademico: "2024-2025"
  },
  horarioCompleto: {
    LUNES: [
      { hora: "08:00 - 08:45", materia: "Ballet Clásico I", profesor: "Prof. García", aula: "Salón Rosado" },
      { hora: "09:00 - 09:45", materia: "Ritmo y Movimiento", profesor: "Prof. Martínez", aula: "Salón Azul" },
      { hora: "10:00 - 10:45", materia: "Expresión Corporal", profesor: "Prof. López", aula: "Patio" },
      { hora: "14:00 - 14:45", materia: "Historia de la Danza", profesor: "Prof. Rodríguez", aula: "Aula 2" }
    ],
    MARTES: [
      { hora: "08:00 - 09:30", materia: "Ballet Clásico I", profesor: "Prof. García", aula: "Salón Rosado" },
      { hora: "10:00 - 10:45", materia: "Preparación Física", profesor: "Prof. Sánchez", aula: "Gimnasio" },
      { hora: "14:00 - 15:30", materia: "Danza Contemporánea", profesor: "Prof. Fernández", aula: "Salón Violeta" }
    ],
    MIERCOLES: [
      { hora: "09:00 - 10:30", materia: "Música", profesor: "Prof. González", aula: "Aula de Música" },
      { hora: "11:00 - 11:45", materia: "Ritmo y Movimiento", profesor: "Prof. Martínez", aula: "Salón Azul" },
      { hora: "14:00 - 15:30", materia: "Ballet Clásico I", profesor: "Prof. García", aula: "Salón Rosado" }
    ],
    JUEVES: [
      { hora: "08:00 - 09:30", materia: "Composición Coreográfica", profesor: "Prof. Ramírez", aula: "Salón Blanco" },
      { hora: "10:00 - 10:45", materia: "Nutrición", profesor: "Prof. Torres", aula: "Salón Nutrición" },
      { hora: "14:00 - 15:30", materia: "Danza de Carácter", profesor: "Prof. Vargas", aula: "Tarima" }
    ],
    VIERNES: [
      { hora: "08:00 - 09:30", materia: "Ballet Clásico I", profesor: "Prof. García", aula: "Salón Rosado" },
      { hora: "10:00 - 11:30", materia: "Ensayo General", profesor: "Prof. Director", aula: "Auditorio" },
      { hora: "14:00 - 14:45", materia: "Francés", profesor: "Prof. Dubois", aula: "Aula 3" }
    ]
  },
  estadisticas: {
    totalClasesSemana: 16,
    totalHorasSemana: 24,
    profesoresUnicos: 8,
    aulasUtilizadas: 6,
    materiaPrincipal: "Ballet Clásico I"
  },
  profesores: [
    { nombre: "Prof. García", materia: "Ballet Clásico I", contacto: "garcia@endanza.edu" },
    { nombre: "Prof. Martínez", materia: "Ritmo y Movimiento", contacto: "martinez@endanza.edu" },
    { nombre: "Prof. López", materia: "Expresión Corporal", contacto: "lopez@endanza.edu" },
    { nombre: "Prof. Fernández", materia: "Danza Contemporánea", contacto: "fernandez@endanza.edu" }
  ]
}

export const diasSemana = [
  { id: 'LUNES', nombre: 'Lunes', color: 'primary' },
  { id: 'MARTES', nombre: 'Martes', color: 'success' },
  { id: 'MIERCOLES', nombre: 'Miércoles', color: 'warning' },
  { id: 'JUEVES', nombre: 'Jueves', color: 'danger' },
  { id: 'VIERNES', nombre: 'Viernes', color: 'info' }
]