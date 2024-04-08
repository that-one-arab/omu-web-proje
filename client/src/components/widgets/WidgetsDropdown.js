import React, { useEffect, useState } from 'react';
import { CWidgetDropdown, CRow, CCol } from '@coreui/react';

const WidgetsDropdown = () => {
    const [todayAppointments, setTodayAppointments] = useState(0);
    const [thisMonthPatients, setThisMonthPatients] = useState(0);
    const [thisYearPatients, setThisYearPatients] = useState(0);
    const [allPatients, setAllPatients] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/appointments/count?query=today', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });
            const data = await res.json();
            setTodayAppointments(data);

            const res1 = await fetch('/api/patients/count?query=this_month', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });
            const data1 = await res1.json();
            setThisMonthPatients(data1);

            const res2 = await fetch('/api/patients/count?query=this_year', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });
            const data2 = await res2.json();
            setThisYearPatients(data2);

            const res3 = await fetch('/api/patients/count?query=all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${document.cookie} `,
                },
            });
            const data3 = await res3.json();
            setAllPatients(data3);
        };
        fetchData();

        return () => {
            setTodayAppointments(0);
            setThisMonthPatients(0);
            setThisYearPatients(0);
            setAllPatients(0);
        };
    }, []);

    return (
        <CRow>
            {/* <CCol sm='6' lg='3'>
                <CWidgetDropdown
                    // onClick = {() => history.push(`${pushToLink}`)}
                    style={{ height: '130px' }}
                    color={'gradient-primary'}
                    header={`${todayAppointments}`}
                    text={'Bugünkü Randevularınız'}
                ></CWidgetDropdown>
            </CCol> */}

            <CCol sm='6' lg='4'>
                <CWidgetDropdown
                    // onClick = {() => history.push(`${pushToLink}`)}
                    style={{ height: '130px' }}
                    color={'gradient-info'}
                    header={`${thisMonthPatients}`}
                    text={'Bu Ayki Hasta Sayınız'}
                ></CWidgetDropdown>
            </CCol>

            <CCol sm='6' lg='4'>
                <CWidgetDropdown
                    // onClick = {() => history.push(`${pushToLink}`)}
                    style={{ height: '130px' }}
                    color={'gradient-warning'}
                    header={`${thisYearPatients}`}
                    text={'Bu Yılki Hasta Sayınız'}
                ></CWidgetDropdown>
            </CCol>

            <CCol sm='6' lg='4'>
                <CWidgetDropdown
                    // onClick = {() => history.push(`${pushToLink}`)}
                    style={{ height: '130px' }}
                    color={'gradient-danger'}
                    header={`${allPatients}`}
                    text={'Tüm Hasta sayınız'}
                ></CWidgetDropdown>
            </CCol>
        </CRow>
    );
};

export default WidgetsDropdown;
