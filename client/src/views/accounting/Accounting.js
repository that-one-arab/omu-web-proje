import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormGroup,
    CInput,
    CLabel,
    CRow,
    CButton,
} from '@coreui/react';
import { memo } from 'react';
import { useSelector } from 'react-redux';

export default memo(function Accounting() {
    const translators = useSelector((state) => state.reducer.translators);
    const doctors = useSelector((state) => state.reducer.doctors);

    return (
        <div>
            <CCard>
                <CCardHeader>Kasa</CCardHeader>
                <CCardBody>
                    <CFormGroup>
                        <CRow className=''>
                            <CCol xs='6'>
                                <CLabel>Tarih aralığı</CLabel>
                            </CCol>
                            <CCol xs='6'>
                                <div className='date-fields-container'>
                                    <CInput
                                        type='date'
                                        placeholder='başlangıç'
                                    />
                                    <p className='date-fields-seperator-slash'>
                                        -
                                    </p>
                                    <CInput type='date' placeholder='bitiş' />
                                    <CButton color='primary'>Ara</CButton>
                                </div>
                            </CCol>
                        </CRow>
                    </CFormGroup>
                    <hr />
                    <CFormGroup row>
                        <CCol xs='3'>
                            <CLabel>Gelir Toplamı</CLabel>
                        </CCol>
                        <CCol>
                            <CInput type='number' />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol xs='3'>
                            <CLabel>Gider Toplamı</CLabel>
                        </CCol>
                        <CCol>
                            <CInput type='number' />
                        </CCol>
                    </CFormGroup>
                    {doctors.map((doctor) => (
                        <CFormGroup row key={doctor.doctorID}>
                            <CCol xs='3'>
                                <CLabel>
                                    Hekim
                                    <strong> {doctor.doctorName} </strong>
                                    Tedavi Kazançı
                                </CLabel>
                            </CCol>
                            <CCol>
                                <CInput type='number' />
                            </CCol>
                        </CFormGroup>
                    ))}
                    <CFormGroup row>
                        <CCol xs='3'>
                            <CLabel>Hekimlerin Tedavi Kaçancı</CLabel>
                        </CCol>
                        <CCol>
                            <CInput type='number' />
                        </CCol>
                    </CFormGroup>
                    {translators.map((translator) => (
                        <CFormGroup row key={translator.translatorID}>
                            <CCol xs='3'>
                                <CLabel>
                                    Tercüman
                                    <strong>
                                        {' '}
                                        {translator.translatorName}{' '}
                                    </strong>
                                    Komisyon Kazancı
                                </CLabel>
                            </CCol>
                            <CCol>
                                <CInput type='number' />
                            </CCol>
                        </CFormGroup>
                    ))}
                    <CFormGroup row>
                        <CCol xs='3'>
                            <CLabel>Tercümanların Komisyon Kazancı</CLabel>
                        </CCol>
                        <CCol>
                            <CInput type='number' />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol xs='3'>
                            <CLabel>Genel Toplamı</CLabel>
                        </CCol>
                        <CCol>
                            <CInput type='number' />
                        </CCol>
                    </CFormGroup>
                </CCardBody>
            </CCard>
        </div>
    );
});
