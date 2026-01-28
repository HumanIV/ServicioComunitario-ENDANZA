import React from 'react'
// Dashboard
const Dashboard = React.lazy(() => import('./views/superRootDashboard/Dashboard'))


// Login
const Login = React.lazy(() => import('./views/pages/login/Login'))


//Users
const Users = React.lazy(() => import('./views/users/users'))
const profile = React.lazy(() => import('./views/profile/Profile'))


//RUTAS

//Inicio

const Inicio = React.lazy(() => import('./views/Inicio/Inicio'))

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

//Horario

const Horario = React.lazy(() => import('./views/Horario/Horario'))
const horarioEstudiante = React.lazy(() => import('./views/profile/horarioEstudiante'))

//Aulas

const Aulas = React.lazy(() => import('./views/Aulas/Aulas'))


//provisional experemintal

const Registro = React.lazy(() => import('./views/Registro/registro'))
const RegistroMain = React.lazy(() => import('./views/Registro/registro-estudiantil-main'))
const buscarEstudiante = React.lazy(() => import('./views/Registro/registro-estudiantil/buscar-estudiante'))
const crearEstudiante = React.lazy(() => import('./views/Registro/registro-estudiantil/crear-alumno'))
const InscripcionPeriodo = React.lazy(() => import('./views/Registro/registro-estudiantil/inscripcion-periodo'))
const tipoInscripcion = React.lazy(() => import('./views/Registro/registro-estudiantil/tipo-inscripcion'))
const validacionGrados = React.lazy(() => import('./views/Registro/registro-estudiantil/validacion-grados'))






//prueba 

const prueba = React.lazy(() => import('./views/Boletin/components/resumenSeccion'))

//FIN RUTAS AGG


const routes = [
  // Página principal
  { path: '/', exact: true, name: 'Home' },

  // Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Login y Register
  { path: '/login', name: 'Login', element: Login },
  //RUTA

  //Users
  { path: '/users', name: 'Users', element: Users },

  //RUTAS
  { path: '/inicio', name: 'Inicio', element: Inicio },


  { path: '/inscripcion', name: 'Inscripcion', element: Inscripcion }, // Inscripción


  { path: '/notas', name: 'Notas', element: Notas }, // Notas
  { path: '/boletin', name: 'Boletin', element: Boletin }, // Boletín
  { path: '/horario', name: 'Horario', element: Horario }, // Horario
  { path: '/aulas', name: 'Aulas', element: Aulas }, // Aulas
  { path: '/students', name: 'Students', element: Students }, // Students
  { path: '/perfil-students/:id', name: 'PerfilStudents', element: PerfilStudents }, // Perfil Students


  //USERS
  { path: '/profile', name: 'Profile', element: profile }, // Profile
  { path: '/boletin-estudiante', name: 'BoletinEstudiante', element: boletinEstudiante },// Boletín Estudiante
  { path: '/boletinEstudiante', name: 'BoletinEstudianteAlias', element: boletinEstudiante },// Alias
  { path: '/horario-estudiante', name: 'HorarioEstudiante', element: horarioEstudiante },// Horario Estudiante
  { path: '/horarioEstudiante', name: 'HorarioEstudianteAlias', element: horarioEstudiante },// Alias


  { path: '/prueba', name: 'prueba', element: prueba },
  { path: '/docente/horario', name: 'Horario Docente', element: React.lazy(() => import('./views/Docente/HorarioDocente')) },
  { path: '/docente/inicio', name: 'Inicio Docente', element: React.lazy(() => import('./views/Docente/InicioDocente')) },




]

export default routes
