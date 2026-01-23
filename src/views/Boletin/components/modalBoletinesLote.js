// ModalBoletinesLote.jsx
import React, { useMemo } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CAlert,
  CBadge,
  CSpinner
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilFile, cilWarning, cilCheckCircle } from "@coreui/icons";

export const ModalBoletinesLote = ({ 
  visible, 
  enviando, 
  gradoSeleccionado, 
  estudiantesSeleccionados,
  estudiantesUnicos,
  calculos,
  dispatch,
  onGenerarBoletinesLote 
}) => {
  const estudiantesLista = useMemo(() => {
    // Crear mapa de estudiantes para acceso rápido
    const estudianteMap = {};
    estudiantesUnicos.forEach(est => {
      estudianteMap[est.id] = est;
    });

    return Array.from(estudiantesSeleccionados).map(id => ({
      id,
      estudiante: estudianteMap[id],
      promedio: calculos.calcularPromedioEstudiante(id)
    }));
  }, [estudiantesSeleccionados, estudiantesUnicos, calculos]);

  return (
    <CModal visible={visible} onClose={() => !enviando && dispatch({ type: 'OCULTAR_MODAL' })}>
      <CModalHeader closeButton={!enviando}>
        <div className="d-flex align-items-center">
          <CIcon icon={cilFile} className="me-2 text-primary" />
          <h5 className="mb-0">Generar Boletines en Lote</h5>
        </div>
      </CModalHeader>
      <CModalBody>
        {enviando ? (
          <div className="text-center py-4">
            <CSpinner color="primary" className="mb-3" />
            <h5>Generando boletines...</h5>
            <p className="text-muted">Por favor espere</p>
          </div>
        ) : (
          <>
            <CAlert color="info">
              <strong>Confirmar generación de boletines</strong>
              <p className="mb-0 mt-2">
                Se generarán boletines para <strong>{estudiantesSeleccionados.size} estudiantes</strong> del {gradoSeleccionado?.grado}.
              </p>
            </CAlert>
            
            <h6 className="mt-3">Estudiantes seleccionados:</h6>
            <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {estudiantesLista.map(({ id, estudiante, promedio }, index) => (
                <div key={id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                  <div>
                    <small><strong>{index + 1}.</strong> {estudiante?.nombre || 'Estudiante no encontrado'}</small>
                    <div>
                      <small className="text-muted">{estudiante?.codigo}</small>
                    </div>
                  </div>
                  <div>
                    {promedio ? (
                      <CBadge color={calculos.getColorNota(promedio)}>
                        {promedio}
                      </CBadge>
                    ) : (
                      <CBadge color="secondary">Sin notas</CBadge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <CAlert color="warning" className="mt-3">
              <small>
                <CIcon icon={cilWarning} className="me-1" />
                Los boletines se generarán en formato PDF y estarán disponibles para descarga.
              </small>
            </CAlert>
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          onClick={() => dispatch({ type: 'OCULTAR_MODAL' })}
          disabled={enviando}
        >
          Cancelar
        </CButton>
        <CButton
          color="success"
          onClick={onGenerarBoletinesLote}
          disabled={enviando}
        >
          {enviando ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Generando...
            </>
          ) : (
            <>
              <CIcon icon={cilCheckCircle} className="me-1" />
              Generar Boletines
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};