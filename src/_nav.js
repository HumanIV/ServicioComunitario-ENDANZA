import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilLibraryBuilding,
  cilBook,
  cilReportSlash,
  cilStar,
  cilPencil,
  cilBlurLinear,
  cilClock,
  cilRoom,
  cilApple,
  cilAccountLogout,
  cilUser
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [


  {
    component: CNavItem,
    name: 'INICIO',
    to: '/Inicio',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'MODULES',
  },

  {
    component: CNavGroup,
    name: 'Perfil ',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Perfil del estudiante',
        to: '/Profile',
      },
      {
        component: CNavItem,
        name: 'Boletin',
        to: '/boletinEstudiante',
      },
      {
        component: CNavItem,
        name: 'Inscripcion',
        to: '/inscripcionPrevia',
      },
      {
        component: CNavItem,
        name: 'Horario',
        to: '/Horario',
      }
    ],
  },









  {
    component: CNavGroup,
    name: 'Estudiantes',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Estudiantes',
        to: '/Students',
      }
    ],
  },


  {
    component: CNavGroup,
    name: 'Inscripcion',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Inscripciones',
        to: '/Inscripcion',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Notas',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Notas',
        to: '/Notas',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Boletin',
    icon: <CIcon icon={cilBlurLinear} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ver Boletin',
        to: '/Boletin',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Horario',
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ver Horarios',
        to: '/Horario',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Aulas',
    icon: <CIcon icon={cilRoom} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ver Aulas',
        to: '/Aulas',
      },
    ],
  },



  {
    component: CNavGroup,
    name: 'Nutricion',
    icon: <CIcon icon={cilApple} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Nutricion del estudiante',
        to: '/Nutricion',
      },
    ],
  },

  /*{
    component: CNavGroup,
    name: 'Reportes y Estadísticas',
    icon: <CIcon icon={cilReportSlash} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ver Reportes',
        to: '/Reports',
      },
    ],
  },*/


  {
    component: CNavGroup,
    name: 'Login',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
    ],
  },
]

export default _nav
