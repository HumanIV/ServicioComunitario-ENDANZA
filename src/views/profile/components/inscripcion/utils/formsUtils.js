export const inicializarFormularioCompleto = () => ({
  nombres: "",
  apellidos: "",
  fecha_nac: "",
  direccion_Habitacion: "",
  Telefono_Celular: "",
  grado: "",
  especialidad: "",
  convivencia: "",
  escuela: "",
  Grado_Escuela: "",
  Seguro_Escolar: "",
  nombre_Seguro: "",
  nombres_Representante: "",
  apellidos_Representante: "",
  telefono_Rep: "",
  telefonofijo_Rep: "",
  profesion: "",
  trabajo: "",
  direccion_Trabajo: "",
  peso: "",
  talla: "",
  edad: "",
  intolerancia: "",
  textIntolerancia: "",
  sintomasFrecuentes: "",
  operaciones: "",
  textOperaciones: "",
  medicacion: "",
  textMedicacion: "",
  control_Hormonal: "",
  textcontrolHormonal: "",
  alergias: "",
  textAlergia: "",
  nacimiento: "",
  antecedentesFamiliares: "",
  email_representante: "",
  relacion: "",
  tipo_sangre: "",
  usa_lentes: "",
  actividad_fisica: "",
  medico_tratante: "",
  nivel_estudios: "",
  observaciones_representante: ""
});

export const inicializarFormularioPreInscripcion = () => ({
  nombres: "",
  apellidos: "",
  fecha_nacimiento: "",
  email: "",
  telefono: "",
  nombres_representante: "",
  telefono_representante: "",
  relacion: "",
  grado_interes: "",
  horario_preferido: "",
  experiencia_danza: "no"
});

export const mapearPreInscripcionACompleta = (formDataPre) => {
  return {
    nombres: formDataPre.nombres,
    apellidos: formDataPre.apellidos,
    fecha_nac: formDataPre.fecha_nacimiento,
    Telefono_Celular: formDataPre.telefono,
    nombres_Representante: formDataPre.nombres_representante,
    telefono_Rep: formDataPre.telefono_representante,
    email_representante: formDataPre.email,
    relacion: formDataPre.relacion
  };
};

export const obtenerGradosDisponibles = () => [
  { value: "iniciacion", label: "Iniciación (4-6 años)" },
  { value: "1ro", label: "1ro - Básico (7-9 años)" },
  { value: "2do", label: "2do - Intermedio I (10-12 años)" },
  { value: "3ro", label: "3ro - Intermedio II (13-15 años)" },
  { value: "4to", label: "4to - Avanzado (16+ años)" },
  { value: "preparatorio", label: "Preparatorio" },
  { value: "profesional", label: "Profesional" },
  { value: "adultos", label: "Clases para adultos" }
];

export const obtenerEspecialidades = () => [
  "Ballet Clásico",
  "Danza Contemporánea",
  "Jazz",
  "Hip Hop",
  "Danza Folklórica",
  "Flamenco",
  "Danza Árabe",
  "Bailes de Salón",
  "Danza Moderna",
  "Danza Terapéutica"
];

export const obtenerHorariosPreferidos = () => [
  "Mañana (8:00 AM - 12:00 PM)",
  "Tarde (2:00 PM - 6:00 PM)",
  "Noche (6:00 PM - 9:00 PM)",
  "Sábados (8:00 AM - 2:00 PM)",
  "Indiferente"
];

export const obtenerParentescos = () => [
  "madre",
  "padre",
  "abuelo",
  "abuela",
  "tío",
  "tía",
  "hermano",
  "hermana",
  "tutor",
  "otro"
];

export const obtenerNivelesEstudios = () => [
  "primaria",
  "secundaria",
  "tecnico",
  "universitario",
  "postgrado"
];

export const sanitizarDatos = (formData) => {
  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'string') {
      sanitized[key] = formData[key].trim();
    } else {
      sanitized[key] = formData[key];
    }
  });
  
  return sanitized;
};

export const formatearParaBackend = (formData, tipo) => {
  const baseData = {
    ...formData,
    fecha_registro: new Date().toISOString(),
    tipo_inscripcion: tipo
  };
  
  if (tipo === 'preinscripcion') {
    return {
      ...baseData,
      estado: 'pendiente',
      expiracion: new Date(Date.now() + (72 * 60 * 60 * 1000)).toISOString()
    };
  }
  
  if (tipo === 'completa') {
    return {
      ...baseData,
      estado: 'completado',
      fecha_completado: new Date().toISOString()
    };
  }
  
  return baseData;
};

export const cargarDatosDesdeCodigo = async (codigo) => {
  // Simulación de carga de datos desde backend
  // En producción, aquí harías una llamada API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        codigo,
        nombres: "María José",
        apellidos: "Rodríguez Pérez",
        // ... más datos según el código
      };
      resolve(mockData);
    }, 500);
  });
};