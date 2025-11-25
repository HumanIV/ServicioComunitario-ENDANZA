import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilLibraryBuilding,
  cilBook,
  cilReportSlash,
  cilStar,
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
    name: 'Gestion Administrativa',
    icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Panel Administrativo',
        to: '/AdminPanel',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Recursos Humanos',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Panel de RRHH',
        to: '/PanelRRHH',
      },
    ],
  },

  {
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
