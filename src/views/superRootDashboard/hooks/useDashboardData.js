// Archivo: src/dashboard/hooks/useDashboardData.js

import { useState, useEffect, useCallback } from 'react';
import { listUsers } from '../../../services/userService';
import { 
  getEnrollmentPeriod, 
  updateEnrollmentPeriod, 
  getGradesPeriod, 
  updateGradesPeriod 
} from '../../../services/configService';
import { listSections } from '../../../services/sectionsService';
import { listStudents } from '../../../services/studentsService';

export const useDashboardData = (selectedYearId) => {
  const [usuarios, setUsuarios] = useState([]);
  const [repsCount, setRepsCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [visiblePeriodoInscripcion, setVisiblePeriodoInscripcion] = useState(false);
  const [visibleSubidaNotas, setVisibleSubidaNotas] = useState(false);

  const [periodoInscripcion, setPeriodoInscripcion] = useState({ 
    fechaInicio: '', 
    fechaFin: '', 
    activo: false 
  });
  
  const [periodoSubidaNotas, setPeriodoSubidaNotas] = useState({ 
    fechaInicio: '', 
    fechaFin: '', 
    activo: false 
  });

  // 📌 Función para cargar todos los datos
  const fetchAllData = useCallback(async () => {
    if (!selectedYearId) {
      console.log("📊 No hay año seleccionado, esperando...");
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`📊 Cargando datos para año ID: ${selectedYearId}`);
    
    try {
      // 1. Cargar usuarios (no depende del año)
      const usersData = await listUsers();
      console.log("📊 Usuarios recibidos:", usersData);
      
      const users = Array.isArray(usersData) ? usersData : [];
      
      const usuariosTransformados = users
        .filter(u => u?.role !== 'representante')
        .map(u => ({
          id: u.id,
          nombre: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || 'Sin nombre',
          rol: u.role || 'sin rol',
          activo: u.status === 'active'
        }));
      
      setUsuarios(usuariosTransformados);
      setRepsCount(users.filter(u => u?.role === 'representante').length);

      // 2. Cargar período de inscripción
      const enrollmentData = await getEnrollmentPeriod(selectedYearId);
      console.log("📊 Período inscripción:", enrollmentData);
      setPeriodoInscripcion(enrollmentData);

      // 3. Cargar período de subida de notas
      const gradesData = await getGradesPeriod(selectedYearId);
      console.log("📊 Período notas:", gradesData);
      setPeriodoSubidaNotas(gradesData);

      // 4. Cargar secciones del año seleccionado
      const sectionsData = await listSections(selectedYearId);
      console.log("📊 Secciones recibidas:", sectionsData);
      setSections(sectionsData);

      // 5. Cargar estudiantes del año seleccionado
      const studentsData = await listStudents({ academicYearId: selectedYearId });
      console.log("📊 Estudiantes recibidos:", studentsData);
      setStudents(studentsData);

    } catch (error) {
      console.error("❌ Error cargando datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedYearId]);

  // 📌 Cargar datos cuando cambia el año seleccionado
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, selectedYearId]); // 👈 AÑADIMOS selectedYearId como dependencia

  // 📌 Guardar período de inscripción
  const guardarPeriodoInscripcion = async (data) => {
    if (!selectedYearId) {
      console.error("No hay año seleccionado");
      return;
    }
    
    try {
      const response = await updateEnrollmentPeriod(selectedYearId, data);
      if (response.ok) {
        // Actualizar estado local
        setPeriodoInscripcion(data);
        setVisiblePeriodoInscripcion(false);
        console.log("✅ Período de inscripción guardado");
        
        // 👇 FORZAR RECARGA DE DATOS después de guardar
        await fetchAllData();
        
      } else {
        console.error("❌ Error guardando:", response.msg);
      }
    } catch (error) {
      console.error("❌ Error guardando período de inscripción:", error);
    }
  };

  // 📌 Guardar período de subida de notas
  const guardarPeriodoSubidaNotas = async (data) => {
    if (!selectedYearId) {
      console.error("No hay año seleccionado");
      return;
    }
    
    try {
      const response = await updateGradesPeriod(selectedYearId, data);
      if (response.ok) {
        // Actualizar estado local
        setPeriodoSubidaNotas(data);
        setVisibleSubidaNotas(false);
        console.log("✅ Período de notas guardado");
        
        // 👇 FORZAR RECARGA DE DATOS después de guardar
        await fetchAllData();
        
      } else {
        console.error("❌ Error guardando:", response.msg);
      }
    } catch (error) {
      console.error("❌ Error guardando período de notas:", error);
    }
  };

  return {
    periodoInscripcion,
    periodoSubidaNotas,
    usuarios,
    repsCount,
    students,
    sections,
    loading,
    visiblePeriodoInscripcion,
    setVisiblePeriodoInscripcion,
    visibleSubidaNotas,
    setVisibleSubidaNotas,
    guardarPeriodoInscripcion,
    guardarPeriodoSubidaNotas,
    refreshData: fetchAllData // Exponemos la función para usarla manualmente si es necesario
  };
};

export default useDashboardData;