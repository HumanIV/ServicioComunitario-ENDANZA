// utils/pdfGenerator.js
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const generarPDFHorario = (horarioUsuario, diasSemana, callback) => {
  try {
    const doc = new jsPDF('landscape')
    const fecha = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    // Título y encabezado
    doc.setFontSize(20)
    doc.setTextColor(41, 128, 185)
    doc.text('ESCUELA DE DANZA ENDANZA', 148, 20, { align: 'center' })
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('HORARIO ACADÉMICO', 148, 30, { align: 'center' })
    
    // Información del estudiante
    doc.setFontSize(10)
    doc.text(`Estudiante: ${horarioUsuario.estudiante.nombre}`, 20, 45)
    doc.text(`Código: ${horarioUsuario.estudiante.codigo}`, 20, 52)
    doc.text(`Grado: ${horarioUsuario.estudiante.grado} - Sección: ${horarioUsuario.estudiante.seccion}`, 20, 59)
    doc.text(`Año Académico: ${horarioUsuario.estudiante.anoAcademico}`, 20, 66)
    doc.text(`Fecha de emisión: ${fecha}`, 20, 73)
    
    // Tabla del horario semanal
    const tableData = []
    diasSemana.forEach(dia => {
      const clasesDia = horarioUsuario.horarioCompleto[dia.id] || []
      clasesDia.forEach((clase, index) => {
        tableData.push([
          dia.nombre,
          clase.hora,
          clase.materia,
          clase.profesor,
          clase.aula
        ])
      })
    })
    
    doc.autoTable({
      startY: 80,
      head: [['Día', 'Horario', 'Materia', 'Profesor', 'Aula']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 60 },
        3: { cellWidth: 50 },
        4: { cellWidth: 40 }
      },
      margin: { top: 80 }
    })
    
    // Estadísticas al final
    const finalY = doc.lastAutoTable.finalY + 15
    doc.setFontSize(11)
    doc.setTextColor(52, 73, 94)
    doc.text('ESTADÍSTICAS DEL HORARIO', 148, finalY, { align: 'center' })
    
    doc.setFontSize(9)
    doc.text(`• Total de clases por semana: ${horarioUsuario.estadisticas.totalClasesSemana}`, 30, finalY + 10)
    doc.text(`• Total de horas semanales: ${horarioUsuario.estadisticas.totalHorasSemana} horas`, 30, finalY + 17)
    doc.text(`• Profesores asignados: ${horarioUsuario.estadisticas.profesoresUnicos}`, 30, finalY + 24)
    doc.text(`• Aulas utilizadas: ${horarioUsuario.estadisticas.aulasUtilizadas}`, 30, finalY + 31)
    
    // Pie de página
    const finalPageY = doc.internal.pageSize.height - 20
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Horario oficial de la Escuela de Danza Endanza - Cualquier cambio será notificado oportunamente', 
      148, finalPageY, { align: 'center' })
    
    // Descargar PDF
    const nombreArchivo = `Horario_${horarioUsuario.estudiante.codigo}_${new Date().getFullYear()}.pdf`
    doc.save(nombreArchivo)
    
    // Llamar callback si existe
    if (callback && typeof callback === 'function') {
      callback()
    }
    
    return true
  } catch (error) {
    console.error('Error en generarPDFHorario:', error)
    throw error
  }
}

// Opcional: Exportar función para imprimir
export const prepararImpresion = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}