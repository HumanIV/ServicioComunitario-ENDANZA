// src/config/routesConfig.js - VERSIÓN CORREGIDA
import React from 'react'

// CORRECCIÓN: Usa ../ para subir desde src/config/ a src/
const Dashboard = React.lazy(() => import('../views/superRootDashboard/Dashboard'))
const Students = React.lazy(() => import('../views/Students/Students'))
const PerfilStudents = React.lazy(() => import('../views/Students/PerfilStudents'))
const Inscripcion = React.lazy(() => import('../views/Inscripcion/Inscripcion')) // Ajusté esta ruta
const Notas = React.lazy(() => import('../views/Notas/Notas'))
const Boletin = React.lazy(() => import('../views/Boletin/Boletin'))
const Horario = React.lazy(() => import('../views/Horario/Horario'))
const Aulas = React.lazy(() => import('../views/Aulas/Aulas'))
const InicioDocente = React.lazy(() => import('../views/Docente/InicioDocente'))
const HorarioDocente = React.lazy(() => import('../views/Docente/HorarioDocente'))
const Inicio = React.lazy(() => import('../views/Inicio/Inicio'))
const Profile = React.lazy(() => import('../views/profile/Profile'))

// NOTA: Según tu estructura, estos archivos están en profile/, no views/profile/
// Si no existen, coméntalos temporalmente:
// const boletinEstudiante = React.lazy(() => import('../views/profile/boletinEstudiante'))
// const horarioEstudiante = React.lazy(() => import('../views/profile/horarioEstudiante'))

// En su lugar, usa wrappers básicos o componentes reales si existen
const BoletinEstudianteWrapper = React.lazy(() => import('../views/profile/boletinEstudiante'))
const HorarioEstudianteWrapper = React.lazy(() => import('../views/profile/horarioEstudiante'))

export const routes = [
  // RUTAS DE ADMINISTRADOR
  {
    path: 'dashboard',
    name: 'Dashboard',
    element: <Dashboard />,
    roles: ['admin']
  },
  {
    path: 'students',
    name: 'Estudiantes',
    element: <Students />,
    roles: ['admin']
  },
  {
    path: 'perfil-students/:id',
    name: 'Perfil Estudiante',
    element: <PerfilStudents />,
    roles: ['admin']
  },
  {
    path: 'inscripcion',
    name: 'Inscripción',
    element: <Inscripcion />,
    roles: ['admin']
  },
  {
    path: 'aulas',
    name: 'Aulas',
    element: <Aulas />,
    roles: ['admin']
  },
  
  // RUTAS DE ADMINISTRADOR Y DOCENTE
  {
    path: 'notas',
    name: 'Notas',
    element: <Notas />,
    roles: ['admin', 'docente']
  },
  {
    path: 'boletin',
    name: 'Boletín',
    element: <Boletin />,
    roles: ['admin', 'docente']
  },
  {
    path: 'horario',
    name: 'Horario',
    element: <Horario />,
    roles: ['admin', 'docente']
  },
  
  // RUTAS DE DOCENTE
  {
    path: 'docente/inicio',
    name: 'Inicio Docente',
    element: <InicioDocente />,
    roles: ['docente']
  },
  {
    path: 'docente/horario',
    name: 'Horario Docente',
    element: <HorarioDocente />,
    roles: ['docente']
  },
  
  // RUTAS DE REPRESENTANTE
  {
    path: 'inicio',
    name: 'Inicio',
    element: <Inicio />,
    roles: ['representante']
  },
  {
    path: 'profile',
    name: 'Perfil',
    element: <Profile />,
    roles: ['representante']
  },
  
  // Rutas opcionales - descomenta si los archivos existen
  {
    path: 'boletin-estudiante',
    name: 'Boletín Estudiante',
    element: <BoletinEstudianteWrapper />,
    roles: ['representante']
  },
  {
    path: 'horario-estudiante',
    name: 'Horario Estudiante',
    element: <HorarioEstudianteWrapper />,
    roles: ['representante']
  },
]