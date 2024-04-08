import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormGroup,
    CInput,
    CLabel,
    CDataTable,
    CPagination,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CInputRadio,
    CRow,
    CTextarea,
} from '@coreui/react';
import { memo, useState } from 'react';

const data = [
    {
        isim: 'Kalemler',
        tutar: '15 TL',
        tarih: '2022-01-15',
        tur: 'Gider',
    },
    {
        isim: 'Kart Ödemesi',
        tutar: '200 TL',
        tarih: '2022-01-01',
        tur: 'Gelir',
    },
];

const fields = [
    { key: 'isim', _classes: 'font-weight-bold' },
    'tutar',
    'tarih',
    'tur',
    {
        key: 'show_details',
        label: '',
        _style: { width: '1%' },
        sorter: false,
        filter: false,
    },
];

export default memo(function IncomeAndExpense() {
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    return (
        <div>
            {/* <ResponseModal
                modal={responseModal}
                setModal={setResponseModal}
                onClose={closeResponseModal}
            /> */}
            <CModal
                show={addModal}
                onClose={() => setAddModal(!addModal)}
                color={'success'}
                centered
                size='lg'
            >
                <CModalHeader closeButton>
                    <CModalTitle> Yeni Kayıt </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='select'>Başlık</CLabel>
                        </CCol>
                        <CCol xs='12' md='9'>
                            <CInput placeholder='Başlık giriniz' />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel>Tür</CLabel>
                        </CCol>
                        <CCol md='9'>
                            <CFormGroup variant='custom-radio' inline>
                                <CInputRadio
                                    custom
                                    id='inline-radio1'
                                    name='inline-radios'
                                    value='option1'
                                />
                                <CLabel
                                    variant='custom-checkbox'
                                    htmlFor='inline-radio1'
                                >
                                    Gider
                                </CLabel>
                            </CFormGroup>
                            <CFormGroup variant='custom-radio' inline>
                                <CInputRadio
                                    custom
                                    id='inline-radio2'
                                    name='inline-radios'
                                    value='option2'
                                />
                                <CLabel
                                    variant='custom-checkbox'
                                    htmlFor='inline-radio2'
                                >
                                    Gelir
                                </CLabel>
                            </CFormGroup>
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='select'>Tutar</CLabel>
                        </CCol>
                        <CCol xs='12' md='9'>
                            <CInput placeholder='Tutar giriniz' type='number' />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='date-input'>Tarih</CLabel>
                        </CCol>
                        <CCol xs='12' md='9'>
                            <CInput
                                // onChange={setAppointmentDateHandler}
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
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='select'>Açıklama</CLabel>
                        </CCol>
                        <CCol xs='12' md='9'>
                            <CTextarea placeholder='Açıklama giriniz' />
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
            <CModal
                show={editModal}
                onClose={() => setEditModal(!editModal)}
                color={'primary'}
                centered
                size='lg'
            >
                <CModalHeader closeButton>
                    <CModalTitle> Kayıdı Düzelt </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='select'>Başlık</CLabel>
                        </CCol>
                        <CCol xs='12' md='9'>
                            <CInput placeholder='Başlık giriniz' />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel>Tür</CLabel>
                        </CCol>
                        <CCol md='9'>
                            <CFormGroup variant='custom-radio' inline>
                                <CInputRadio
                                    custom
                                    id='inline-radio1'
                                    name='inline-radios'
                                    value='option1'
                                />
                                <CLabel
                                    variant='custom-checkbox'
                                    htmlFor='inline-radio1'
                                >
                                    Gider
                                </CLabel>
                            </CFormGroup>
                            <CFormGroup variant='custom-radio' inline>
                                <CInputRadio
                                    custom
                                    id='inline-radio2'
                                    name='inline-radios'
                                    value='option2'
                                />
                                <CLabel
                                    variant='custom-checkbox'
                                    htmlFor='inline-radio2'
                                >
                                    Gelir
                                </CLabel>
                            </CFormGroup>
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='select'>Tutar</CLabel>
                        </CCol>
                        <CCol xs='12' md='9'>
                            <CInput placeholder='Tutar giriniz' type='number' />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='date-input'>Tarih</CLabel>
                        </CCol>
                        <CCol xs='12' md='9'>
                            <CInput
                                // onChange={setAppointmentDateHandler}
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
                    <CFormGroup row>
                        <CCol md='3'>
                            <CLabel htmlFor='select'>Açıklama</CLabel>
                        </CCol>
                        <CCol xs='12' md='9'>
                            <CTextarea placeholder='Açıklama giriniz' />
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
            <CCard>
                <CCardHeader>Giderler Ve Gelirler</CCardHeader>
                <CCardBody>
                    <CFormGroup>
                        <CRow className=''>
                            <CCol xs='2'>
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
                            <CCol xs='4'>
                                <CButton
                                    className='temp'
                                    color='success'
                                    onClick={() => setAddModal(true)}
                                >
                                    Ekle
                                </CButton>
                            </CCol>
                        </CRow>
                    </CFormGroup>
                    <br />
                    <CDataTable
                        columnFilter
                        addTableClasses='CDataTable'
                        sorter
                        responsive
                        items={data}
                        fields={fields}
                        // loading={loading}
                        hover
                        // striped
                        itemsPerPage={15}
                        // activePage={page}
                        clickableRows
                        // onRowClick={(patient) => {
                        //     history.push(`/patients/${patient.patientID}`);
                        // }}
                        scopedSlots={{
                            tur: (item) => (
                                <td
                                    style={{
                                        color:
                                            item.tur === 'Gelir'
                                                ? 'green'
                                                : 'red',
                                    }}
                                >
                                    {item.tur}
                                </td>
                            ),
                            show_details: (item, index) => {
                                return (
                                    <td className='py-2'>
                                        <CButton
                                            color='primary'
                                            variant='outline'
                                            size='sm'
                                            onClick={() => {
                                                setEditModal(true);
                                            }}
                                        >
                                            Detay
                                        </CButton>
                                    </td>
                                );
                            },
                        }}
                    />
                    <CPagination
                        // activePage={page}
                        // onActivePageChange={pageChange}
                        pages={15}
                        doubleArrows={false}
                        align='center'
                    />
                </CCardBody>
            </CCard>
            <hr />
            <p>(Have table here)</p>
        </div>
    );
});
