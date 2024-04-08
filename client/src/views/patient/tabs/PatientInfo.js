import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    CCardBody,
    CCol,
    CFormGroup,
    CLabel,
    CInput,
    CTextarea,
    CButton,
    CInputRadio,
    CSelect,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CModalBody,
} from '@coreui/react';
import { ResponseModal } from '../../../components/modal/custom';
import { useHistory } from 'react-router-dom';

/**
 * @prop {function} onClose a custom callback when modal is closed, overwrites default callback of closing the modal normally
 */
function ConfirmationModal({
    modal,
    setModal,
    patientID,
    setLoading,
    setResponseModal,
}) {
    let closeModal = () => setModal(false);

    const history = useHistory();

    const onDelete = async () => {
        setLoading(true);
        const res = await fetch(`/api/patients/${patientID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${document.cookie} `,
            },
        });

        if (res.status === 200) {
            setLoading(false);
            setModal(false);
            history.goBack();
        } else {
            setModal(false);
            setLoading(false);
            setResponseModal({
                show: true,
                body: 'İşlem sırasında bir hata olmuştur, lütfen daha sonra tekrar deneyin',
                status: 'failure',
            });
        }
    };

    return (
        <CModal
            show={modal}
            onClose={() => closeModal()}
            color='danger'
            centered
        >
            <CModalHeader closeButton>
                <CModalTitle> HASTA SİL </CModalTitle>
            </CModalHeader>
            <CModalBody style={{ textAlign: 'center' }}>
                <h5>Bu hastayı silmek istediğinzden emin mısınız?</h5>
            </CModalBody>
            <CModalFooter>
                <CButton color='danger' variant='ghost' onClick={onDelete}>
                    Eminim
                </CButton>
                <CButton color='secondary' onClick={() => closeModal()}>
                    İptal et
                </CButton>
            </CModalFooter>
        </CModal>
    );
}

export default function PatientInfo({ info, setLoading, setRenderCount }) {
    const translators = useSelector((state) => state.reducer.translators);
    const doctors = useSelector((state) => state.reducer.doctors);

    /** Run this useEffect to ensure that the form fields will be populated (initially they are all empty string) */
    useEffect(() => {
        setAddress(info.address);
        setBirthDate(info.birthDate);
        setDescription(info.description);
        setDoctorID(info.doctorID);
        setFullName(info.fullName);
        setGender(info.gender);
        setIdentityNo(info.identityNo);
        setPhoneNo(info.phoneNo);
        setRecordDate(info.recordDate);
        setTranslatorID(info.translatorID);
    }, [info]);

    const [address, setAddress] = useState(info.address);
    const [birthDate, setBirthDate] = useState(info.birthDate);
    const [description, setDescription] = useState(info.description);
    const [doctorID, setDoctorID] = useState(info.doctorID);
    const [fullName, setFullName] = useState(info.fullName);
    const [gender, setGender] = useState(info.gender);
    const [identityNo, setIdentityNo] = useState(info.identityNo);
    const [phoneNo, setPhoneNo] = useState(info.phoneNo);
    const [recordDate, setRecordDate] = useState(info.recordDate);
    const [translatorID, setTranslatorID] = useState(info.translatorID);

    const [editable, setEditable] = useState(false);

    const [confirmationModal, setConfirmationModal] = useState(false);

    const setAddressHandler = (e) => setAddress(e.target.value);
    const setBirthDateHandler = (e) => setBirthDate(e.target.value);
    const setDescriptionHandler = (e) => setDescription(e.target.value);
    const setDoctorIDHandler = (e) => setDoctorID(e.target.value);
    const setFullNameHandler = (e) => setFullName(e.target.value);
    const setGenderHandler = (e) => setGender(e.target.value);
    const setIdentityNoHandler = (e) => setIdentityNo(e.target.value);
    const setPhoneNoHandler = (e) => setPhoneNo(e.target.value);
    const setRecordDateHandler = (e) => setRecordDate(e.target.value);
    const setTranslatorIDHandler = (e) => setTranslatorID(e.target.value);

    const [modal, setModal] = useState({
        show: false,
        body: '',
        header: '',
        status: '',
    });

    const submitForm = async () => {
        const MODAL_SERVER_ERROR = {
            show: true,
            body: 'Hasta bilgileri güncellerken bir hata olmuştur, lütfen daha sonra tekrar deneyin',
            status: 'failure',
        };

        const MODAL_INPUT_ERROR = {
            show: true,
            body: 'Lütfen gerekli kısımlarını doldurun ve gerekli kısımların doğru olduğundan emin olun',
            status: 'failure',
        };

        const MODAL_SUCCESS = {
            show: true,
            body: 'Hasta bilgileri başarıyla güncellenmiştir',
            status: 'success',
        };

        const { patientID } = info;

        setLoading(true);

        const parseAndFormatFormFields = () => {
            const parsedGender = gender === 'M' ? 'male' : 'female';
            const parsedExtraDetails = description;
            return {
                fullName,
                birthDate,
                gender: parsedGender,
                identityNo,
                phoneNo,
                translatorID,
                recordDate,
                address,
                doctorID,
                extraDetails: parsedExtraDetails,
            };
        };

        const formattedForm = parseAndFormatFormFields();

        const res = await fetch(`/api/patients/${patientID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${document.cookie} `,
            },
            body: JSON.stringify(formattedForm),
        });

        setLoading(false);

        if (res.status === 201) {
            /** Trigger a rerender in parent Patient component to refetch data */
            setRenderCount((prevCount) => prevCount + 1);

            setModal(MODAL_SUCCESS);
        } else if (res.status === 406) {
            setModal(MODAL_INPUT_ERROR);
        } else {
            setModal(MODAL_SERVER_ERROR);
        }
    };

    return (
        <>
            <ResponseModal modal={modal} setModal={setModal} />
            <ConfirmationModal
                modal={confirmationModal}
                setModal={setConfirmationModal}
                setLoading={setLoading}
                patientID={info.patientID}
                setResponseModal={setModal}
            />
            <CCardBody className='basvuru-detay'>
                <CFormGroup row className='my-0'>
                    <CCol xs='12' lg='7'>
                        <CFormGroup>
                            <CLabel>İsim Soyisim</CLabel>
                            <CInput
                                value={fullName}
                                readOnly={!editable}
                                onChange={setFullNameHandler}
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='3'>
                        <CFormGroup>
                            <CLabel>Doğum Tarihi</CLabel>
                            <CInput
                                value={birthDate}
                                readOnly={!editable}
                                onChange={setBirthDateHandler}
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='2'>
                        <CFormGroup>
                            <CCol>
                                <CLabel>Cinsiyet</CLabel>
                            </CCol>
                            <CCol>
                                <CFormGroup variant='checkbox'>
                                    <div>
                                        <CInputRadio
                                            className='form-check-input'
                                            id='radio1'
                                            name='radios'
                                            value='M'
                                            checked={
                                                gender === 'M' ? true : false
                                            }
                                            disabled={!editable}
                                            onChange={setGenderHandler}
                                        />
                                        <CLabel
                                            variant='checkbox'
                                            htmlFor='radio1'
                                        >
                                            Erkek
                                        </CLabel>
                                    </div>
                                    <div>
                                        <CInputRadio
                                            className='form-check-input'
                                            id='radio2'
                                            name='radios'
                                            value='F'
                                            checked={
                                                gender === 'F' ? true : false
                                            }
                                            disabled={!editable}
                                            onChange={setGenderHandler}
                                        />
                                        <CLabel
                                            variant='checkbox'
                                            htmlFor='radio2'
                                        >
                                            Kadın
                                        </CLabel>
                                    </div>
                                </CFormGroup>
                            </CCol>
                        </CFormGroup>
                    </CCol>
                </CFormGroup>
                <CFormGroup row className='my-0'>
                    <CCol xs='12' lg='4'>
                        <CFormGroup>
                            <CLabel>Kimlik No</CLabel>
                            <CInput
                                value={identityNo}
                                readOnly={!editable}
                                onChange={setIdentityNoHandler}
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='3'>
                        <CFormGroup>
                            <CLabel>GSM</CLabel>
                            <CInput
                                value={phoneNo}
                                readOnly={!editable}
                                onChange={setPhoneNoHandler}
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='2'>
                        <CFormGroup>
                            <CLabel>Tercüman</CLabel>
                            <CSelect
                                readOnly={!editable}
                                /** translatorID can be null, that's why it is handled this way */
                                value={translatorID ? translatorID : 'none'}
                                onChange={setTranslatorIDHandler}
                            >
                                <option value='none'>Yok</option>
                                {translators.length &&
                                    translators.map((translator) => (
                                        <option
                                            key={translator.translatorID}
                                            value={translator.translatorID}
                                        >
                                            {translator.translatorName}
                                        </option>
                                    ))}
                            </CSelect>
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='3'>
                        <CFormGroup>
                            <CLabel>Kayıt Tarihi</CLabel>
                            <CInput
                                type='date'
                                max={new Date().toISOString().split('T')[0]}
                                value={recordDate}
                                readOnly={!editable}
                                onChange={setRecordDateHandler}
                            />
                        </CFormGroup>
                    </CCol>
                </CFormGroup>
                <CFormGroup row className='my-0'>
                    <CCol xs='12' lg='8'>
                        <CFormGroup>
                            <CLabel>Adres</CLabel>
                            <CInput
                                value={address}
                                readOnly={!editable}
                                onChange={setAddressHandler}
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='4'>
                        <CFormGroup>
                            <CLabel>Doktor</CLabel>
                            <CSelect
                                readOnly={!editable}
                                value={doctorID}
                                onChange={setDoctorIDHandler}
                            >
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
                        </CFormGroup>
                    </CCol>
                </CFormGroup>
                <CFormGroup>
                    <CLabel>Ekstra Detaylar</CLabel>
                    <CTextarea
                        rows='4'
                        value={description}
                        readOnly={!editable}
                        onChange={setDescriptionHandler}
                    />
                </CFormGroup>
                <CFormGroup row className='basvuru-detay-submit-buttons'>
                    <CCol lg='1'>
                        <CButton
                            color='danger'
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                                setConfirmationModal(true);
                            }}
                        >
                            Hastayı sil
                        </CButton>
                    </CCol>
                    <CCol lg='7'></CCol>
                    <CCol lg='4'>
                        <div id='basvuruDetay-footerButtons'>
                            <CButton
                                size='md'
                                color='secondary'
                                onClick={() => setEditable(!editable)}
                            >
                                Düzelt
                            </CButton>
                            <CButton
                                size='md'
                                color='success'
                                disabled={!editable}
                                onClick={submitForm}
                            >
                                Onayla
                            </CButton>
                        </div>
                    </CCol>
                </CFormGroup>
            </CCardBody>
        </>
    );
}
