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
  if (!formData.Telefono_Celular?.trim()) errores.Telefono_Celular = "Teléfono del estudiante requerido";
  
  // Validar datos del representante
  if (!formData.nombres_Representante?.trim()) errores.nombres_Representante = "Nombre del representante requerido";
  if (!formData.telefono_Rep?.trim()) errores.telefono_Rep = "Teléfono del representante requerido";
  
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