import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Base
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Products = React.lazy(() => import('./views/base/products/products'))

// Login / Register (si planeas usarlos)
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

//RUTA
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))

//Users
const Users = React.lazy(() => import('./views/users/users'))

//Landing pages 

const LandingPages= React.lazy(() => import('./views/pages/LandingPages/LandingPages'))

//RUTAS

//Inicio

const Inicio = React.lazy(() => import ('./views/Inicio/Inicio'))

// Gestión Administrativa

const AdminPanel = React.lazy(() => import('./views/GestionAdministrativa/AdminPanel'))

//Recursos Humanos RRHH

const PanelRRHH = React.lazy(() => import('./views/RRHH/PanelRRHH'))

//Reportes y Estadísticas

const Reports = React.lazy(() => import('./views/Reportes/Reports'))


//FIN RUTAS AGG


const routes = [
  // Página principal
  { path: '/', exact: true, name: 'Home' },

  // Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Base (Gestión de Contenido)
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/products', name: 'Products', element: Products },

  // Login y Register
  { path: '/login', name: 'Login', element: Login },
  { path: '/register', name: 'Register', element: Register },
  //RUTA
  {path: '/buttons/buttons', name: 'Buttons', element: Buttons},
  //Users
  {path: '/users', name: 'Users', element: Users},

  //RUTAS
  {path: '/Inicio', name: 'Inicio', element: Inicio},
  {path: '/AdminPanel', name: 'AdminPanel', element: AdminPanel}, // Gestión Administrativa
  {path: '/PanelRRHH', name: 'PanelRRHH', element: PanelRRHH}, // Recursos Humanos RRHH
  {path: '/Reports', name: 'Reports', element: Reports}, // Reportes y Estadísticas
  {path: '/LandingPages', name: 'LandingPages', element: LandingPages},
  //FIN RUTAS AGG





]

export default routes
