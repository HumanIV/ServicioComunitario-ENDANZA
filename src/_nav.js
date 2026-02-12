// src/_nav.js
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilSpeedometer,
  cilBook,
  cilNotes,
  cilPencil,
  cilChart,
  cilClock,
  cilBuilding,
  cilUser,
  cilPeople,
  cilTask,
  cilSpreadsheet,
  cilCalendar,
  cilEducation,
  cilList
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // INICIO (Solo para Representante)

  
  {
    component: CNavItem,
    name: 'INICIO',
    to: '/inicio',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    roles: ['representante']
  },

  // DASHBOARD (Solo para admin)
  {
    component: CNavItem,
    name: 'DASHBOARD',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    roles: ['admin']
  },

  {
    component: CNavTitle,
    name: 'MÓDULOS',
    roles: ['admin', 'docente']
  },

  // GESTIÓN ACADÉMICA (Solo para Representantes)
  {
    component: CNavGroup,
    name: 'Académico',
    to: '/inicio-notas',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
    roles: ['representante'],
    items: [
      {
        component: CNavItem,
        name: 'Notas',
        to: '/inicio-notas',
        roles: ['representante']
      },
      {
        component: CNavItem,
        name: 'Boletines',
        to: '/inicio-boletines',
        roles: ['representante']
      },
      {
        component: CNavItem,
        name: 'Horarios',
        to: '/inicio-horarios',
        roles: ['representante']
      },
      {
        component: CNavItem,
        name: 'Inscripciones',
        to: '/inscripcion',
        roles: ['representante']
      }
    ],
  },
  

  // GESTIÓN DE ESTUDIANTES (Solo admin)
  {
    component: CNavGroup,
    name: 'Estudiantes',
    to: '/students',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    roles: ['admin'],
    items: [
      {
        component: CNavItem,
        name: 'Lista de Estudiantes',
        to: '/students',
        roles: ['admin']
      }
    ],
  },

  // REPRESENTANTES (Solo admin)
  {
    component: CNavItem,
    name: 'REPRESENTANTES',
    to: '/representantes',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    roles: ['admin']
  },

  // INSCRIPCIONES (Solo admin)
  {
    component: CNavGroup,
    name: 'Inscripciones',
    to: '/inscripcion',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    roles: ['admin'],
    items: [
      {
        component: CNavItem,
        name: 'Gestión de Inscripciones',
        to: '/inscripcion',
        roles: ['admin']
      },
      {
        component: CNavItem,
        name: 'profile',
        to: '/perfil',
        roles: ['admin']
      }

    ],
  },

  // NOTAS (Solo docentes y admin)
  {
    component: CNavGroup,
    name: 'Calificaciones',
    to: '/notas',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    roles: ['admin'],
    items: [
      {
        component: CNavItem,
        name: 'Gestión de Notas',
        to: '/notas',
        roles: ['admin']
      }
    ],
  },

  // BOLETINES (Solo docentes y admin)
  {
    component: CNavGroup,
    name: 'Boletines',
    to: '/boletin',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    roles: ['admin'],
    items: [
      {
        component: CNavItem,
        name: 'Ver Boletines',
        to: '/boletin',
        roles: ['admin']
      }
    ],
  },

  // HORARIOS (Solo docentes y admin)
  {
    component: CNavGroup,
    name: 'Horarios',
    to: '/horario',
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    roles: ['admin'],
    items: [
      {
        component: CNavItem,
        name: 'Ver Horarios',
        to: '/horario',
        roles: ['admin']
      }
    ],
  },

  // AULAS (Solo admin)
  {
    component: CNavGroup,
    name: 'Aulas',
    to: '/aulas',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    roles: ['admin'],
    items: [
      {
        component: CNavItem,
        name: 'Gestión de Aulas',
        to: '/aulas',
        roles: ['admin']
      }
    ],
  },

  // PANEL DOCENTE (Solo docentes)
  {
    component: CNavGroup,
    name: 'Panel Docente',
    to: '/docente/inicio',
    icon: <CIcon icon={cilEducation} customClassName="nav-icon" />,
    roles: ['docente'],
    items: [
      {
        component: CNavItem,
        name: 'Inicio Docente',
        to: '/docente/inicio',
        roles: ['docente']
      },
      {
        component: CNavItem,
        name: 'Mi Horario',
        to: '/docente/horario',
        roles: ['docente']
      },
      {
        component: CNavItem,
        name: 'Mis Estudiantes',
        to: '/docente/estudiantes',
        roles: ['docente']
      }
    ],
  },

    // COMPETENCIAS (Solo admin)
  {
    component: CNavItem,
    name: 'COMPETENCIAS',
    to: '/competencias',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    roles: ['admin']
  },

  {
    component: CNavItem,
    name: 'PREINSCRIPCIÓN',
    to: '/preinscripcion',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    roles: ['admin']
  },
]

// Función para filtrar navegación según rol
export const getFilteredNav = (userRole) => {
  console.log('🔍 getFilteredNav - Rol recibido:', userRole)

  const roleHierarchy = {
    'admin': ['admin'],
    'docente': ['docente'],
    'estudiante': [],
    'representante': ['representante']
  }

  const allowedRoles = roleHierarchy[userRole] || []
  console.log('✅ Roles permitidos para', userRole, ':', allowedRoles)

  if (allowedRoles.length === 0) {
    console.log('🚫 El rol', userRole, 'no tiene acceso al sistema')
    return []
  }

  const filteredNav = _nav.filter(item => {
    if (item.component && (item.component.displayName === 'CNavTitle')) {
      const hasVisibleItemsAfterTitle = _nav.some(navItem => {
        if (!navItem.roles || navItem.roles.length === 0) return false
        return navItem.roles.some(role => allowedRoles.includes(role)) &&
          navItem !== item
      })
      return hasVisibleItemsAfterTitle
    }

    if (!item.roles || item.roles.length === 0) {
      return false
    }

    const hasAccess = item.roles.some(itemRole => allowedRoles.includes(itemRole))

    if (item.component && item.component.displayName === 'CNavGroup') {
      if (item.items) {
        const filteredItems = item.items.filter(child => {
          if (!child.roles || child.roles.length === 0) return false
          return child.roles.some(childRole => allowedRoles.includes(childRole))
        })
        return hasAccess && filteredItems.length > 0
      }
      return hasAccess
    }

    return hasAccess
  }).map(item => {
    if (item.items) {
      return {
        ...item,
        items: item.items.filter(child => {
          if (!child.roles || child.roles.length === 0) return false
          return child.roles.some(childRole => allowedRoles.includes(childRole))
        })
      }
    }
    return item
  })

  console.log('📋 Navegación filtrada final:', filteredNav.map(item => item.name))
  return filteredNav
}

export default _nav