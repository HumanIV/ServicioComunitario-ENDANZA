import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  // Agrega logs para depurar
  console.log('🎯 AppSidebarNav - Items recibidos:', items)
  console.log('🔢 Cantidad de items:', items?.length || 0)
  
  if (!items || items.length === 0) {
    console.log('⚠️ AppSidebarNav - No hay items para mostrar')
    return (
      <CSidebarNav>
        <div className="text-center p-4 text-muted">
          <small>No hay módulos disponibles para tu rol</small>
        </div>
      </CSidebarNav>
    )
  }

  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    
    console.log(`📌 Renderizando item: ${name}`, item)
    
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    
    console.log(`📦 Renderizando grupo: ${name}`, item)
    
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items.map((item, index) => {
        console.log(`📋 Procesando item ${index}:`, item.name, item.component?.displayName)
        return item.items ? navGroup(item, index) : navItem(item, index)
      })}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}