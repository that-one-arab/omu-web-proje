import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CPagination,
} from '@coreui/react';

const fields = [
    { key: 'hasta_ismi', _classes: 'font-weight-bold' },
    'kimlik_no',
    'telefon_no',
    'randevu_saati',
    'randevu_tarihi',
    'doktor',
];

const TodayAppointments = () => {
    const [page, setPage] = useState(1);

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const pageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await fetch('/api/appointments/today', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                const parsedData = data.map((patient) => ({
                    hasta_ismi: patient.fullName,
                    kimlik_no: patient.patientIdentityNo,
                    telefon_no: patient.phoneNum,
                    randevu_saati: patient.appointmentHour,
                    randevu_tarihi: patient.appointmentDate,
                    doktor: patient.doctorName,
                    patientID: patient.patientID,
                }));
                setData(parsedData);
            }
            setLoading(false);
        };
        fetchData();

        return () => {
            setData([]);
        };
    }, []);

    return (
        <CRow className='d-flex justify-content-center'>
            <CCol xl={12}>
                <CCard>
                    <CCardHeader>Bugünkü randevularınız</CCardHeader>
                    <CCardBody>
                        <CDataTable
                            columnFilter
                            items={data}
                            fields={fields}
                            loading={loading}
                            hover
                            striped
                            itemsPerPage={30}
                            activePage={page}
                            addTableClasses='CDataTable'
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

export default TodayAppointments;
