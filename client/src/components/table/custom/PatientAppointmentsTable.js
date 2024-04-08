import { CCardBody, CButton, CDataTable, CPagination } from '@coreui/react';
import { useState } from 'react';
import { EditAppointmentModal } from '../../modal/custom';

export function PatientAppointmentsTable({
    appointmentData,
    page,
    pageChange,
    patientID,
    setLoading,
    setRenderCount,
}) {
    const appointmentFields = [
        { key: 'randevu_saati', _classes: 'font-weight-bold' },
        'randevu_tarihi',
        'randevu_olusturma_tarihi',
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            sorter: false,
            filter: false,
        },
    ];

    const mappedAppointmentData =
        appointmentData.length &&
        appointmentData.map((appointment) => ({
            randevu_saati: appointment.appointmentHour,
            randevu_tarihi: appointment.appointmentDate,
            randevu_olusturma_tarihi: appointment.appointmentCreationDate,
            appointmentID: appointment.appointmentID,
        }));

    const [modalOn, setModalOn] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState({
        appointmentDate: '',
        appointmentHour: '',
        appointmentID: '',
    });

    return (
        <CCardBody>
            <EditAppointmentModal
                show={modalOn}
                setShow={setModalOn}
                patientID={patientID}
                setLoading={setLoading}
                setRenderCount={setRenderCount}
                initialAppointmentData={selectedAppointment}
            />
            <CDataTable
                tableFilter
                items={mappedAppointmentData}
                fields={appointmentFields}
                hover
                striped
                itemsPerPage={30}
                activePage={page}
                clickableRows
                sorter
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
                                        setModalOn(true);
                                        setSelectedAppointment({
                                            appointmentDate:
                                                item.randevu_tarihi,
                                            appointmentHour: item.randevu_saati,
                                            appointmentID: item.appointmentID,
                                        });
                                    }}
                                >
                                    Düzelt
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
    );
}
