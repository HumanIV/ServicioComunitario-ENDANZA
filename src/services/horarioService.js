import { helpFetch } from '../api/helpFetch';

const fetch = helpFetch();

/**
 * Obtiene el horario completo de un estudiante por su GRADO
 * El backend busca la sección del estudiante, obtiene su nivel_academico,
 * y devuelve todos los horarios de las secciones con ese mismo grado.
 * 
 * @param {number} estudianteId - ID del estudiante
 * @returns {Promise<Object>} Datos del horario formateados para el frontend
 */
export const getHorarioEstudiante = async (estudianteId) => {
    try {
        console.log(`📥 Solicitando horario por GRADO para estudiante ID: ${estudianteId}`);

        // PASO 1: Llamar al nuevo endpoint que obtiene horarios por grado
        const response = await fetch.get(`/api/students/${estudianteId}/horario-grado`);

        console.log('📦 Respuesta de horario-grado:', response);

        if (!response.ok) {
            console.log('⚠️ Error en la respuesta de horario-grado');
            // Fallback: obtener datos básicos del estudiante
            return {
                estudiante: await getDatosBasicosEstudiante(estudianteId),
                estadisticas: { totalClasesSemana: 0, totalHorasSemana: 0 },
                horarioCompleto: {
                    LUNES: [], MARTES: [], MIERCOLES: [], JUEVES: [], VIERNES: []
                },
                profesores: []
            };
        }

        const data = response.data;
        const grado = data.grado;
        const seccion = data.seccion;
        const horarios = data.horarios || [];
        const academicYearName = data.academic_year_name;

        console.log(`✅ Grado del estudiante: "${grado}"`);
        console.log(`📋 Horarios encontrados para el grado: ${horarios.length}`);

        // PASO 2: Obtener datos del estudiante
        const estudianteData = await getDatosBasicosEstudiante(estudianteId);
        console.log('📦 Datos del estudiante:', estudianteData);

        // Transformar los datos al formato del frontend
        return transformarHorarioParaFrontend(estudianteData, {
            ...seccion,
            nivel_academico: grado,
            academic_year_name: academicYearName
        }, horarios);

    } catch (error) {
        console.error('❌ Error en getHorarioEstudiante:', error);
        throw error;
    }
};

/**
 * Obtiene los datos básicos del estudiante usando la ruta para representantes
 */
const getDatosBasicosEstudiante = async (estudianteId) => {
    try {
        console.log(`📥 Obteniendo datos del estudiante ${estudianteId} vía /representante`);
        const response = await fetch.get(`/api/students/${estudianteId}/representante`);

        console.log('📦 Respuesta de representante:', response);

        if (response.ok && response.data) {
            // La estructura puede ser response.data.data o response.data directamente
            const data = response.data.data || response.data;
            console.log('📦 Datos extraídos:', data);

            return {
                id: data.id || estudianteId,
                nombre: data.first_name || data.nombre || 'Estudiante',
                apellido: data.last_name || data.apellido || '',
                cedula: data.dni || data.cedula || ''
            };
        }

        // Si falla, usar datos de mis-estudiantes como fallback
        console.log('⚠️ Falló getStudentProfile, usando mis-estudiantes como fallback');
        const misEstudiantes = await fetch.get('/api/students/mis-estudiantes');

        if (misEstudiantes.ok && misEstudiantes.data) {
            const estudiantes = misEstudiantes.data.data || misEstudiantes.data;
            const estudiante = Array.isArray(estudiantes)
                ? estudiantes.find(e => e.id == estudianteId)
                : null;

            if (estudiante) {
                return {
                    id: estudiante.id,
                    nombre: estudiante.first_name || estudiante.nombre || 'Estudiante',
                    apellido: estudiante.last_name || estudiante.apellido || '',
                    cedula: estudiante.dni || estudiante.cedula || ''
                };
            }
        }

        // Si todo falla, devolver datos por defecto
        console.log('⚠️ Usando datos por defecto para estudiante');
        return {
            id: estudianteId,
            nombre: 'Estudiante',
            apellido: '',
            cedula: `EST-${estudianteId}`
        };

    } catch (error) {
        console.error('Error obteniendo datos del estudiante:', error);
        return {
            id: estudianteId,
            nombre: 'Estudiante',
            apellido: '',
            cedula: `EST-${estudianteId}`
        };
    }
};

/**
 * Transforma los datos de la BD al formato del frontend
 */
const transformarHorarioParaFrontend = (estudiante, seccion, horarios) => {
    console.log('🔄 Transformando horarios:', horarios);

    // Mapeo de días de la BD (Id_dia) a nombres y IDs del frontend
    const mapaDias = {
        1: { id: 'LUNES', nombre: 'Lunes', color: 'primary' },
        2: { id: 'MARTES', nombre: 'Martes', color: 'success' },
        3: { id: 'MIERCOLES', nombre: 'Miércoles', color: 'warning' },
        4: { id: 'JUEVES', nombre: 'Jueves', color: 'info' },
        5: { id: 'VIERNES', nombre: 'Viernes', color: 'danger' }
    };

    // Estructurar horario por días
    const horarioCompleto = {
        LUNES: [],
        MARTES: [],
        MIERCOLES: [],
        JUEVES: [],
        VIERNES: []
    };

    // Conjunto para profesores únicos
    const profesoresSet = new Map();

    // Procesar cada horario
    horarios.forEach(h => {
        console.log('   Procesando horario:', h);
        const diaKey = mapaDias[h.day_id]?.id;
        if (!diaKey) {
            console.log('   ⚠️ Día no reconocido:', h.day_id);
            return;
        }

        // Formatear hora
        const horaInicio = h.start_time ? h.start_time.substring(0, 5) : '00:00';
        const horaFin = h.end_time ? h.end_time.substring(0, 5) : '00:00';

        const clase = {
            materia: h.subject_name || 'Materia General',
            profesor: h.teacher_name || 'Profesor Asignado',
            aula: h.classroom_name || 'Aula Pendiente',
            hora: `${horaInicio} - ${horaFin}`,
            tipo: h.subject_type || 'práctica',
            seccion: h.section_name || '' // Incluir la sección de origen
        };

        console.log('   Clase transformada:', clase);
        horarioCompleto[diaKey].push(clase);

        // Agregar profesor al set si no existe
        if (h.teacher_name && !profesoresSet.has(h.teacher_name)) {
            profesoresSet.set(h.teacher_name, {
                nombre: h.teacher_name,
                materia: h.subject_name || 'Materia General'
            });
        }
    });

    // Ordenar clases por hora en cada día
    Object.keys(horarioCompleto).forEach(dia => {
        horarioCompleto[dia].sort((a, b) => {
            const horaA = a.hora.split(' - ')[0];
            const horaB = b.hora.split(' - ')[0];
            return horaA.localeCompare(horaB);
        });
    });

    // Calcular estadísticas
    let totalClasesSemana = 0;
    let totalHorasSemana = 0;

    Object.values(horarioCompleto).forEach(clasesDia => {
        totalClasesSemana += clasesDia.length;
        clasesDia.forEach(clase => {
            const [inicio, fin] = clase.hora.split(' - ');
            if (inicio && fin) {
                const [h1, m1] = inicio.split(':').map(Number);
                const [h2, m2] = fin.split(':').map(Number);
                const duracion = (h2 + m2 / 60) - (h1 + m1 / 60);
                totalHorasSemana += duracion;
            }
        });
    });

    console.log('📊 Estadísticas calculadas:', { totalClasesSemana, totalHorasSemana });

    // Formatear nombre completo del estudiante
    const nombreCompleto = estudiante.nombre && estudiante.apellido
        ? `${estudiante.nombre} ${estudiante.apellido}`.trim()
        : estudiante.nombre || 'Estudiante';

    const resultado = {
        estudiante: {
            nombre: nombreCompleto,
            codigo: estudiante.cedula || `EST-${estudiante.id}`,
            grado: seccion.nivel_academico || 'Grado General',
            seccion: seccion.nombre_seccion || 'A',
            anoAcademico: seccion.academic_year_name || '2024-2025',
            representante: 'Representante Legal'
        },
        estadisticas: {
            totalClasesSemana,
            totalHorasSemana: Math.round(totalHorasSemana * 10) / 10
        },
        horarioCompleto,
        profesores: Array.from(profesoresSet.values())
    };

    console.log('✅ Resultado final:', resultado);
    return resultado;
};