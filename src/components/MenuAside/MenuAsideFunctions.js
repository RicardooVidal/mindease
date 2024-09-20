window.addEventListener('mouseup',function(event){
    let active_patients = document.querySelector('.patients-results-active');
    let inactive_patients = document.querySelector('.patients-results-inactive');

    if(event.target != active_patients && event.target.parentNode != active_patients){
        closePatientsResults(active_patients);
    }

    if(event.target != inactive_patients && event.target.parentNode != inactive_patients){
        closePatientsResults(inactive_patients);
    }
});  

const closePatientsResults = (idPatientInput) => {
    idPatientInput.style.display = 'none';
}

const selectPatientActive = (patientId) => {
    selectPatient(patientId, 'active', 'inactive');
}

const selectPatientInactive = (patientId) => {
    selectPatient(patientId, 'inactive', 'active')
}

const selectPatient = (patientId, type, typeToRemove) => {
    const typeInput = document.querySelector(`#${type}-patients`);
    const typeInputToRemove = document.querySelector(`#${typeToRemove}-patients`);
    const patientsResults = document.querySelector(`.patients-results-${type}`);

    typeInput.value = 'Paciente ' + patientId;
    typeInputToRemove.value = '';
    closePatientsResults(patientsResults);
}

const openPatients = (type) => {
    const resultsDiv = document.querySelector(".patients-results-" + type);

    if (type === 'active') {
        document.querySelector(".patients-results-inactive").style.display = 'none';
    } else {
        document.querySelector(".patients-results-active").style.display = 'none';
    }

    if (checkStyleDisplay(resultsDiv)) {
        return;
    }

    resultsDiv.style.display = 'block';
}

const checkStyleDisplay = (item) => {
    if (item.style.display == 'block') {
        item.style.display = 'none';
        return true;
    }

    return false;
}

export {openPatients, selectPatientActive, selectPatientInactive}