import React, { useEffect, useState } from 'react';
import { CCol } from '@coreui/react';
import { useHistory, useLocation } from 'react-router-dom';
import { AddTreatmentModal } from '../../../components/modal/custom';
import { PatientTreatmentsTable } from '../../../components/table/custom';

export default function PatientTreatments({
    patientID,
    patientTreatments,
    setLoading,
    setRenderCount,
}) {
    // code lines for setting up pagnation
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '');
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
    const [page, setPage] = useState(currentPage);

    const history = useHistory();
    const [addTreatmentModalOn, setAddTreatmentModalOn] = useState(false);

    const pageChange = (newPage) => {
        currentPage !== newPage &&
            history.push(
                `/patients/${patientID}?page=${newPage}&table=treatments`
            );
    };

    useEffect(() => {
        currentPage !== page && setPage(currentPage);
    }, [currentPage, page]);

    return (
        <CCol xl={12}>
            <AddTreatmentModal
                show={addTreatmentModalOn}
                setShow={setAddTreatmentModalOn}
                patientID={patientID}
                setLoading={setLoading}
                setRenderCount={setRenderCount}
            />
            <PatientTreatmentsTable
                treatmentData={patientTreatments}
                page={page}
                pageChange={pageChange}
                setAddTreatmentModalOn={setAddTreatmentModalOn}
                setLoading={setLoading}
                setRenderCount={setRenderCount}
                patientID={patientID}
            />
        </CCol>
    );
}
