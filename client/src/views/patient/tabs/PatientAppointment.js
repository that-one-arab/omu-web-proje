import React, { useEffect, useState } from 'react';
import { CCol, CButton, CCard, CCardHeader } from '@coreui/react';
import { useHistory, useLocation } from 'react-router-dom';
import { AddNewAppointmentModal } from '../../../components/modal/custom';
import { PatientAppointmentsTable } from '../../../components/table/custom';

export default function PatientAppointments({
    appointments,
    patientID,
    setLoading,
    setRenderCount,
}) {
    const history = useHistory();

    // code lines for setting up pagnation
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '');
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
    const [page, setPage] = useState(currentPage);

    const [modalOn, setModalOn] = useState(false);

    const pageChange = (newPage) => {
        currentPage !== newPage &&
            history.push(
                `/patients/${patientID}?page=${newPage}&table=appointments`
            );
    };

    useEffect(() => {
        currentPage !== page && setPage(currentPage);
    }, [currentPage, page]);

    return (
        <CCol xl={12}>
            <AddNewAppointmentModal
                show={modalOn}
                setShow={setModalOn}
                patientID={patientID}
                setLoading={setLoading}
                setRenderCount={setRenderCount}
            />
            <CCard>
                <CCardHeader className='basvuru-detay-header'>
                    <h5>Randevular</h5>
                    <CCol sm='2' className='basvuru-detay-header-buttonCol'>
                        <CButton
                            active
                            block
                            color='primary'
                            aria-pressed='true'
                            onClick={() => setModalOn(!modalOn)}
                        >
                            Ekle
                        </CButton>
                    </CCol>
                </CCardHeader>
                <PatientAppointmentsTable
                    appointmentData={appointments}
                    page={page}
                    pageChange={pageChange}
                    patientID={patientID}
                    setLoading={setLoading}
                    setRenderCount={setRenderCount}
                />
            </CCard>
        </CCol>
    );
}
