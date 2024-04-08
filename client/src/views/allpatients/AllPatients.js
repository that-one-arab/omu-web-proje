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
import { exportFile } from '../../helpers';

const fields = [
    { key: 'hasta_ismi', _classes: 'font-weight-bold' },
    'kimlik_no',
    'telefon_no',
    'kayıt_tarihi',
    'doktor',
];

const exportPatientsExcelSheet = (data) => {
    const cols = [
        'Hasta İsmi',
        'Kimlik No',
        'Telefon No',
        'Kayıt Tarihi',
        'Doktor',
        'PatientID',
    ];

    const sheetName = 'Hastalar';
    const fileName = 'hastalar';

    exportFile(data, cols, sheetName, fileName);
};

const AllPatients = () => {
    // code lines for setting up pagnation
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '');
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
    const [page, setPage] = useState(currentPage);

    const history = useHistory();
    const [usersData, setUsersData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const pageChange = (newPage) => {
        currentPage !== newPage &&
            history.push(`/patients/all?page=${newPage}`);
    };

    useEffect(() => {
        currentPage !== page && setPage(currentPage);
        const getData = async () => {
            const res = await fetch('/api/patients', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie}`,
                },
            });

            if (res.status === 200) {
                const data = await res.json();

                const parsedData = data.map((patient) => ({
                    hasta_ismi: patient.fullName,
                    kimlik_no: patient.identityNo,
                    telefon_no: patient.phoneNo,
                    kayıt_tarihi: patient.recordDate,
                    doktor: patient.doctorName,
                    patientID: patient.patientID,
                }));
                setUsersData(parsedData);
            }
            setLoading(false);
        };
        getData();

        /** Cleanup */
        return () => {
            setUsersData([]);
        };
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
                        <div>Tüm Hastalarınız</div>
                        <div>
                            <CButton
                                color='primary'
                                onClick={() =>
                                    exportPatientsExcelSheet(usersData)
                                }
                            >
                                Excel
                            </CButton>
                        </div>
                    </CCardHeader>{' '}
                    <CCardBody>
                        <CDataTable
                            columnFilter
                            addTableClasses='CDataTable'
                            sorter
                            responsive
                            items={usersData}
                            fields={fields}
                            loading={loading}
                            hover
                            striped
                            itemsPerPage={15}
                            activePage={page}
                            clickableRows
                            onRowClick={(patient) => {
                                history.push(`/patients/${patient.patientID}`);
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

export default AllPatients;
