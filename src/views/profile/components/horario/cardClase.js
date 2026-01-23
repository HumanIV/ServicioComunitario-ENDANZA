// components/CardClase.js
import React from 'react'
import { CCard, CCardBody, CBadge } from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilBook, cilUser, cilLocationPin } from "@coreui/icons"

const CardClase = ({ clase, colorDia, indice }) => {
  return (
    <div className="timeline-item mb-4">
      <div className="d-flex">
        <div className="timeline-time me-4 text-center">
          <div className="bg-primary text-white rounded p-2">
            <strong>{clase.hora.split(' - ')[0]}</strong>
            <div className="small">a</div>
            <strong>{clase.hora.split(' - ')[1]}</strong>
          </div>
        </div>
        <div className="timeline-content flex-grow-1 border-start ps-4 position-relative">
          <div className="position-absolute top-0 start-0 translate-middle">
            <div className={`bg-${colorDia} rounded-circle`} style={{ width: '12px', height: '12px' }}></div>
          </div>
          <div className="border rounded p-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="mb-0 text-primary">
                <CIcon icon={cilBook} className="me-2" />
                {clase.materia}
              </h6>
              <CBadge color="secondary">{clase.aula}</CBadge>
            </div>
            <div className="row">
              <div className="col-md-6">
                <p className="mb-1">
                  <CIcon icon={cilUser} className="me-2" />
                  <strong>Profesor:</strong> {clase.profesor}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-0">
                  <CIcon icon={cilLocationPin} className="me-2" />
                  <strong>Aula:</strong> {clase.aula}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardClase