import { useEffect, useState } from 'react';

import {
    CCol,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormGroup,
    CLabel,
    CInput,
    CFormText,
    CSelect,
} from '@coreui/react';
import { ResponseModal } from '.';
import HocLoader from '../../hocloader/HocLoader';

const MODAL_INPUT_ERROR = {
    show: true,
    header: 'BİLGİ GİRİŞ HATASI',
    body: 'Lütfen girdiğiniz bilgilerin doğru olduğundan emin olun',
    status: 'failure',
    reopenAppointmentsModal: true,
};

const MODAL_SERVER_ERROR = {
    show: true,
    header: 'SUNUCU HATASI',
    body: 'Lütfen daha sonra tekrar deneyin',
    status: 'failure',
    reopenAppointmentsModal: false,
};

export function EditAppointmentModal({
    show,
    setShow,
    patientID,
    setLoading,
    setRenderCount,
    initialAppointmentData,
}) {
    /** Default value is current date */
    const [appointmentDate, setAppointmentDate] = useState(
        initialAppointmentData && initialAppointmentData.appointmentDate
    );
    const [appointmentHour, setAppointmentHour] = useState(
        initialAppointmentData && initialAppointmentData.appointmentHour
    );
    const [appointmentID, setAppointmentID] = useState(
        initialAppointmentData && initialAppointmentData.appointmentID
    );

    useEffect(() => {
        setAppointmentDate(initialAppointmentData.appointmentDate);
        setAppointmentHour(initialAppointmentData.appointmentHour);
        setAppointmentID(initialAppointmentData.appointmentID);
    }, [initialAppointmentData]);

    const [availableHours, setAvailableHours] = useState(undefined);
    const [availableHoursLoading, setAvailableHoursLoading] = useState(true);

    const setAppointmentDateHandler = (e) => setAppointmentDate(e.target.value);
    const setAppointmentHourHandler = (e) => setAppointmentHour(e.target.value);

    const [submitDisabled, setSubmitDisabled] = useState(true);

    const [responseModal, setResponseModal] = useState({
        show: false,
        body: '',
        header: '',
        status: '',
        reopenAppointmentsModal: false,
    });

    const closeResponseModal = () => {
        setResponseModal({ ...responseModal, show: false });
        if (responseModal.reopenAppointmentsModal) setShow(true);
    };

    const submitAppointment = async () => {
        setLoading(true);
        const res = await fetch(
            `/api/appointments?patientID=${patientID}&appointmentID=${appointmentID}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
                body: JSON.stringify({
                    appointmentDate,
                    appointmentHour,
                }),
            }
        );

        if (res.status === 200) {
            setRenderCount((prevCount) => prevCount + 1);
            setShow(false);
        } else if (res.status === 406) {
            setShow(false);
            setResponseModal(MODAL_INPUT_ERROR);
        } else {
            setShow(false);
            setResponseModal(MODAL_SERVER_ERROR);
        }
        setLoading(false);
    };

    const deleteAppointment = async () => {
        setLoading(true);
        const res = await fetch(
            `/api/appointments?patientID=${patientID}&appointmentID=${appointmentID}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            }
        );

        if (res.status === 200) {
            setRenderCount((prevCount) => prevCount + 1);
            setShow(false);
        } else if (res.status === 406) {
            setShow(false);
            setResponseModal(MODAL_INPUT_ERROR);
        } else {
            setShow(false);
            setResponseModal(MODAL_SERVER_ERROR);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (appointmentHour !== 0 && appointmentDate !== '')
            setSubmitDisabled(false);
        else setSubmitDisabled(true);
    }, [appointmentHour, appointmentDate]);

    useEffect(() => {
        const fetchAvailableAppointmentHours = async () => {
            setAvailableHoursLoading(true);
            const res = await fetch(
                `/api/appointments/available/${appointmentDate}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${document.cookie} `,
                    },
                }
            );
            if (res.status === 200) {
                const data = await res.json();

                setAvailableHours(data.hours);
            }
            setAvailableHoursLoading(false);
        };

        fetchAvailableAppointmentHours();

        return () => {
            setAvailableHoursLoading(false);
            setAvailableHours(undefined);
        };
    }, [appointmentDate]);

    return (
        <>
            <ResponseModal
                modal={responseModal}
                setModal={setResponseModal}
                onClose={closeResponseModal}
            />
            <CModal
                show={show}
                onClose={() => setShow(!show)}
                color={'success'}
                centered
                size='lg'
            >
                <HocLoader relative isLoading={availableHoursLoading}>
                    <CModalHeader closeButton>
                        <CModalTitle> Randevuyu Düzelt </CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CFormGroup row>
                            <CCol md='3'>
                                <CLabel htmlFor='select'>Randevu saatı</CLabel>
                            </CCol>
                            <CCol xs='12' md='9'>
                                <CSelect
                                    onChange={setAppointmentHourHandler}
                                    value={appointmentHour}
                                >
                                    {availableHours &&
                                        availableHours.map((time, i) => (
                                            <option key={i}>{time}</option>
                                        ))}
                                </CSelect>
                                <CFormText>Hastanın randevu saatı</CFormText>
                            </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                            <CCol md='3'>
                                <CLabel htmlFor='date-input'>
                                    Randevu tarihi
                                </CLabel>
                            </CCol>
                            <CCol xs='12' md='9'>
                                <CInput
                                    onChange={setAppointmentDateHandler}
                                    defaultValue={
                                        new Date().toISOString().split('T')[0]
                                    }
                                    type='date'
                                    id='date-input'
                                    name='date-input'
                                    placeholder='date'
                                />
                            </CCol>
                        </CFormGroup>
                    </CModalBody>
                    <CModalFooter
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <CButton
                                color='danger'
                                variant='ghost'
                                onClick={deleteAppointment}
                            >
                                Sil
                            </CButton>
                        </div>
                        <div>
                            <CButton
                                color='secondary'
                                variant='outline'
                                onClick={() => setShow(!show)}
                            >
                                Kapat
                            </CButton>
                            <CButton
                                color='success'
                                disabled={submitDisabled}
                                onClick={submitAppointment}
                            >
                                Düzelt
                            </CButton>
                        </div>
                    </CModalFooter>
                </HocLoader>
            </CModal>
        </>
    );
}
