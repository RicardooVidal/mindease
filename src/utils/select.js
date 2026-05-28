export const loadPatients = async (api, patients) => {
    try {
        const res = await api.get(`/api/patient/select/get?active=1`)
        patients.value = res.data.data || []
    } catch (e) {
        console.error(e)
    }
}