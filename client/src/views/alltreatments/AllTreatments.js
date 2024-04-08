import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CPagination,
    CButton,
} from '@coreui/react';
import { exportFile, parseTreatmentPrice } from '../../helpers';

const fields = [
    { key: 'hasta_ismi', _classes: 'font-weight-bold' },
    'kimlik_no',
    'tedavi_adi',
    'tedavi_ucreti',
    'tedavi_tarihi',
    'tercuman',
    'doktor',
];

const exportTreatmentsExcelSheet = (data) => {
    const cols = [
        'Hasta İsmi',
        'Kimlik No',
        'Tedavi Adı',
        'Tedavi Ücreti',
        'Tedavi Tarihi',
        'Tercüman',
        'Doktor',
        'patientID',
    ];
    const sheetName = 'Tedaviler';
    const fileName = 'tedaviler';

    exportFile(data, cols, sheetName, fileName);
};

export default function AllAppointments() {
    // code lines for setting up pagnation
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '');
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
    const [page, setPage] = useState(currentPage);

    const history = useHistory();
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const pageChange = (newPage) => {
        currentPage !== newPage &&
            history.push(`/treatments/all?page=${newPage}`);
    };

    useEffect(() => {
        currentPage !== page && setPage(currentPage);
        const getData = async () => {
            const res = await fetch('/api/treatments', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });
            if (res.status === 200) {
                const resData = await res.json();
                console.log({ resData });
                const parsedData = resData.map((patient) => ({
                    hasta_ismi: patient.fullName,
                    kimlik_no: patient.identityNo,
                    tedavi_adi: patient.treatmentName,
                    tedavi_ucreti: parseTreatmentPrice(
                        patient.treatmentPrice,
                        patient.treatmentPriceCurrency
                    ),
                    tedavi_tarihi: patient.treatmentDate,
                    tercuman: patient.translatorName
                        ? patient.translatorName
                        : 'Yok',
                    doktor: patient.doctorName,
                    patientID: patient.patientID,
                }));
                setData(parsedData);
            }
            setLoading(false);
        };
        getData();
    }, [currentPage, page]);

    return (
        <CRow className='d-flex justify-content-center'>
            <CCol xl={12}>
                <CCard>
                    <CCardHeader
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>Tüm Tedavileriniz</div>
                        <div>
                            <CButton
                                color='primary'
                                onClick={() => exportTreatmentsExcelSheet(data)}
                            >
                                Excel
                            </CButton>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            columnFilter
                            items={data}
                            fields={fields}
                            loading={loading}
                            hover
                            striped
                            addTableClasses='CDataTable'
                            sorter
                            itemsPerPage={30}
                            activePage={page}
                            clickableRows
                            onRowClick={(item) => {
                                history.push(`/patients/${item.patientID}`);
                            }}
                            scopedSlots={{
                                Statü: (item) => <td>{item.Statü}</td>,
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
            </CCol>
        </CRow>
    );
}
