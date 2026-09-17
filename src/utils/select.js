export const loadPatients = async (api, patients) => {
    try {
        const res = await api.get(`/api/patient/select/get?active=1`)
        patients.value = res.data.data || []
    } catch (e) {
        console.error(e)
    }
}

export const loadTypes = () => {
    return [
        {value: 'daily', label: 'Diário'},
        {value: 'weekly', label: 'Semanal'},
        {value: 'bi-weekly', label: 'Quinzenal'},
        {value: 'monthly', label: 'Mensal'},
    ]
}

export const loadTimes = () => {
    return [
        {value: '20', label: '20 Minutos'},
        {value: '30', label: '30 Minutos'},
        {value: '40', label: '40 Minutos'},
        {value: '50', label: '50 Minutos'},
        {value: '60', label: '60 Minutos'},
    ]
}