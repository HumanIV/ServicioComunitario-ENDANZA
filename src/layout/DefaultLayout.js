// src/layout/DefaultLayout.js
import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { getFilteredNav } from '../_nav'
import useUserRole from '../Hooks/useUserRole'
import { CSpinner } from '@coreui/react'

const DefaultLayout = () => {
  const { 
    userRole, 
    userData, 
    isLoading, 
    error, 
    refreshUserData,
    isSuperadministrador,
    isAdministrador,
    isDocente,
    isRepresentante
  } = useUserRole()
  
  const [filteredNavigation, setFilteredNavigation] = useState([])
  
  // Filtrar navegación cuando cambia el rol
  useEffect(() => {
    if (userRole) {
      console.log('🎯 DefaultLayout - Filtrando navegación para rol:', userRole)
      const filteredNav = getFilteredNav(userRole)
      console.log('📋 DefaultLayout - Navegación filtrada:', filteredNav)
      setFilteredNavigation(filteredNav)
    }
  }, [userRole])
  
  // Mostrar errores
  useEffect(() => {
    if (error) {
      console.error('❌ DefaultLayout - Error:', error)
      // Podrías mostrar un toast o alerta aquí
    }
  }, [error])
  
  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <CSpinner color="primary" variant="grow" size="lg" />
        <p className="mt-3 text-muted">Cargando permisos de usuario...</p>
      </div>
    )
  }
  
  // Si hay error pero tenemos datos de cache, mostrar igual con advertencia
  if (error && !userData) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Error de conexión</h4>
          <p>No se pudo verificar los permisos con el servidor.</p>
          <hr />
          <p className="mb-0">Por favor, verifica tu conexión a internet.</p>
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Pasa la navegación filtrada al AppSidebar */}
      <AppSidebar navigation={filteredNavigation} />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader 
          onRoleRefresh={refreshUserData} 
          userData={userData}
        />
        <div className="body flex-grow-1">
          {/* Pasa información del usuario al AppContent */}
          <AppContent 
            userRole={userRole}
            userId={userData?.id}
            isSuperadministrador={isSuperadministrador}
            isAdministrador={isAdministrador}
            isDocente={isDocente}
            isRepresentante={isRepresentante}
          />
          
          {/* Indicador de modo desarrollo (opcional) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="position-fixed bottom-0 end-0 m-3">
              <div className="badge bg-info">
                Rol: {userRole} | ID: {userData?.Id_rol}
              </div>
            </div>
          )}
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout