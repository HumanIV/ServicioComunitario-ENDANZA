export const generarPlanillaHTML = (formData, codigoInscripcion) => {
  // Función para determinar qué datos del representante mostrar
  const obtenerDatosRepresentante = () => {
    // Si el representante es la Madre
    if (formData.quien_es_representante === 'Madre') {
      return {
        nombreCompleto: `${formData.nombre_Madre || ''} ${formData.apellido_Madre || ''}`.trim() || 'No especificado',
        telefono: formData.telefono_Madre || 'No especificado',
        profesion: formData.ocupacion_Madre || 'No especificado',
        trabajo: formData.trabajo_Madre || 'No especificado',
        direccionTrabajo: formData.direccion_Trabajo_Madre || 'No especificado',
        relacion: 'Madre'
      };
    }
    // Si el representante es el Padre
    else if (formData.quien_es_representante === 'Padre') {
      return {
        nombreCompleto: `${formData.nombre_Padre || ''} ${formData.apellido_Padre || ''}`.trim() || 'No especificado',
        telefono: formData.telefono_Padre || 'No especificado',
        profesion: formData.ocupacion_Padre || 'No especificado',
        trabajo: formData.trabajo_Padre || 'No especificado',
        direccionTrabajo: formData.direccion_Trabajo_Padre || 'No especificado',
        relacion: 'Padre'
      };
    }
    // Si el representante es Otro
    else {
      return {
        nombreCompleto: `${formData.nombres_Representante || ''} ${formData.apellidos_Representante || ''}`.trim() || 'No especificado',
        telefono: formData.telefono_Rep || 'No especificado',
        profesion: formData.profesion_Rep || formData.profesion || 'No especificado',
        trabajo: formData.trabajo_Rep || formData.trabajo || 'No especificado',
        direccionTrabajo: formData.direccion_Trabajo_Rep || formData.direccion_Trabajo || 'No especificado',
        relacion: formData.parentesco_Otro || 'Representante Legal'
      };
    }
  };

  const datosRep = obtenerDatosRepresentante();

  // Crear contenido HTML para la planilla
  const contenido = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Planilla de Inscripción - ${formData.nombres} ${formData.apellidos}</title>
      <style>
        /* Estilos generales */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
          padding: 20px;
        }
        
        .container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        /* Encabezado */
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #3498db;
        }
        
        .header h1 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 28px;
        }
        
        .header h2 {
          color: #3498db;
          margin-bottom: 15px;
          font-size: 22px;
        }
        
        .header .periodo {
          color: #7f8c8d;
          font-size: 16px;
          font-weight: bold;
        }
        
        /* Código de inscripción */
        .codigo-section {
          text-align: center;
          margin: 25px 0;
          padding: 15px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px dashed #dee2e6;
          border-radius: 8px;
        }
        
        .codigo {
          font-size: 24px;
          font-weight: bold;
          color: #e74c3c;
          letter-spacing: 2px;
          margin: 10px 0;
        }
        
        .fecha {
          color: #7f8c8d;
          font-size: 14px;
        }
        
        /* Secciones */
        .section {
          margin-bottom: 25px;
          padding: 20px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          background: #fff;
        }
        
        .section h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #3498db;
          font-size: 18px;
          display: flex;
          align-items: center;
        }
        
        .section h3::before {
          content: "";
          display: inline-block;
          width: 24px;
          height: 24px;
          margin-right: 10px;
          background-size: contain;
          background-repeat: no-repeat;
        }
        
        .datos-estudiante h3::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232c3e50'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
        }
        
        .datos-representante h3::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232c3e50'%3E%3Cpath d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E");
        }
        
        .datos-salud h3::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232c3e50'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
        }
        
        /* Grid de información */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .info-item {
          margin-bottom: 12px;
        }
        
        .label {
          font-weight: bold;
          color: #2c3e50;
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .value {
          color: #34495e;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 4px;
          border-left: 3px solid #3498db;
          font-size: 14px;
        }
        
        .value.empty {
          color: #95a5a6;
          font-style: italic;
        }
        
        /* Tabla para datos específicos */
        .table-responsive {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }
        
        th {
          background-color: #3498db;
          color: white;
          font-weight: bold;
        }
        
        tr:hover {
          background-color: #f5f5f5;
        }
        
        /* Estados y badges */
        .estado {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .estado.registrado {
          background-color: #d4edda;
          color: #155724;
        }
        
        .estado.pendiente {
          background-color: #fff3cd;
          color: #856404;
        }
        
        /* Footer */
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
          color: #7f8c8d;
          font-size: 12px;
        }
        
        .footer p {
          margin: 5px 0;
        }
        
        .footer .contacto {
          color: #3498db;
          font-weight: bold;
        }
        
        /* Responsive */
        @media print {
          body {
            padding: 0;
            background: white;
          }
          
          .container {
            box-shadow: none;
            padding: 15px;
          }
          
          .no-print {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Encabezado -->
        <div class="header">
          <h1>ESCUELA DE DANZA ENDANZA</h1>
          <h2>PLANILLA DE INSCRIPCIÓN OFICIAL</h2>
          <p class="periodo"><strong>Período Académico ${new Date().getFullYear()}</strong></p>
        </div>
        
        <!-- Código de inscripción -->
        <div class="codigo-section">
          <div class="codigo">${codigoInscripcion}</div>
          <div class="fecha">
            Fecha de registro: ${new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}<br>
            Hora: ${new Date().toLocaleTimeString('es-ES')}
          </div>
          <div class="estado registrado">INSCRIPCIÓN REGISTRADA</div>
        </div>
        
        <!-- Datos del estudiante -->
        <div class="section datos-estudiante">
          <h3>📋 DATOS DEL ESTUDIANTE</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nombre completo:</span>
              <div class="value">${formData.nombres} ${formData.apellidos}</div>
            </div>
            
            <div class="info-item">
              <span class="label">Fecha de nacimiento:</span>
              <div class="value ${!formData.fecha_nac ? 'empty' : ''}">
                ${formData.fecha_nac || 'No especificado'}
                ${formData.edad ? ` (${formData.edad} años)` : ''}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Dirección:</span>
              <div class="value ${!formData.direccion_Habitacion ? 'empty' : ''}">
                ${formData.direccion_Habitacion || 'No especificado'}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Grado/Nivel:</span>
              <div class="value ${!formData.grado ? 'empty' : ''}">
                ${formData.grado || 'No especificado'}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Especialidad:</span>
              <div class="value ${!formData.especialidad ? 'empty' : ''}">
                ${formData.especialidad || 'No especificado'}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Convivencia:</span>
              <div class="value ${!formData.convivencia ? 'empty' : ''}">
                ${formData.convivencia || 'No especificado'}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Institución educativa:</span>
              <div class="value ${!formData.escuela ? 'empty' : ''}">
                ${formData.escuela || 'No especificado'}
                ${formData.Grado_Escuela ? ` - ${formData.Grado_Escuela}` : ''}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Seguro escolar:</span>
              <div class="value">
                ${formData.Seguro_Escolar === 'si' ? 'Sí' : 'No'}
                ${formData.Seguro_Escolar === 'si' && formData.nombre_Seguro ? ` (${formData.nombre_Seguro})` : ''}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Datos del representante -->
        <div class="section datos-representante">
          <h3>👨‍👩‍👧‍👦 DATOS DEL REPRESENTANTE</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Representante designado:</span>
              <div class="value">${formData.quien_es_representante || 'No especificado'}</div>
            </div>
            
            <div class="info-item">
              <span class="label">Nombre completo:</span>
              <div class="value">${datosRep.nombreCompleto}</div>
            </div>
            
            <div class="info-item">
              <span class="label">Relación con estudiante:</span>
              <div class="value">${datosRep.relacion}</div>
            </div>
            
            <div class="info-item">
              <span class="label">Teléfono de contacto:</span>
              <div class="value ${datosRep.telefono === 'No especificado' ? 'empty' : ''}">
                ${datosRep.telefono}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Profesión/Ocupación:</span>
              <div class="value ${datosRep.profesion === 'No especificado' ? 'empty' : ''}">
                ${datosRep.profesion}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Lugar de trabajo:</span>
              <div class="value ${datosRep.trabajo === 'No especificado' ? 'empty' : ''}">
                ${datosRep.trabajo}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Dirección trabajo:</span>
              <div class="value ${datosRep.direccionTrabajo === 'No especificado' ? 'empty' : ''}">
                ${datosRep.direccionTrabajo}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Datos de salud -->
        <div class="section datos-salud">
          <h3>🏥 DATOS DE SALUD</h3>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Medidas físicas:</span>
              <div class="value">
                ${formData.peso ? `Peso: ${formData.peso} kg` : 'Peso: No especificado'}
                ${formData.talla ? ` | Talla: ${formData.talla} cm` : ''}
                ${formData.tipo_sangre ? ` | Tipo de sangre: ${formData.tipo_sangre}` : ''}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Alergias:</span>
              <div class="value ${formData.alergias !== 'Si' ? 'empty' : ''}">
                ${formData.alergias === 'Si' ? 'Sí' : 'No'}
                ${formData.textAlergia ? ` - ${formData.textAlergia}` : ''}
              </div>
            </div>
            
            <div class="info-item">
              <span class="label">Intolerancias:</span>
              <div class="value ${formData.intolerancia !== 'Si' ? 'empty' : ''}">
                ${formData.intolerancia === 'Si' ? 'Sí' : 'No'}
                ${formData.textIntolerancia ? ` - ${formData.textIntolerancia}` : ''}
              </div>
            </div>
          </div>
          
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Aspecto médico</th>
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                ${formData.medicacion === 'Si' ? `
                <tr>
                  <td><strong>Medicación regular:</strong></td>
                  <td>${formData.textMedicacion || 'No especificada'}</td>
                </tr>
                ` : ''}
                
                ${formData.operaciones === 'Si' ? `
                <tr>
                  <td><strong>Operaciones:</strong></td>
                  <td>${formData.textOperaciones || 'No especificadas'}</td>
                </tr>
                ` : ''}
                
                ${formData.antecedentesFamiliares ? `
                <tr>
                  <td><strong>Antecedentes familiares:</strong></td>
                  <td>${formData.antecedentesFamiliares}</td>
                </tr>
                ` : ''}
                
                ${formData.sintomasFrecuentes ? `
                <tr>
                  <td><strong>Observaciones médicas:</strong></td>
                  <td>${formData.sintomasFrecuentes}</td>
                </tr>
                ` : ''}
                
                ${formData.actividad_fisica ? `
                <tr>
                  <td><strong>Actividad física:</strong></td>
                  <td>
                    ${formData.actividad_fisica === 'si_totalmente' ? 'Puede participar totalmente' : 
                      formData.actividad_fisica === 'si_con_limitaciones' ? 'Puede participar con limitaciones' :
                      formData.actividad_fisica === 'no' ? 'No puede participar' :
                      formData.actividad_fisica === 'consulta_medica' ? 'Requiere consulta médica' :
                      'No especificado'}
                  </td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>Documento generado automáticamente el ${new Date().toLocaleString('es-ES')}</p>
          <p><strong>Conserve este documento como comprobante oficial de inscripción</strong></p>
          <p class="contacto">Escuela de Danza Endanza • contacto@endanza.edu • www.endanza.edu</p>
          <p class="no-print">Para versiones actualizadas consulte el sistema de inscripciones</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Crear blob y descargar
  const blob = new Blob([contenido], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `planilla-inscripcion-${formData.nombres.toLowerCase().replace(/\s+/g, '-')}-${codigoInscripcion}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return true;
};

export const generarComprobantePreInscripcion = (formData, codigoPreInscripcion, fechaExpiracion) => {
  const contenido = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Comprobante Pre-Inscripción - ${formData.nombres}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .codigo { text-align: center; font-size: 24px; font-weight: bold; color: #e74c3c; margin: 20px 0; padding: 15px; background: #f8f9fa; border: 2px dashed #ddd; }
        .info-item { margin: 8px 0; }
        .label { font-weight: bold; color: #2c3e50; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>COMPROBANTE DE PRE-INSCRIPCIÓN</h2>
        <p>Escuela de Danza Endanza</p>
      </div>
      
      <div class="codigo">
        ${codigoPreInscripcion}<br>
        <small>Válido hasta: ${fechaExpiracion}</small>
      </div>
      
      <div>
        <div class="info-item"><span class="label">Estudiante:</span> ${formData.nombres} ${formData.apellidos}</div>
        <div class="info-item"><span class="label">Representante:</span> ${formData.nombres_representante}</div>
        <div class="info-item"><span class="label">Teléfono:</span> ${formData.telefono_representante}</div>
        <div class="info-item"><span class="label">Grado interés:</span> ${formData.grado_interes}</div>
        <div class="info-item"><span class="label">Fecha registro:</span> ${new Date().toLocaleString('es-ES')}</div>
      </div>
      
      <div class="footer">
        <p>Este comprobante solo reserva el cupo por 72 horas</p>
        <p>Complete la inscripción completa para formalizar</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([contenido], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pre-inscripcion-${codigoPreInscripcion}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};