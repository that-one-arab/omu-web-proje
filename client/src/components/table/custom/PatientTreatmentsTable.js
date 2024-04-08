import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CButton,
    CDataTable,
    CPagination,
} from '@coreui/react';
import { useState } from 'react';
import { EditTreatmentModal } from '../../modal/custom';

const parseTreatmentsData = (treatments) => {
    return treatments.map((treatment) => ({
        ...treatment,
        tedavi_adi: treatment.treatmentName,
        tedavi_ucreti: treatment.treatmentPrice,
        dis_no: treatment.teethNum,
        tedavi_tarihi: treatment.recordDate.split('T')[0],
    }));
};

export function PatientTreatmentsTable({
    treatmentData,
    setLoading,
    setRenderCount,
    page,
    pageChange,
    setAddTreatmentModalOn,
    patientID,
}) {
    const fields = [
        { key: 'tedavi_adi', _classes: 'font-weight-bold' },
        'tedavi_ucreti',
        'dis_no',
        'tedavi_tarihi',
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            sorter: false,
            filter: false,
        },
    ];

    const parsedData = parseTreatmentsData(treatmentData);

    const [editTreatmentModal, setEditTreatmentModal] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState({
        treatmentName: '',
        treatmentPrice: '',
        treatmentTeethNo: 0,
        treatmentDate: '',
        treatmentDescription: '',
    });

    return (
        <>
            <EditTreatmentModal
                show={editTreatmentModal}
                setShow={setEditTreatmentModal}
                setLoading={setLoading}
                setRenderCount={setRenderCount}
                initialTreatmentData={selectedTreatment}
                patientID={patientID}
            />
            <CCard>
                <CCardHeader className='basvuru-detay-header'>
                    <h5>Tedavileri</h5>
                    <CCol sm='2' className='basvuru-detay-header-buttonCol'>
                        <CButton
                            active
                            block
                            color='success'
                            aria-pressed='true'
                            onClick={() => setAddTreatmentModalOn(true)}
                        >
                            Ekle
                        </CButton>
                    </CCol>
                </CCardHeader>
                <CCardBody>
                    <CDataTable
                        tableFilter
                        items={parsedData}
                        fields={fields}
                        hover
                        striped
                        itemsPerPage={30}
                        activePage={page}
                        clickableRows
                        // onRowClick={(item) => {
                        //     setModal(true);
                        //     setModalData(item);
                        // }}
                        scopedSlots={{
                            Statü: (item) => <td>{item.Statü}</td>,
                            show_details: (item, index) => {
                                return (
                                    <td className='py-2'>
                                        <CButton
                                            color='primary'
                                            variant='outline'
                                            size='sm'
                                            onClick={() => {
                                                setEditTreatmentModal(true);
                                                setSelectedTreatment(item);
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
                        activePage={page}
                        onActivePageChange={pageChange}
                        pages={15}
                        doubleArrows={false}
                        align='center'
                    />
                </CCardBody>
            </CCard>
        </>
    );
}
