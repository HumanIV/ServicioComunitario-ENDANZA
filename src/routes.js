import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/superRootDashboard/Dashboard'))

// Base
const Products = React.lazy(() => import('./views/base/products/products'))

// Login / Register (si planeas usarlos)
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))


//Users
const Users = React.lazy(() => import('./views/users/users'))
const profile = React.lazy(() => import('./views/profile/Profile'))

//Landing pages 

const LandingPages= React.lazy(() => import('./views/pages/LandingPages/LandingPages'))

//RUTAS

//Inicio

const Inicio = React.lazy(() => import ('./views/Inicio/Inicio'))

//Reportes y Estadísticas

const Reports = React.lazy(() => import('./views/Reportes/Reports'))


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

//Nutricion

const Nutricion = React.lazy(() => import('./views/Nutricion/Nutricion'))

//provisional experemintal

const Registro = React.lazy(() => import('./views/Registro/registro'))
const RegistroMain = React.lazy(() => import('./views/Registro/registro-estudiantil-main'))
const buscarEstudiante = React.lazy(() => import('./views/Registro/registro-estudiantil/buscar-estudiante'))
const crearEstudiante = React.lazy(() => import('./views/Registro/registro-estudiantil/crear-alumno'))
const InscripcionPeriodo = React.lazy(() => import('./views/Registro/registro-estudiantil/inscripcion-periodo'))
const tipoInscripcion = React.lazy(() => import('./views/Registro/registro-estudiantil/tipo-inscripcion'))
const validacionGrados= React.lazy(() => import('./views/Registro/registro-estudiantil/validacion-grados'))






//prueba 

const prueba = React.lazy(() => import('./views/Boletin/components/resumenSeccion'))

//FIN RUTAS AGG


const routes = [
  // Página principal
  { path: '/', exact: true, name: 'Home' },

  // Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Base (Gestión de Contenido)
  { path: '/base/products', name: 'Products', element: Products },

  // Login y Register
  { path: '/login', name: 'Login', element: Login },
  { path: '/register', name: 'Register', element: Register },
  //RUTA

  //Users
  {path: '/users', name: 'Users', element: Users},

  //RUTAS
  {path: '/Inicio', name: 'Inicio', element: Inicio},
  {path: '/Reports', name: 'Reports', element: Reports}, // Reportes y Estadísticas
  {path: '/LandingPages', name: 'LandingPages', element: LandingPages},

  {path: '/Inscripcion', name: 'Inscripcion', element: Inscripcion}, // Inscripción


  {path: '/Notas', name: 'Notas', element: Notas}, // Notas
  {path: '/Boletin', name: 'Boletin', element: Boletin}, // Boletín
  {path: '/Horario', name: 'Horario', element: Horario}, // Horario
  {path: '/Aulas', name: 'Aulas', element: Aulas}, // Aulas
  {path: '/Nutricion', name: 'Nutricion', element: Nutricion}, // Nutrición
  {path: '/Students', name: 'Students', element: Students}, // Students
  {path: '/PerfilStudents/:id', name: 'PerfilStudents', element: PerfilStudents}, // Perfil Students
  
  
  //USERS
  {path: '/profile', name: 'Profile', element: profile}, // Profile
  {path: '/boletinEstudiante', name: 'BoletinEstudiante', element: boletinEstudiante},// Boletín Estudiante
  {path: '/horarioEstudiante', name: 'HorarioEstudiante', element: horarioEstudiante},// Horario Estudiante



  //FIN RUTAS AGG



  {path: '/prueba', name: 'prueba', element: prueba}, // prueba




]

export default routes
