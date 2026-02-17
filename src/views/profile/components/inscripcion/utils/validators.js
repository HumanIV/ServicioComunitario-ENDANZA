export const generarCodigoPreInscripcion = () => {
  const fecha = new Date();
  const timestamp = fecha.getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PRE-${timestamp}${random}`;
};

export const generarCodigoInscripcion = () => {
  const fecha = new Date();
  const año = fecha.getFullYear().toString().slice(-2);
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const dia = fecha.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `END-${año}${mes}${dia}-${random}`;
};

export const validarEmail = (email) => {
  if (!email) return true; // Opcional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validarTelefono = (telefono) => {
  if (!telefono) return false;
  const re = /^[0-9\s\-\(\)\+]{7,15}$/;
  return re.test(telefono);
};

export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  
  if (nacimiento > hoy) return null;
  
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
};

export const validarFormularioCompleto = (formData) => {
  const errores = {};
  
  // Validar datos del estudiante
  if (!formData.nombres?.trim()) errores.nombres = "Nombres del estudiante requeridos";
  if (!formData.apellidos?.trim()) errores.apellidos = "Apellidos del estudiante requeridos";
  if (!formData.grado) errores.grado = "Seleccione un grado";
  
  // Validar datos del representante según la selección
  if (!formData.quien_es_representante) {
    errores.quien_es_representante = "Debe seleccionar quién será el representante";
  } else {
    if (formData.quien_es_representante === 'Madre') {
      if (!formData.telefono_Madre?.trim()) {
        errores.telefono_Madre = "Debe proporcionar un teléfono de contacto para la madre";
      }
    } else if (formData.quien_es_representante === 'Padre') {
      if (!formData.telefono_Padre?.trim()) {
        errores.telefono_Padre = "Debe proporcionar un teléfono de contacto para el padre";
      }
    } else if (formData.quien_es_representante === 'Otro') {
      if (!formData.nombres_Representante?.trim()) errores.nombres_Representante = "Nombre del representante requerido";
      if (!formData.apellidos_Representante?.trim()) errores.apellidos_Representante = "Apellidos del representante requerido";
      if (!formData.parentesco_Otro?.trim()) errores.parentesco_Otro = "Parentesco requerido";
      if (!formData.telefono_Rep?.trim()) errores.telefono_Rep = "Teléfono del representante requerido";
    }
  }
  
  // Validar email si se proporciona
  if (formData.email_representante && !validarEmail(formData.email_representante)) {
    errores.email_representante = "Correo electrónico inválido";
  }
  
  // Validaciones condicionales de salud
  if (formData.alergias === "Si" && !formData.textAlergia?.trim()) {
    errores.textAlergia = "Describa las alergias";
  }
  
  if (formData.intolerancia === "Si" && !formData.textIntolerancia?.trim()) {
    errores.textIntolerancia = "Describa las intolerancias";
  }
  
  if (formData.medicacion === "Si" && !formData.textMedicacion?.trim()) {
    errores.textMedicacion = "Describa la medicación";
  }
  
  if (formData.operaciones === "Si" && !formData.textOperaciones?.trim()) {
    errores.textOperaciones = "Describa las operaciones";
  }
  
  return {
    esValido: Object.keys(errores).length === 0,
    errores
  };
};

export const validarFormularioPreInscripcion = (formData) => {
  const errores = {};
  
  if (!formData.nombres?.trim()) errores.nombres = "Nombres requeridos";
  if (!formData.apellidos?.trim()) errores.apellidos = "Apellidos requeridos";
  if (!formData.telefono?.trim()) errores.telefono = "Teléfono requerido";
  if (!formData.grado_interes) errores.grado_interes = "Seleccione grado de interés";
  if (!formData.nombres_representante?.trim()) errores.nombres_representante = "Nombre del representante requerido";
  if (!formData.telefono_representante?.trim()) errores.telefono_representante = "Teléfono del representante requerido";
  
  if (formData.email && !validarEmail(formData.email)) {
    errores.email = "Correo electrónico inválido";
  }
  
  return {
    esValido: Object.keys(errores).length === 0,
    errores
  };
};

export const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const opciones = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

export const calcularExpiracionPreInscripcion = (horas = 72) => {
  const ahora = new Date();
  const expiracion = new Date(ahora.getTime() + (horas * 60 * 60 * 1000));
  return expiracion;
};