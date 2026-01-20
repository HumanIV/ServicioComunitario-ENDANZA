const KEY = 'mock_classrooms_v1'

const initialClassrooms = [
    { id: 1, name: 'Salón Rosado', type: 'Con Espejos', capacity: 20 },
    { id: 2, name: 'Salón Azul', type: 'Con Espejos', capacity: 20 },
    { id: 3, name: 'Salón Violeta', type: 'Con Espejos', capacity: 15 },
    { id: 4, name: 'Salón Amarillo', type: 'Salón de Teoría', capacity: 25 },
    { id: 5, name: 'Salón Blanco', type: 'Con Espejos', capacity: 20 },
    { id: 6, name: 'Salón Gris', type: 'Con Espejos', capacity: 15 },
    { id: 7, name: 'Salón de Colores 1', type: 'Área Infantil', capacity: 12 },
    { id: 8, name: 'Salón de Colores 2', type: 'Área Infantil', capacity: 12 },
    { id: 9, name: 'Salón Verde', type: 'Con Espejos', capacity: 18 },
    { id: 10, name: 'Patio', type: 'Área Abierta', capacity: 50 },
    { id: 11, name: 'Tarima', type: 'Con Tarima', capacity: 30 },
    { id: 12, name: 'Placa I', type: 'Cancha/Abierto', capacity: 40 },
    { id: 13, name: 'Placa II', type: 'Cancha/Abierto', capacity: 40 },
    { id: 14, name: 'Placa III', type: 'Cancha/Abierto', capacity: 40 },
    { id: 15, name: 'Salón Nutrición', type: 'Salón de Teoría', capacity: 15 }
]

export const CLASSROOM_TYPES = [
    'Con Espejos',
    'Área Abierta',
    'Con Tarima',
    'Salón de Teoría',
    'Cancha/Abierto',
    'Área Infantil'
]

function load() {
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) {
            save(initialClassrooms)
            return initialClassrooms
        }
        return JSON.parse(raw)
    } catch (e) {
        return initialClassrooms
    }
}

function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items))
}

export async function listClassrooms() {
    return Promise.resolve(load())
}

export async function updateClassroom(id, payload) {
    const items = load()
    const idx = items.findIndex(i => i.id === id)
    if (idx !== -1) {
        items[idx] = { ...items[idx], ...payload }
        save(items)
        return Promise.resolve(items[idx])
    }
    return Promise.reject(new Error('Aula no encontrada'))
}
