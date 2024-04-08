import React, { useState, useEffect } from 'react';
import {
    CCardBody,
    CCol,
    CFormGroup,
    CLabel,
    CButton,
    CInputCheckbox,
    CInputRadio,
    CTextarea,
} from '@coreui/react';
import { ResponseModal } from '../../../components/modal/custom';

const RadioForm = ({ label, id, value, setValue }) => {
    return (
        <CCardBody>
            <CFormGroup row className='my-0'>
                <CCol md='9'>
                    <CLabel>{label}</CLabel>
                </CCol>
                <CCol md='3'>
                    <CFormGroup variant='custom-radio' inline>
                        <CInputRadio
                            custom
                            id={`inline-radio${id}-true`}
                            name={`inline-radios-${id}`}
                            value={1}
                            checked={value === 1 && true}
                            onChange={(e) => setValue(e.target.value, id)}
                        />
                        <CLabel
                            variant='custom-checkbox'
                            htmlFor={`inline-radio${id}-true`}
                        >
                            Evet
                        </CLabel>
                    </CFormGroup>
                    <CFormGroup variant='custom-radio' inline>
                        <CInputRadio
                            custom
                            id={`inline-radio${id}-false`}
                            name={`inline-radios-${id}`}
                            checked={value === 0 && true}
                            onChange={(e) => setValue(e.target.value, id)}
                            value={0}
                        />
                        <CLabel
                            variant='custom-checkbox'
                            htmlFor={`inline-radio${id}-false`}
                        >
                            Hayır
                        </CLabel>
                    </CFormGroup>
                </CCol>
            </CFormGroup>
            <hr />
        </CCardBody>
    );
};

const CheckboxForm = ({ label, checkboxes, values, setValue }) => {
    console.info({values})
    return (
        <>
            <CCardBody>
                <CFormGroup row className='my-0'>
                    <CCol md='6'>
                        <CLabel>{label}</CLabel>
                    </CCol>
                    <CCol md='6'>
                        {checkboxes.map((checkbox, i) => {
                            return (
                                <CFormGroup
                                    style={{ marginBottom: '20px' }}
                                    variant='custom-checkbox'
                                    inline
                                    key={`symptom-id-${i}`}
                                >
                                    <CInputCheckbox
                                        checked={
                                            values[i].value &&
                                            values[i].value === 1
                                                ? true
                                                : false
                                        }
                                        custom
                                        id={`symptom-${i}`}
                                        name='inline-checkbox1'
                                        value={1}
                                        onChange={() => setValue(values[i].key)}
                                    />
                                    <CLabel
                                        variant='custom-checkbox'
                                        htmlFor={`symptom-${i}`}
                                    >
                                        {checkbox}
                                    </CLabel>
                                </CFormGroup>
                            );
                        })}
                    </CCol>
                </CFormGroup>
                <hr />
            </CCardBody>
        </>
    );
};

const TextForm = ({ label, value, setValue }) => {
    return (
        <CCardBody>
            <CFormGroup>
                <CLabel>{label}</CLabel>
                <CTextarea
                    rows='2'
                    placeholder='...'
                    value={value}
                    onChange={setValue}
                />
            </CFormGroup>
            <hr />
        </CCardBody>
    );
};

const checkboxes = ['HEPATİT A', 'HEPATİT B', 'HEPATİT C', 'AİDS'];

export default function PatientDiseases({
    patientDiseases,
    patientID,
    setLoading,
    setRenderCount,
}) {
    const [diseases, setDiseases] = useState(undefined);
    const [modal, setModal] = useState({ show: false, body: '' });

    useEffect(() => {
        setDiseases(patientDiseases);
    }, [patientDiseases]);

    console.info({diseases})

    const setRadioDiseasesHandler = (value, radioID) => {
        const diseasesCopy = { ...diseases };
        for (const key in diseasesCopy) {
            if (Object.hasOwnProperty.call(diseasesCopy, key)) {
                if (radioID === key) {
                    setDiseases({
                        ...diseasesCopy,
                        [key]: Number(value),
                    });
                }
            }
        }
    };

    const setCheckboxesDiseasesHandler = (checkboxID) => {
        const checkboxesListCopy = [...diseases.l1];
        console.log({checkboxID, checkboxesListCopy});

        const index = checkboxesListCopy.findIndex(
            (checkbox) => checkbox.key === checkboxID
        );
        console.log({index});

        const currentCheckboxValue = checkboxesListCopy[index].value;
        console.log({currentCheckboxValue});

        checkboxesListCopy[index].value = currentCheckboxValue === 1 ? 0 : 1;

        setDiseases({
            ...diseases,
            l1: checkboxesListCopy,
        });
    };

    const setText1Handler = (e) =>
        setDiseases({
            ...diseases,
            text1: e.target.value,
        });
    const setText2Handler = (e) =>
        setDiseases({
            ...diseases,
            text2: e.target.value,
        });
    const setText3Handler = (e) =>
        setDiseases({
            ...diseases,
            text3: e.target.value,
        });
    const setText4Handler = (e) =>
        setDiseases({
            ...diseases,
            text4: e.target.value,
        });

    const submitForm = async () => {
        setLoading(true);
        const res = await fetch(`/api/patients/${patientID}/diseases`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${document.cookie} `,
            },
            body: JSON.stringify(diseases),
        });
        if (res.status === 200) {
            setRenderCount((prevCount) => prevCount + 1);
            setModal({
                show: true,
                body: 'Hastalıklar değişikleriniz başarıyla tamamlanmıştır',
                status: 'success',
            });
        } else {
            setModal({
                show: true,
                body: 'Bir hata olmuştur, lütfen daha sonra tekrar deneyin',
                status: 'failure',
            });
        }
        setLoading(false);
    };

    return (
        <>
            <ResponseModal modal={modal} setModal={setModal} />
            {diseases && (
                <>
                    <RadioForm
                        label={'Daha önce Covid-19 aşısı oldunuz mu'}
                        id='b1'
                        value={diseases && diseases.b1}
                        setValue={setRadioDiseasesHandler}
                    />
                    <RadioForm
                        label={
                            'Yakın zamanda ateş, öksürük, nefes darlığınız var mı?'
                        }
                        id='b2'
                        value={diseases && diseases.b2}
                        setValue={setRadioDiseasesHandler}
                    />
                    <RadioForm
                        label={
                            'Son 6 ay içerisinde Covid-19 teşhisi konuldu mu'
                        }
                        id='b3'
                        value={diseases && diseases.b3}
                        setValue={setRadioDiseasesHandler}
                    />
                    <CheckboxForm
                        checkboxes={checkboxes}
                        label={'Bu hastalıkların hangisine sahipsiniz'}
                        values={diseases && diseases.l1}
                        setValue={setCheckboxesDiseasesHandler}
                    />
                    <RadioForm
                        label={'Taşıyıcı mısınız?'}
                        id='b4'
                        value={diseases && diseases.b4}
                        setValue={setRadioDiseasesHandler}
                    />
                    <TextForm
                        label={
                            'Hastanın hastalık hikayesi ve kullanmakta olduğu ilaçlar'
                        }
                        value={diseases && diseases.text1}
                        setValue={setText1Handler}
                    />
                    <TextForm
                        label={'Şikayet/başvuru nedeni'}
                        value={diseases && diseases.text2}
                        setValue={setText2Handler}
                    />
                    <TextForm
                        label={'Alerjisi olduğu ilaçlar ve maddeler'}
                        value={diseases && diseases.text3}
                        setValue={setText3Handler}
                    />
                    <TextForm
                        label={'Daha önce uygulanan tedavi ve ameliyatlar'}
                        value={diseases && diseases.text4}
                        setValue={setText4Handler}
                    />
                    <CFormGroup row className='basvuru-detay-submit-buttons'>
                        <CCol lg='4'>
                            <div id='basvuruDetay-footerButtons'>
                                <CButton
                                    size='md'
                                    color='success'
                                    onClick={submitForm}
                                >
                                    Onayla
                                </CButton>
                            </div>
                        </CCol>
                    </CFormGroup>
                </>
            )}
        </>
    );
}
