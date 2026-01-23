// hooks/useToast.js
import { useCallback } from 'react';

export const useToast = (dispatch) => {
  const showToast = useCallback((type, message) => {
    const id = Date.now();
    dispatch({ 
      type: 'AGREGAR_TOAST', 
      payload: { 
        type, 
        message 
      } 
    });
    
    // Remover automáticamente después de 4 segundos
    setTimeout(() => {
      dispatch({ 
        type: 'REMOVER_TOAST', 
        payload: id 
      });
    }, 4000);
  }, [dispatch]);
  
  return { showToast };
};