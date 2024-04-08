import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import HocLoader from '../../components/hocloader/HocLoader';
import Modal from '../../components/modal/Modal';
import { fetchDoctors, fetchTranslators } from '../../helpers';
import { useDispatch } from 'react-redux';

const falseCredentialsModal = {
    modalOn: true,
    modalHeader: 'Hatalı giriş',
    modalBody: 'Lütfen bilgilerinizi kontrol ederek tekrar deneyin',
    modalColor: 'warning',
};

const serverErrorModal = {
    modalOn: true,
    modalHeader: 'SUNUCU HATASI',
    modalBody: 'Sunucu tarafından bir hata olmuştur, lütfen tekrar deneyin',
    modalColor: 'danger',
};

const Login = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        modalOn: false,
        modalHeader: '',
        modalBody: '',
        modalColor: '',
    });
    const loginHandler = async () => {
        setLoading(true);
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        setLoading(false);
        if (res.status === 200) {
            const token = await res.json();
            document.cookie = token;
            history.push('/');

            const doctorsData = await fetchDoctors();
            dispatch({ type: 'SAVE_DOCTORS_TO_CACHE', payload: doctorsData });
            const translatorsData = await fetchTranslators();
            dispatch({
                type: 'SAVE_TRANSLATORS_TO_CACHE',
                payload: translatorsData,
            });
        } else if (res.status === 401 || res.status === 406) {
            setModal(falseCredentialsModal);
        } else {
            setModal(serverErrorModal);
        }
    };

    const setUsernameHandler = (e) => setUsername(e.target.value);
    const setPasswordHandler = (e) => setPassword(e.target.value);

    const { modalOn, modalHeader, modalBody, modalColor } = modal;

    return (
        <HocLoader absolute isLoading={loading}>
            <Modal
                modalOn={modalOn}
                header={modalHeader}
                body={modalBody}
                color={modalColor}
                setModal={setModal}
            />
            <div className='c-app c-default-layout flex-row align-items-center'>
                <CContainer>
                    <CRow className='justify-content-center'>
                        <CCol md='8'>
                            <CCardGroup>
                                <CCard className='p-4'>
                                    <CCardBody>
                                        <CForm>
                                            <h1>Giriş</h1>
                                            <p className='text-muted'>
                                                Hesabınıza giriş yapın
                                            </p>
                                            <CInputGroup className='mb-3'>
                                                <CInputGroupPrepend>
                                                    <CInputGroupText>
                                                        <CIcon name='cil-user' />
                                                    </CInputGroupText>
                                                </CInputGroupPrepend>
                                                <CInput
                                                    type='text'
                                                    onChange={
                                                        setUsernameHandler
                                                    }
                                                    placeholder='Kullanıcı adı'
                                                    autoComplete='username'
                                                />
                                            </CInputGroup>
                                            <CInputGroup className='mb-4'>
                                                <CInputGroupPrepend>
                                                    <CInputGroupText>
                                                        <CIcon name='cil-lock-locked' />
                                                    </CInputGroupText>
                                                </CInputGroupPrepend>
                                                <CInput
                                                    onChange={
                                                        setPasswordHandler
                                                    }
                                                    type='password'
                                                    placeholder='Şifre'
                                                    autoComplete='current-password'
                                                />
                                            </CInputGroup>
                                            <CRow>
                                                <CCol xs='6'>
                                                    <CButton
                                                        color='primary'
                                                        className='px-4'
                                                        onClick={loginHandler}
                                                    >
                                                        Giriş yap
                                                    </CButton>
                                                </CCol>
                                            </CRow>
                                        </CForm>
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </HocLoader>
    );
};

export default Login;
