import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    CCardBody,
    CCol,
    CFormGroup,
    CLabel,
    CInput,
    CTextarea,
    CButton,
    CInputRadio,
    CCardHeader,
    CCard,
    CCardFooter,
    CSelect,
} from '@coreui/react';
import HocLoader from '../../components/hocloader/HocLoader';
import { ResponseModal } from '../../components/modal/custom';
import { useSelector } from 'react-redux';

const AddNewPatientForm = ({
    doctors,
    translators,
    setFullName,
    setBirthDate,
    setGender,
    setIdentityNo,
    setPhoneNo,
    setTranslator,
    setRecordDate,
    setAddress,
    setDoctor,
    setExtraDetails,
}) => {
    const editable = true;

    const fullNameHandler = (e) => setFullName(e.target.value);
    const birthDateHandler = (e) => setBirthDate(e.target.value);
    const genderHandler = (e) => setGender(e.target.value);
    const identityNoHandler = (e) => setIdentityNo(e.target.value);
    const phoneNoHandler = (e) => setPhoneNo(e.target.value);
    const translatorHandler = (e) => setTranslator(e.target.value);
    const recordDateHandler = (e) => setRecordDate(e.target.value);
    const addressHandler = (e) => setAddress(e.target.value);
    const doctorHandler = (e) => setDoctor(e.target.value);
    const extraDetailsHandler = (e) => setExtraDetails(e.target.value);

    return (
        <div>
            <>
                <CFormGroup row className='my-0'>
                    <CCol xs='12' lg='7'>
                        <CFormGroup>
                            <CLabel>* İsim Soyisim</CLabel>
                            <CInput
                                placeholder='isim soyisim giriniz'
                                readOnly={!editable}
                                onChange={fullNameHandler}
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='3'>
                        <CFormGroup>
                            <CLabel>* Doğum Tarihi</CLabel>
                            <CInput
                                type='date'
                                placeholder='dd-mm-yyyy'
                                readOnly={!editable}
                                onChange={birthDateHandler}
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='2'>
                        <CFormGroup>
                            <CCol>
                                <CLabel>* Cinsiyet</CLabel>
                            </CCol>
                            <CCol>
                                <CFormGroup variant='checkbox'>
                                    <div>
                                        <CInputRadio
                                            className='form-check-input'
                                            id='radio1'
                                            name='radios'
                                            value='male'
                                            disabled={!editable}
                                            onChange={genderHandler}
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
                                            value='female'
                                            disabled={!editable}
                                            onChange={genderHandler}
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
                            <CLabel>* Kimlik No</CLabel>
                            <CInput
                                placeholder='12345678911'
                                readOnly={!editable}
                                onChange={identityNoHandler}
                                type='number'
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='3'>
                        <CFormGroup>
                            <CLabel>* GSM</CLabel>
                            <CInput
                                placeholder='5524999505'
                                readOnly={!editable}
                                onChange={phoneNoHandler}
                                type='number'
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='2'>
                        <CFormGroup>
                            <CLabel>Tercüman</CLabel>
                            <CSelect onChange={translatorHandler}>
                                <option value={null}>Yok</option>
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
                            <CLabel>* Kayıt Tarihi</CLabel>
                            <CInput
                                placeholder={
                                    // Current date
                                    new Date().toISOString().split('T')[0]
                                }
                                type='date'
                                max={new Date().toISOString().split('T')[0]}
                                readOnly={!editable}
                                onChange={recordDateHandler}
                            />
                        </CFormGroup>
                    </CCol>
                </CFormGroup>
                <CFormGroup row className='my-0'>
                    <CCol xs='12' lg='8'>
                        <CFormGroup>
                            <CLabel>Adres</CLabel>
                            <CInput
                                placeholder='Reşadiye mah çaykara sok no 1 kat 1 daire 1'
                                readOnly={!editable}
                                onChange={addressHandler}
                            />
                        </CFormGroup>
                    </CCol>
                    <CCol xs='12' lg='4'>
                        <CFormGroup>
                            <CLabel>* Doktor</CLabel>
                            <CSelect onChange={doctorHandler}>
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
                        </CFormGroup>
                    </CCol>
                </CFormGroup>
                <CFormGroup>
                    <CLabel>Ekstra Detaylar</CLabel>
                    <CTextarea
                        rows='4'
                        placeholder='İsteğe göre ekstra detaylarınızı yazın'
                        readOnly={!editable}
                        onChange={extraDetailsHandler}
                    />
                </CFormGroup>
            </>
        </div>
    );
};

export default function AddNewPatient() {
    const translators = useSelector((state) => state.reducer.translators);
    const doctors = useSelector((state) => state.reducer.doctors);

    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState(0);
    const [identityNo, setIdentityNo] = useState(0);
    const [phoneNo, setPhoneNo] = useState(0);
    const [translator, setTranslator] = useState('');
    const [recordDate, setRecordDate] = useState('');
    const [address, setAddress] = useState('');
    const [doctor, setDoctor] = useState('');
    const [extraDetails, setExtraDetails] = useState('');

    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState({
        show: false,
        body: '',
        header: '',
        status: '',
    });

    const MODAL_SERVER_ERROR = {
        show: true,
        body: 'Hasta eklerken bir hata olmuştur, lütfen daha sonra tekrar deneyin',
        status: 'failure',
    };

    const MODAL_INPUT_ERROR = {
        show: true,
        body: 'Lütfen gerekli kısımlarını doldurun ve gerekli kısımların doğru olduğundan emin olun',
        status: 'failure',
    };

    const MODAL_DUPLICATE_IDENTITY_NO_ERROR = {
        show: true,
        body: 'Bu hastanın kimlik numarası mevcuttur, lütfen tüm mevcut hasta kayıtlarını kontrol ediniz',
        status: 'failure',
    };

    const history = useHistory();

    const submitNewPatientHandler = async () => {
        setLoading(true);
        const res = await fetch('/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${document.cookie} `,
            },
            body: JSON.stringify({
                fullName,
                birthDate,
                gender,
                identityNo,
                phoneNo,
                translatorID: translator,
                recordDate,
                address,
                doctorID: doctor,
                extraDetails,
            }),
        });
        setLoading(false);
        if (res.status === 201) {
            const data = await res.json();
            const { patientID } = data;
            history.push(`/patients/${patientID}`);
        } else if (res.status === 406) {
            setModal(MODAL_INPUT_ERROR);
        } else if (res.status === 405) {
            setModal(MODAL_DUPLICATE_IDENTITY_NO_ERROR);
        } else {
            setModal(MODAL_SERVER_ERROR);
        }
    };

    return (
        <div>
            <HocLoader absolute isLoading={loading}>
                <ResponseModal modal={modal} setModal={setModal} />
                <CCard>
                    <CCardHeader>
                        Yeni hasta
                        <small> ekle</small>
                    </CCardHeader>
                    <CCardBody className='basvuru-detay'>
                        <AddNewPatientForm
                            doctors={doctors}
                            translators={translators}
                            setFullName={setFullName}
                            setBirthDate={setBirthDate}
                            setGender={setGender}
                            setIdentityNo={setIdentityNo}
                            setPhoneNo={setPhoneNo}
                            setTranslator={setTranslator}
                            setRecordDate={setRecordDate}
                            setAddress={setAddress}
                            setDoctor={setDoctor}
                            setExtraDetails={setExtraDetails}
                        />
                    </CCardBody>
                    <CCardFooter
                        style={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                        }}
                    >
                        <CButton
                            size='md'
                            color='success'
                            onClick={submitNewPatientHandler}
                        >
                            <i className='fas fa-check-circle'></i> ONAYLA
                        </CButton>
                    </CCardFooter>
                </CCard>
            </HocLoader>
        </div>
    );
}
