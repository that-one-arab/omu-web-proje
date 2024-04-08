import React, { useEffect, useState } from 'react';
import { CCard, CCol, CRow } from '@coreui/react';
import './patient.css';
import PatientHeader from './PatientHeader';
import PatientContent from './PatientContent';
import { fetchPatient, parseTreatments } from '../../helpers';
import { useParams } from 'react-router';

import HocLoader from '../../components/hocloader/HocLoader';

const PATIENT_DISEASES_TEMPLATE = {};

const PATIENT_TREATMENT_TEMPLATE = {
    treatmentID: '',
    treatmentName: '',
    treatmentCost: '',
};

const PATIENT_APPOINTMENT_TEMPLATE = {
    appointmentID: '',
    appointmentHour: '',
    appointmentDate: '',
    appointmentCreationDate: '',
};

const PATIENT_INFO_TEMPLATE = {
    patientID: '',
    fullName: '',
    birthDate: '',
    gender: '',
    identityNo: '',
    phoneNo: '',
    translator: '',
    recordDate: '',
    address: '',
    doctor: '',
    extraDetails: '',
};

const PATIENT_TEMPLATE = {
    info: PATIENT_INFO_TEMPLATE,
    appointments: [PATIENT_APPOINTMENT_TEMPLATE],
    treatments: [PATIENT_TREATMENT_TEMPLATE],
    diseases: [PATIENT_DISEASES_TEMPLATE],
};

const Patient = () => {
    const { patientID } = useParams();

    const [clickedTab, setClickedTab] = useState('INFO');
    const [clickedTabIndex, setClickedTabIndex] = useState(0);
    const [patient, setPatient] = useState(PATIENT_TEMPLATE);

    const [loading, setLoading] = useState(false);

    /** Used to trigger a rerender, mainly use it to refetch data or something*/
    const [renderCount, setRenderCount] = useState(1);

    const editable = false;

    useEffect(() => {
        const runFetchPatient = async () => {
            setLoading(true);
            const patientData = await fetchPatient(patientID);
            if (!patientData) {
                /** Return an object template that contains properties with empty falsy values (empty strings, 0 numbers etc) */
                setPatient(PATIENT_TEMPLATE);
            } else {
                patientData.treatments = parseTreatments(
                    patientData.treatments
                );

                setPatient(patientData);
            }
            setLoading(false);
        };
        runFetchPatient();
    }, [patientID, renderCount]);

    return (
        <HocLoader absolute isLoading={loading}>
            <CRow className='justify-content-center align-items-center'>
                <CCol xs='12' sm='8'>
                    <CCard>
                        <PatientHeader
                            setClickedTab={setClickedTab}
                            setClickedTabIndex={setClickedTabIndex}
                            clickedTabIndex={clickedTabIndex}
                        />
                        <br />
                        <PatientContent
                            clickedTab={clickedTab}
                            editable={editable}
                            patient={patient}
                            setLoading={setLoading}
                            setRenderCount={setRenderCount}
                        />
                    </CCard>
                </CCol>
            </CRow>
        </HocLoader>
    );
};

export default Patient;
