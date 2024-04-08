import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    CCol,
    CSelect,
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
    CInputCheckbox,
} from '@coreui/react';

export default function AppointmentModal({ show, modalData, setModalData }) {
    const [isNewPatient, setIsNewPatient] = useState(false);

    const doctors = useSelector((state) => state.reducer.doctors);

    return (
        <CModal
            show={show}
            onClose={() => setModalData(undefined)}
            color={'success'}
            centered
            size='lg'
        >
            <CModalHeader closeButton>
                <CModalTitle> Yeni Randevu </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormGroup row>
                    <CCol md='3'>
                        <CLabel htmlFor='select'>İsim Soyisim</CLabel>
                    </CCol>
                    <CCol xs='12' md='6'>
                        {isNewPatient ? (
                            <CInput
                            // onChange={setAppointmentDateHandler}
                            // defaultValue={
                            //     new Date().toISOString().split('T')[0]
                            // }
                            // type='date'
                            // id='date-input'
                            // name='date-input'
                            // placeholder='date'
                            />
                        ) : (
                            <div
                                style={{
                                    display: 'inline-flex',
                                    width: '100%',
                                }}
                            >
                                <CInput
                                    list='patients'
                                    // onChange={setAppointmentDateHandler}
                                    // defaultValue={
                                    //     new Date().toISOString().split('T')[0]
                                    // }
                                    // type='date'
                                    // id='date-input'
                                    // name='date-input'
                                    // placeholder='date'
                                />
                                <CButton color='success'>Ara</CButton>
                                <datalist id='patients'>
                                    <option value='patient' />
                                    <option value='patient' />
                                    <option value='patient' />
                                    <option value='patient' />
                                </datalist>
                                {/* <Select options={options} /> */}
                            </div>
                        )}

                        <CFormText>
                            {isNewPatient
                                ? 'Yeni hasta isim soyisim'
                                : 'Hasta ismini ara'}
                        </CFormText>
                    </CCol>
                    <CCol md='3'>
                        <CFormGroup variant='custom-checkbox' inline>
                            <CInputCheckbox
                                style={{ zIndex: '2' }}
                                checked={isNewPatient}
                                custom
                                onChange={() =>
                                    isNewPatient
                                        ? setIsNewPatient(false)
                                        : setIsNewPatient(true)
                                }
                            />
                            <CLabel variant='custom-checkbox'>
                                Yeni hasta mı?
                            </CLabel>
                        </CFormGroup>
                    </CCol>
                </CFormGroup>

                {isNewPatient && (
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='select'>Telefon no</CLabel>
                        </CCol>
                        <CCol md='9'>
                            <CInput />
                        </CCol>
                    </CFormGroup>
                )}
                <CFormGroup row>
                    <CCol md='3'>
                        <CLabel htmlFor='select'>Randevu saatı</CLabel>
                    </CCol>
                    <CCol xs='12' md='9'>
                        <CSelect
                        // onChange={setAppointmentHourHandler}
                        // value={appointmentHour}
                        >
                            {/* {availableHours &&
                                availableHours.map((time, i) => (
                                    <option key={i}>{time}</option>
                                ))} */}
                        </CSelect>
                        <CFormText>Hastanın randevu saatı</CFormText>
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md='3'>
                        <CLabel htmlFor='date-input'>Randevu tarihi</CLabel>
                    </CCol>
                    <CCol xs='12' md='9'>
                        <CInput
                            // Does nothing so far
                            onChange={() => 0}
                            value={
                                modalData
                                    ? modalData.appointmentDate
                                    : new Date().toISOString().split('T')[0]
                            }
                            type='date'
                            id='date-input'
                            name='date-input'
                            placeholder='date'
                        />
                    </CCol>
                </CFormGroup>
                <CFormGroup row>
                    <CCol md='3'>
                        <CLabel htmlFor='select'>Doktor</CLabel>
                    </CCol>
                    <CCol md='9'>
                        <CSelect
                        // onChange={doctorHandler}
                        >
                            <option>Doktor seçiniz</option>
                            {doctors.length &&
                                doctors.map((doc) => (
                                    <option
                                        key={doc.doctorID}
                                        value={doc.doctorID}
                                    >
                                        {doc.doctorName}
                                    </option>
                                ))}
                        </CSelect>
                    </CCol>
                </CFormGroup>
            </CModalBody>
            <CModalFooter>
                <CButton
                    color='secondary'
                    variant='outline'
                    // onClick={() => setShow(!show)}
                >
                    Kapat
                </CButton>
                <CButton
                    color='success'
                    // disabled={submitDisabled}
                    // onClick={submitAppointment}
                >
                    Onayla
                </CButton>
            </CModalFooter>
        </CModal>
    );
}
