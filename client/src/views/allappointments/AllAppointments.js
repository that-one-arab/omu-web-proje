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
import XLSX from 'xlsx';

import './allappointments.css';

const fields = [
    { key: 'hasta_ismi', _classes: 'font-weight-bold' },
    'telefon_no',
    'randevu_saati',
    'randevu_tarihi',
    'tercuman',
    'doktor',
];

const exportFile = (data) => {
    let cols = [
        'Hasta İsmi',
        'Telefon No',
        'Randevu Saati',
        'Randevu Tarihi',
        'Tercüman',
        'Doktor',
        'patientID',
    ];
    const excelData = JSON.parse(JSON.stringify(data));
    excelData.forEach((obj) => delete obj.submitProcessNum);
    let arrOfArrs = [];
    for (let i = 0; i < excelData.length; i++) {
        arrOfArrs[i] = Object.values(excelData[i]);
    }
    arrOfArrs.unshift(cols);
    const ws = XLSX.utils.aoa_to_sheet(arrOfArrs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Randevular');
    XLSX.writeFile(wb, 'randevular.xlsx');
};

const AppointmentsTable = () => {
    // code lines for setting up pagnation
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '');
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
    const [page, setPage] = useState(currentPage);

    const history = useHistory();
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const pageChange = (newPage) => {
        currentPage !== newPage &&
            history.push(`/appointments/all?page=${newPage}`);
    };

    useEffect(() => {
        currentPage !== page && setPage(currentPage);
        const getData = async () => {
            const res = await fetch('/api/appointments', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });
            if (res.status === 200) {
                const resData = await res.json();
                const parsedData = resData.map((patient) => ({
                    hasta_ismi: patient.fullName,
                    telefon_no: patient.phoneNum,
                    randevu_saati: patient.appointmentHour,
                    randevu_tarihi: patient.appointmentDate,
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
                        <div>Tüm Randevularınız</div>
                        <div>
                            <CButton
                                color='primary'
                                onClick={() => exportFile(data)}
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
};

export default function AllAppointments(props) {
    return (
        <div>
            <AppointmentsTable />
        </div>
    );
}
