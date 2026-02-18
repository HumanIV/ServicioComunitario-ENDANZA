import React from 'react'
import { CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar } from '@coreui/icons'
import ClassGroupCard from './ClassGroupCard'

const ClassGroupsList = ({ sections, selectedTeacher, onSeeStudents, currentUserId }) => {
    if (sections.length === 0) {
        return (
            <CCol xs={12}>
                <div className="text-center py-5 bg-light-custom bg-opacity-10 rounded-4 shadow-sm border border-dashed border-light-custom">
                    <CIcon icon={cilCalendar} size="4xl" className="text-muted-custom opacity-25 mb-3" />
                    <h5 className="header-title-custom">No tienes clases asignadas actualmente</h5>
                    <p className="text-muted-custom">Contacta con el administrador para verificar tu carga horaria.</p>
                </div>
            </CCol>
        )
    }

    return (
        <CRow className="g-4">
            {sections.map((section) => (
                <ClassGroupCard
                    key={section.id}
                    section={section}
                    selectedTeacher={selectedTeacher}
                    onSeeStudents={onSeeStudents}
                    currentUserId={currentUserId}
                />
            ))}
        </CRow>
    )
}

export default ClassGroupsList
