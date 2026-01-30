import React, { useEffect, useState } from 'react'
import {
    CCard, CCardBody, CCardHeader, CContainer, CRow, CCol,
    CButton, CTable, CTableHead, CTableRow, CTableHeaderCell,
    CTableBody, CTableDataCell, CBadge, CSpinner, CDropdown,
    CDropdownToggle, CDropdownMenu, CDropdownItem,
    CToaster, CToast, CToastHeader, CToastBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPlus, cilPencil, cilTrash, cilUser, cilShieldAlt,
    cilPeople, cilInfo, cilSearch, cilCheckCircle, cilWarning
} from '@coreui/icons'

import UserForm from './UserForm'
import InfoUser from './InfoUser'
import * as UserService from './Users.service'
import AvatarLetter from 'src/components/AvatarLetter'
import SearchInput from 'src/components/SearchInput'
import Pagination from 'src/components/Pagination'
import SystemMessageModal from 'src/components/SystemMessageModal'

const Users = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [editing, setEditing] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [toasts, setToasts] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(8)
    const [searchTerm, setSearchTerm] = useState('')

    const [deleteModal, setDeleteModal] = useState({
        visible: false,
        userId: null,
        userName: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        try {
            const res = await UserService.listUsers()
            setData(res || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const showToast = (message, color = 'success') => {
        setToasts(prev => [...prev, { id: Date.now(), message, color }])
    }

    const filteredUsers = data.filter(user => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return (
            user.first_name?.toLowerCase().includes(searchLower) ||
            user.last_name?.toLowerCase().includes(searchLower) ||
            user.dni?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower)
        )
    })

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const currentPageData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    async function handleSave(payload) {
        try {
            if (editing) {
                await UserService.updateUser(editing.id, payload)
                showToast('Usuario actualizado correctamente')
            } else {
                await UserService.createUser(payload)
                showToast('Usuario registrado exitosamente')
            }
            setShowForm(false)
            setEditing(null)
            fetchData()
        } catch (error) {
            showToast('Error al procesar la solicitud', 'danger')
        }
    }

    async function handleDelete() {
        try {
            await UserService.deleteUser(deleteModal.userId)
            showToast('Usuario eliminado del sistema', 'warning')
            setDeleteModal({ visible: false, userId: null, userName: '' })
            fetchData()
        } catch (error) {
            showToast('Error al eliminar usuario', 'danger')
        }
    }

    async function handleStatusUpdate(id, status) {
        try {
            await UserService.changeUserStatus(id, status)
            showToast(`Estado cambiado a ${status}`)
            fetchData()
        } catch (error) {
            showToast('Error al cambiar estado', 'danger')
        }
    }

    async function handleRoleUpdate(id, role) {
        try {
            await UserService.changeUserRole(id, role)
            showToast(`Rol cambiado a ${role}`)
            fetchData()
        } catch (error) {
            showToast('Error al cambiar rol', 'danger')
        }
    }

    const getRoleBadge = (role) => {
        const r = role?.toLowerCase()
        const config = {
            'superadmin': { color: 'danger', icon: cilShieldAlt, text: 'SUPERADMIN' },
            'admin': { color: 'warning', icon: cilShieldAlt, text: 'ADMIN' },
            'docente': { color: 'info', icon: cilPeople, text: 'DOCENTE' },
            'representante': { color: 'primary', icon: cilUser, text: 'REPRESENTANTE' }
        }[r] || { color: 'secondary', icon: cilUser, text: role }

        return (
            <CBadge color={config.color} className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill">
                <CIcon icon={config.icon} size="sm" />
                {config.text}
            </CBadge>
        )
    }

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase()
        const config = {
            'active': { color: 'success', text: 'Activo' },
            'suspended': { color: 'warning', text: 'Suspendido' },
            'inactive': { color: 'secondary', text: 'Inactivo' }
        }[s] || { color: 'secondary', text: status }
        return <CBadge color={config.color} shape="rounded-pill" className="px-2 py-1">{config.text.toUpperCase()}</CBadge>
    }

    return (
        <CContainer fluid className="mt-4 pb-5">
            <CCard className="shadow-lg border-0 mb-4 premium-card" style={{ borderRadius: '20px' }}>
                <div className="bg-primary" style={{ height: '8px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}></div>
                <CCardHeader className="bg-light-custom border-0 pt-4 px-4" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h3 className="fw-bold header-title-custom mb-1">
                                <CIcon icon={cilPeople} className="me-2 text-primary" size="lg" />
                                Gestión de Usuarios
                            </h3>
                            <p className="text-muted-custom mb-0 small fw-medium">Control de accesos y administración del personal</p>
                        </div>
                        <CButton
                            className="btn-premium px-4 d-flex align-items-center shadow-sm"
                            onClick={() => { setEditing(null); setShowForm(true); }}
                        >
                            <CIcon icon={cilPlus} className="me-2 fw-bold" />
                            NUEVO USUARIO
                        </CButton>
                    </div>
                </CCardHeader>
                <CCardBody className="p-4 bg-light-custom">
                    <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 bg-light-custom bg-opacity-10 p-3 rounded-4 border border-light-custom border-opacity-10 shadow-sm">
                        <div className="small fw-bold text-muted-custom text-uppercase ls-1">
                            Total Registros: <span className="text-primary">{filteredUsers.length}</span>
                        </div>
                        <div style={{ maxWidth: '400px', width: '100%' }}>
                            <SearchInput
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                placeholder="Buscar por nombre, cédula o email..."
                                className="bg-transparent border border-light-custom border-opacity-25 text-contrast placeholder-opacity-50"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <CSpinner color="primary" variant="grow" />
                            <div className="mt-3 text-muted fw-medium">Cargando base de datos segura...</div>
                        </div>
                    ) : currentPageData.length > 0 ? (
                        <>
                            <div className="table-responsive rounded-4 border border-light-custom overflow-hidden shadow-sm">
                                <CTable align="middle" hover className="mb-0 border-0 custom-premium-table">
                                    <CTableHead className="bg-light-custom bg-opacity-25 border-bottom border-light-custom border-opacity-10">
                                        <CTableRow>
                                            <CTableHeaderCell className="border-0 bg-transparent py-3 text-muted-custom small fw-bold ls-1 ps-4">PERFIL</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 bg-transparent py-3 text-muted-custom small fw-bold ls-1">CONTACTO</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 bg-transparent py-3 text-muted-custom small fw-bold ls-1">ROL</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 bg-transparent py-3 text-muted-custom small fw-bold ls-1">ESTADO</CTableHeaderCell>
                                            <CTableHeaderCell className="border-0 bg-transparent py-3 text-muted-custom small fw-bold ls-1 text-end pe-4">ACCIONES</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {currentPageData.map(user => (
                                            <CTableRow key={user.id} className="border-bottom-light hover-row">
                                                <CTableDataCell className="ps-4 border-0">
                                                    <div className="d-flex align-items-center py-2">
                                                        <AvatarLetter name={user.first_name} lastName={user.last_name} size="md" />
                                                        <div className="ms-3">
                                                            <div className="fw-bold header-title-custom">{user.first_name} {user.last_name}</div>
                                                            <div className="small text-muted-custom font-monospace">{user.dni}</div>
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className="border-0">
                                                    <div className="small">
                                                        <div className="fw-medium header-title-custom">{user.email}</div>
                                                        <div className="text-muted-custom">{user.phone || 'S/T'}</div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {getRoleBadge(user.role)}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {getStatusBadge(user.status)}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <CButton size="sm" variant="ghost" color="info" className="btn-icon-premium hover-scale" onClick={() => { setSelectedUser(user); setShowInfo(true); }}>
                                                            <CIcon icon={cilInfo} />
                                                        </CButton>
                                                        <CDropdown variant="btn-group">
                                                            <CDropdownToggle size="sm" variant="ghost" color="primary" className="btn-icon-premium hover-scale border-0" split={false}>
                                                                <CIcon icon={cilPencil} />
                                                            </CDropdownToggle>
                                                            <CDropdownMenu className="shadow-xl border-0 rounded-4 mt-2 py-2 animate-fade-in dropdown-menu-premium-scroll bg-dark-soft">
                                                                <CDropdownItem onClick={() => { setEditing(user); setShowForm(true); }} className="py-2 px-3 dropdown-item-premium text-light-custom">
                                                                    Editar Datos
                                                                </CDropdownItem>
                                                                <CDropdownItem divider className="bg-light-custom bg-opacity-10 my-1" />
                                                                <CDropdownItem header className="text-muted-custom small text-uppercase fw-bold ls-1">Cambiar Rol</CDropdownItem>
                                                                {['superadmin', 'admin', 'docente', 'representante'].filter(r => r !== user.role).map(r => (
                                                                    <CDropdownItem key={r} onClick={() => handleRoleUpdate(user.id, r)} className="py-2 px-3 dropdown-item-premium text-light-custom">
                                                                        Habilitar {r}
                                                                    </CDropdownItem>
                                                                ))}
                                                                <CDropdownItem divider className="bg-light-custom bg-opacity-10 my-1" />
                                                                <CDropdownItem header className="text-muted-custom small text-uppercase fw-bold ls-1">Cambiar Estado</CDropdownItem>
                                                                {['active', 'inactive', 'suspended'].filter(s => s !== user.status).map(s => (
                                                                    <CDropdownItem key={s} onClick={() => handleStatusUpdate(user.id, s)} className="py-2 px-3 dropdown-item-premium text-light-custom">
                                                                        Pasar a {s}
                                                                    </CDropdownItem>
                                                                ))}
                                                            </CDropdownMenu>
                                                        </CDropdown>
                                                        <CButton size="sm" variant="ghost" color="danger" className="btn-icon-premium hover-scale"
                                                            disabled={user.role === 'superadmin'}
                                                            onClick={() => setDeleteModal({ visible: true, userId: user.id, userName: `${user.first_name} ${user.last_name}` })}
                                                        >
                                                            <CIcon icon={cilTrash} />
                                                        </CButton>
                                                    </div>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </div>
                            {totalPages > 1 && (
                                <div className="mt-4 d-flex justify-content-center">
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-5 border rounded-4 border-dashed bg-light">
                            <CIcon icon={cilSearch} size="3xl" className="text-muted opacity-25 mb-3" />
                            <h5 className="text-muted">No se encontraron usuarios</h5>
                            <CButton color="link" onClick={() => setSearchTerm('')}>Limpiar búsqueda</CButton>
                        </div>
                    )}
                </CCardBody>
            </CCard>

            <UserForm visible={showForm} onClose={() => setShowForm(false)} onSave={handleSave} initial={editing} />
            <InfoUser visible={showInfo} onClose={() => setShowInfo(false)} user={selectedUser} />

            <SystemMessageModal
                visible={deleteModal.visible}
                onClose={() => setDeleteModal({ visible: false, userId: null, userName: '' })}
                onConfirm={handleDelete}
                variant="confirm"
                type="error"
                title="Eliminar Usuario"
                message={`¿Está seguro de eliminar a "${deleteModal.userName}"? Esta acción revocará todo acceso al sistema.`}
                confirmText="ELIMINAR AHORA"
            />

            <CToaster placement="top-end">
                {toasts.map(t => (
                    <CToast key={t.id} autohide={true} visible={true} color={t.color} className="text-white shadow">
                        <CToastHeader closeButton className="bg-transparent border-0 text-white">
                            <CIcon icon={cilCheckCircle} className="me-2" />
                            <strong className="me-auto">Sistema ENDANZA</strong>
                        </CToastHeader>
                        <CToastBody className="pt-0">{t.message}</CToastBody>
                    </CToast>
                ))}
            </CToaster>
        </CContainer>
    )
}

export default Users
