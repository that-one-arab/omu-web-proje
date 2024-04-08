import { useState, useEffect } from 'react';

import './style.css';

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
    CTextarea,
    CSelect,
} from '@coreui/react';
import { treatmentData } from '../../../data';
import { ResponseModal } from '.';

const parseCurrencyNameToSymbol = (name) => {
    switch (name) {
        case 'lira':
            return 'TL';
        case 'dollar':
            return '$';
        case 'euro':
            return '€';
        default:
            break;
    }
};

const teethNumbers = [
    0, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32,
    33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55,
    61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 81, 82, 83, 84, 85,
];

export function EditTreatmentModal({
    show,
    setShow,
    patientID,
    setRenderCount,
    setLoading,
    initialTreatmentData,
}) {
    const { treatmentID } = initialTreatmentData;

    const [treatmentName, setTreatmentName] = useState('');
    const [treatmentPrice, setTreatmentPrice] = useState(0);
    const [treatmentPriceCurrency, setTreatmentPriceCurrency] = useState('');
    const [treatmentTeethNo, setTreatmentTeethNo] = useState(0);
    const [treatmentDate, setTreatmentDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [treatmentDescription, setTreatmentDescription] = useState('');

    const [responseModal, setResponseModal] = useState({
        show: false,
        body: '',
        header: '',
        status: '',
        reopenTreatmentsModal: false,
    });

    const setSelectedTreatmentHandler = (e) => {
        const selectedTreatment = treatmentData.find(
            (treatment) => treatment.name === e.target.value
        );

        if (selectedTreatment) {
            const selectedTreatmentPrice =
                selectedTreatment.price +
                parseCurrencyNameToSymbol(selectedTreatment.currency);

            setTreatmentPrice(selectedTreatmentPrice);
        } else {
            setTreatmentPrice(0);
        }
        setTreatmentName(e.target.value);
    };

    const setTreatmentTeethNoHandler = (e) =>
        setTreatmentTeethNo(Number(e.target.value));

    const setTreatmentPriceHandler = (e) => {
        setTreatmentPrice(e.target.value);
    };

    const setTreatmentDateHandler = (e) => setTreatmentDate(e.target.value);

    const setTreatmentDescriptionHandler = (e) =>
        setTreatmentDescription(e.target.value);

    const submitForm = async () => {
        setLoading(true);
        const res = await fetch(
            `/api/patients/${patientID}/treatments/${treatmentID}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
                body: JSON.stringify({
                    treatmentName,
                    treatmentPrice: treatmentPrice.match(/\d/g).join(''),
                    treatmentTeethNo,
                    treatmentDescription,
                    treatmentDate,
                    treatmentPriceCurrency,
                }),
            }
        );
        if (res.status === 200) {
            setShow(false);
            setResponseModal({
                show: true,
                body: 'Tedavi başarıyla güncellenmiştir',
                status: 'success',
                reopenTreatmentsModal: false,
            });
            setRenderCount((prevVal) => prevVal + 1);
        } else if (res.status === 400) {
            setShow(false);
            setResponseModal({
                show: true,
                body: 'Lütfen girdiğiniz bilgilerin doğru olduğundan emin olun',
                status: 'failure',
                reopenTreatmentsModal: true,
            });
        } else {
            setShow(false);
            setResponseModal({
                show: true,
                body: 'İşlem sırasında bir hata olmuştur, lütfen daha sonra tekrar deneyin',
                status: 'failure',
                reopenTreatmentsModal: false,
            });
        }
        setLoading(false);
    };

    const deleteTreatment = async () => {
        setLoading(true);
        const res = await fetch(
            `/api/patients/${patientID}/treatments/${treatmentID}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            }
        );
        if (res.status === 200) {
            setShow(false);
            setResponseModal({
                show: true,
                body: 'Tedavi başarıyla silinmiştir',
                status: 'success',
                reopenTreatmentsModal: false,
            });
            setRenderCount((prevVal) => prevVal + 1);
        } else {
            setShow(false);
            setResponseModal({
                show: true,
                body: 'İşlem sırasında bir hata olmuştur, lütfen daha sonra tekrar deneyin',
                status: 'failure',
                reopenTreatmentsModal: false,
            });
        }
        setLoading(false);
    };

    const onResponseModalClose = () => {
        setResponseModal({ ...responseModal, show: false });
        if (responseModal.reopenTreatmentsModal) setShow(true);
    };

    useEffect(() => {
        setTreatmentName(initialTreatmentData.treatmentName);
        setTreatmentPrice(initialTreatmentData.treatmentPrice);
        setTreatmentDescription(initialTreatmentData.treatmentDescription);
        setTreatmentTeethNo(initialTreatmentData.teethNum);
        setTreatmentPriceCurrency(initialTreatmentData.treatmentPriceCurrency);
        setTreatmentDate(
            initialTreatmentData.recordDate
                ? initialTreatmentData.recordDate.split('T')[0]
                : new Date().toISOString().split('T')[0]
        );
    }, [initialTreatmentData]);

    return (
        <>
            <ResponseModal
                modal={responseModal}
                setModal={setResponseModal}
                onClose={onResponseModalClose}
            />
            <CModal
                show={show}
                onClose={() => setShow(!show)}
                color={'primary'}
                centered
                size='lg'
            >
                <CModalHeader closeButton>
                    <CModalTitle> Tedaviyi düzelt </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormGroup row>
                        <CCol>
                            <CFormGroup row>
                                <CCol md='3'>
                                    <CLabel htmlFor='select'>
                                        Yapılan Tedavi
                                    </CLabel>
                                </CCol>
                                <CCol xs='12' md='9'>
                                    <CSelect
                                        value={treatmentName}
                                        onChange={setSelectedTreatmentHandler}
                                    >
                                        {treatmentData.map((treatment) => (
                                            <option key={treatment.id}>
                                                {treatment.name}
                                            </option>
                                        ))}
                                    </CSelect>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md='3'>
                                    <CLabel htmlFor='select'>Diş No</CLabel>
                                </CCol>
                                <CCol xs='12' md='9'>
                                    <CSelect
                                        onChange={setTreatmentTeethNoHandler}
                                        value={treatmentTeethNo}
                                    >
                                        {teethNumbers.map((no, i) => (
                                            <option key={i}>{no}</option>
                                        ))}
                                    </CSelect>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md='3'>
                                    <CLabel htmlFor='text-input'>
                                        Tedavi Ücreti
                                    </CLabel>
                                </CCol>
                                <CCol xs='12' md='9'>
                                    <CInput
                                        id='text-input'
                                        name='text-input'
                                        placeholder='0.00'
                                        value={treatmentPrice}
                                        onChange={setTreatmentPriceHandler}
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md='3'>
                                    <CLabel htmlFor='date-input'>
                                        Tedavi tarihi
                                    </CLabel>
                                </CCol>
                                <CCol xs='12' md='9'>
                                    <CInput
                                        type='date'
                                        id='date-input'
                                        name='date-input'
                                        placeholder='date'
                                        value={treatmentDate}
                                        onChange={setTreatmentDateHandler}
                                    />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md='3'>
                                    <CLabel htmlFor='extra-details'>
                                        Ekstra Açıklama
                                    </CLabel>
                                </CCol>
                                <CCol xs='12' md='9'>
                                    <CTextarea
                                        value={treatmentDescription}
                                        onChange={
                                            setTreatmentDescriptionHandler
                                        }
                                        placeholder='açıklamanız...'
                                        id='extra-details'
                                    />
                                </CCol>
                            </CFormGroup>
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
                            onClick={deleteTreatment}
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
                        <CButton color='success' onClick={submitForm}>
                            Onayla
                        </CButton>
                    </div>
                </CModalFooter>
            </CModal>
        </>
    );
}
