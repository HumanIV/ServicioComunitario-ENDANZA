const KEY = 'mock_nutrition_v1'
const YEARS_KEY = 'mock_years_v2' // Reuse same key from schedules for consistency

const initialRecords = [
    {
        id: 1,
        studentId: 1,
        studentName: "María González",
        academicYear: "2025-2026",
        weight: 45.5,
        height: 1.55,
        imc: 18.9,
        status: "Normopeso",
        lastCheckup: "2025-09-15",
        observations: "Mantiene un peso saludable. Recomendado seguir con dieta balanceada."
    },
    {
        id: 2,
        studentId: 2,
        studentName: "Carlos Pérez",
        academicYear: "2025-2026",
        weight: 38.0,
        height: 1.50,
        imc: 16.9,
        status: "Déficit Nutricional",
        lastCheckup: "2025-09-18",
        observations: "Ligeramente por debajo del peso ideal. Se recomienda aumentar ingesta de proteínas."
    },
    {
        id: 3,
        studentId: 3,
        studentName: "Lucía Ramírez",
        academicYear: "2025-2026",
        weight: 58.0,
        height: 1.52,
        imc: 25.1,
        status: "Sobrepeso",
        lastCheckup: "2025-09-20",
        observations: "Ligeramente por encima del peso ideal para su estatura y edad."
    }
]

function load() {
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) {
            save(initialRecords)
            return initialRecords
        }
        return JSON.parse(raw)
    } catch (e) {
        console.error('Error loading nutrition records:', e)
        return initialRecords
    }
}

function save(items) {
    try {
        localStorage.setItem(KEY, JSON.stringify(items))
    } catch (e) {
        console.warn('Error saving nutrition records:', e)
    }
}

export const NUTRITIONAL_STATUS = [
    { value: 'Déficit Nutricional', label: 'Déficit Nutricional', color: 'warning' },
    { value: 'Normopeso', label: 'Normopeso', color: 'success' },
    { value: 'Sobrepeso', label: 'Sobrepeso', color: 'danger' }
]

export async function listNutritionRecords(filters = {}) {
    let data = load()

    if (filters.academicYear) {
        data = data.filter(r => r.academicYear === filters.academicYear)
    }

    if (filters.status) {
        data = data.filter(r => r.status === filters.status)
    }

    if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase()
        data = data.filter(r => r.studentName.toLowerCase().includes(search))
    }

    return Promise.resolve(data)
}

export async function createNutritionRecord(payload) {
    const items = load()
    const id = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1

    const record = {
        id,
        ...payload,
        createdAt: new Date().toISOString()
    }

    items.unshift(record)
    save(items)
    return Promise.resolve(record)
}

export async function updateNutritionRecord(id, payload) {
    const items = load()
    const idx = items.findIndex(i => i.id === id)
    if (idx === -1) return Promise.reject(new Error('Record not found'))

    items[idx] = { ...items[idx], ...payload, updatedAt: new Date().toISOString() }
    save(items)
    return Promise.resolve(items[idx])
}

export async function deleteNutritionRecord(id) {
    const items = load()
    const filtered = items.filter(i => i.id !== id)
    save(filtered)
    return Promise.resolve({ success: true })
}

export async function getNutritionYears() {
    // We can reuse the years from schedules or get them from records
    const records = load()
    const recordYears = records.map(r => r.academicYear).filter(Boolean)

    let storedYears = []
    try {
        const raw = localStorage.getItem(YEARS_KEY)
        storedYears = raw ? JSON.parse(raw) : []
    } catch (e) { }

    const uniqueYears = [...new Set([...recordYears, ...storedYears, "2025-2026"])]
    uniqueYears.sort().reverse()
    return Promise.resolve(uniqueYears)
}
