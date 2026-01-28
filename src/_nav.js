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
  cilUser,
  cilShieldAlt
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'INICIO',
    to: '/inicio',
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
        to: '/profile',
      },
      {
        component: CNavItem,
        name: 'Boletin',
        to: '/boletin-estudiante',
      },
      {
        component: CNavItem,
        name: 'Inscripcion',
        to: '/inscripcion',
      },
      {
        component: CNavItem,
        name: 'Horario',
        to: '/horario-estudiante',
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
        to: '/students',
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
        to: '/inscripcion',
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
        to: '/notas',
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
        to: '/boletin',
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
        to: '/horario',
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
        to: '/aulas',
      },
    ],
  },


  {
    component: CNavGroup,
    name: 'Docente',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Panel de Control',
        to: '/docente/inicio',
      },
      {
        component: CNavItem,
        name: 'Mi Horario',
        to: '/docente/horario',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Login',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      }
    ],
  },
]

export default _nav

