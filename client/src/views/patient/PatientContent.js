import React from 'react';
import {
    PatientAppointments,
    PatientDiseases,
    PatientInfo,
    PatientTreatments,
} from './tabs';

export default function PatientContent({
    clickedTab,
    patient,
    setLoading,
    setRenderCount,
}) {
    const { info, diseases, appointments, treatments } = patient;

    const renderSelectedTab = () => {
        switch (clickedTab) {
            case 'INFO':
                return (
                    <PatientInfo
                        info={info}
                        patientID={info.patientID}
                        setLoading={setLoading}
                        setRenderCount={setRenderCount}
                    />
                );
            case 'TREATMENT':
                return (
                    <PatientTreatments
                        patientID={info.patientID}
                        patientTreatments={treatments}
                        setLoading={setLoading}
                        setRenderCount={setRenderCount}
                    />
                );
            case 'DISEASES':
                return (
                    <PatientDiseases
                        patientDiseases={diseases}
                        patientID={info.patientID}
                        setLoading={setLoading}
                        setRenderCount={setRenderCount}
                    />
                );
            case 'APPOINTMENT':
                return (
                    <PatientAppointments
                        appointments={appointments}
                        patientID={info.patientID}
                        setLoading={setLoading}
                        setRenderCount={setRenderCount}
                    />
                );
            default:
                return <PatientInfo />;
        }
    };

    return (
        <div className='merchants-details-detailed-content-wrapper'>
            {renderSelectedTab()}
        </div>
    );
}
