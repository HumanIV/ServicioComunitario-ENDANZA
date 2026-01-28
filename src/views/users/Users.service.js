const KEY = 'endanzo_users_v1'

const initialUsers = [
    {
        id: 1,
        dni: "V-11222333",
        first_name: "Admin",
        last_name: "Principal",
        password: "admin",
        phone: "0414-1112233",
        email: "admin@endanza.com",
        role: "superadmin",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        dni: "V-22333444",
        first_name: "Lucía",
        last_name: "Méndez",
        password: "admin",
        phone: "0414-4445566",
        email: "lucia.mendez@endanza.com",
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 3,
        dni: "V-33444555",
        first_name: "Carlos",
        last_name: "Pérez",
        password: "docente",
        phone: "0424-7778899",
        email: "carlos.perez@endanza.com",
        role: "docente",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 4,
        dni: "V-44555666",
        first_name: "María",
        last_name: "Rodríguez",
        password: "padre",
        phone: "0412-3334455",
        email: "maria.rod@email.com",
        role: "representante",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

function load() {
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) {
            save(initialUsers)
            return initialUsers
        }
        const parsed = JSON.parse(raw)
        return parsed && parsed.length > 0 ? parsed : initialUsers
    } catch (e) {
        console.error('Error loading users:', e)
        return initialUsers
    }
}

function save(items) {
    try {
        localStorage.setItem(KEY, JSON.stringify(items))
    } catch (e) {
        console.warn('Error saving users:', e)
    }
}

function nextId(items) {
    const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0)
    return maxId + 1
}

export async function listUsers() {
    const data = load()
    return Promise.resolve(data)
}

export async function getUser(id) {
    const items = load()
    return Promise.resolve(items.find(u => u.id === id) || null)
}

export async function createUser(payload) {
    const items = load()
    const id = nextId(items)

    const user = {
        id,
        dni: payload.dni || '',
        first_name: payload.first_name || '',
        last_name: payload.last_name || '',
        password: payload.password || '',
        phone: payload.phone || '',
        email: payload.email || '',
        role: payload.role || 'representante',
        status: payload.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    items.push(user)
    save(items)
    return Promise.resolve(user)
}

export async function updateUser(id, payload) {
    const items = load()
    const idx = items.findIndex(u => u.id === id)
    if (idx === -1) return Promise.reject(new Error('User not found'))

    items[idx] = {
        ...items[idx],
        ...payload,
        updatedAt: new Date().toISOString()
    }
    save(items)
    return Promise.resolve(items[idx])
}

export async function deleteUser(id) {
    const items = load()
    const filtered = items.filter(u => u.id !== id)
    save(filtered)
    return Promise.resolve({ success: true })
}

export async function changeUserStatus(id, newStatus) {
    const items = load()
    const idx = items.findIndex(u => u.id === id)
    if (idx === -1) return Promise.reject(new Error('User not found'))

    items[idx] = {
        ...items[idx],
        status: newStatus.toLowerCase(),
        updatedAt: new Date().toISOString()
    }
    save(items)
    return Promise.resolve(items[idx])
}

export async function changeUserRole(id, newRole) {
    const items = load()
    const idx = items.findIndex(u => u.id === id)
    if (idx === -1) return Promise.reject(new Error('User not found'))

    items[idx] = {
        ...items[idx],
        role: newRole.toLowerCase(),
        updatedAt: new Date().toISOString()
    }
    save(items)
    return Promise.resolve(items[idx])
}
