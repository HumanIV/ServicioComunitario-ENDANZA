import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const NavigationFilter = ({ children, userRole }) => {
  const [filteredNav, setFilteredNav] = useState([])

  useEffect(() => {
    const filterNavigationByRole = (navItems, role) => {
      return navItems.filter(item => {
        // Si el item no tiene restricción de rol, mostrarlo a todos
        if (!item.roles) return true
        
        // Si tiene restricción, verificar si el rol del usuario está incluido
        return item.roles.includes(role)
      })
    }

    if (userRole) {
      const filtered = filterNavigationByRole(children, userRole)
      setFilteredNav(filtered)
    }
  }, [children, userRole])

  return filteredNav
}

NavigationFilter.propTypes = {
  children: PropTypes.array.isRequired,
  userRole: PropTypes.string
}

export default NavigationFilter