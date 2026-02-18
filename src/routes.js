// routes.js - Versión corregida

import React from 'react'
// Dashboard
const Dashboard = React.lazy(() => import('./views/superRootDashboard/Dashboard'))

// Login
const Login = React.lazy(() => import('./views/pages/login/Login'))

//Users
const Users = React.lazy(() => import('./views/users/users'))
const profile = React.lazy(() => import('./views/profile/Profile'))

const perfilRepresentanteEstudiante = React.lazy(()=> import('./views/profile/perfilRepresentanteEstudiante'))

const docenteAsignacion = React.lazy(() => import('./views/superRootDashboard/components/docenteAsignacion'))

//RUTAS

//Inicio
const Inicio = React.lazy(() => import('./views/Inicio/Inicio'))
const InicioNotas = React.lazy(() => import('./views/Inicio/InicioNotas'))
const InicioBoletines = React.lazy(() => import('./views/Inicio/InicioBoletines'))
const InicioHorarios = React.lazy(() => import('./views/Inicio/InicioHorarios'))

//Students
const Students = React.lazy(() => import('./views/Students/Students'))
const PerfilStudents = React.lazy(() => import('./views/Students/PerfilStudents'))

//Inscripcion
const Inscripcion = React.lazy(() => import('./views/profile/Inscripcion'))

//Notas 
const Notas = React.lazy(() => import('./views/Notas/Notas'))

//Boletin
const Boletin = React.lazy(() => import('./views/Boletin/Boletin'))
const boletinEstudiante = React.lazy(() => import('./views/profile/boletinEstudiante'))
const NotasEstudiante = React.lazy(() => import('./views/profile/notasEstudiante'))

//Horario
const Horario = React.lazy(() => import('./views/Horario/Horario'))
const horarioEstudiante = React.lazy(() => import('./views/profile/horarioEstudiante'))

//Aulas
const Aulas = React.lazy(() => import('./views/Aulas/Aulas'))

//prueba 
const prueba = React.lazy(() => import('./views/Boletin/components/resumenSeccion'))

//FIN RUTAS AGG
const Preinscripcion = React.lazy(() => import('./views/preinscripcion/Preinscripcion'))
const Representantes = React.lazy(() => import('./views/representantes/Representantes'))
const perfil = React.lazy(() => import('./views/perfilUSUARIO/perfil'))

const routes = [
  // Página principal
  { path: '/', exact: true, name: 'Home' },

  // Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Preinscripcion
  { path: '/preinscripcion', name: 'Preinscripción', element: Preinscripcion },

  // Representantes
  { path: '/representantes', name: 'Representantes', element: Representantes },

  // Login y Register
  { path: '/login', name: 'Login', element: Login },

  // RUTAS CON PARÁMETROS DINÁMICOS
  { path: '/perfilRepresentanteEstudiante/:id', name: 'PerfilRepresentanteEstudiante', element: perfilRepresentanteEstudiante },

  //Users
  { path: '/users', name: 'Users', element: Users },

  //RUTAS
  { path: '/inicio', name: 'Inicio', element: Inicio },
  { path: '/inicio-boletines', name: 'Inicio Boletines', element: InicioBoletines },
  { path: '/inicio-horarios', name: 'Inicio Horarios', element: InicioHorarios },
  { path: '/inscripcion', name: 'Inscripcion', element: Inscripcion }, // Inscripción

  { path: '/notas', name: 'Notas', element: Notas }, // Notas
  { path: '/boletin', name: 'Boletin', element: Boletin }, // Boletín
  { path: '/horario', name: 'Horario', element: Horario }, // Horario
  { path: '/aulas', name: 'Aulas', element: Aulas }, // Aulas
  { path: '/students', name: 'Students', element: Students }, // Students
  { path: '/students/:id', name: 'PerfilStudents', element: PerfilStudents }, // Perfil Students

  //USERS - CORREGIDO: Agregar :id a las rutas que lo necesitan
  { path: '/profile', name: 'Profile', element: profile }, // Profile
  { path: '/boletin-estudiante/:id', name: 'BoletinEstudiante', element: boletinEstudiante },// Boletín Estudiante con ID
  { path: '/notas-estudiante/:id', name: 'NotasEstudiante', element: NotasEstudiante },// Notas Estudiante con ID
  { path: '/horario-estudiante/:id', name: 'HorarioEstudiante', element: horarioEstudiante },// Horario Estudiante con ID 👈 CORREGIDO

  // Aliases (mantener por compatibilidad)
  { path: '/boletinEstudiante', name: 'BoletinEstudianteAlias', element: boletinEstudiante },// Alias (sin ID, redirigir o mostrar error)
  { path: '/horarioEstudiante', name: 'HorarioEstudianteAlias', element: horarioEstudiante },// Alias (sin ID, redirigir o mostrar error)

  { path: '/prueba', name: 'prueba', element: prueba },
  { path: '/docente/horario', name: 'Horario Docente', element: React.lazy(() => import('./views/Docente/HorarioDocente')) },
  { path: '/docente/inicio', name: 'Inicio Docente', element: React.lazy(() => import('./views/Docente/InicioDocente')) },

  { path: '/perfil', name: 'PerfilUsuarioGeneral', element: perfil }, // Perfil Usuario General

  { path: '/docenteAsignacion', name: 'docente Asignacion', element: docenteAsignacion }, // Asignación Docente
]

export default routes