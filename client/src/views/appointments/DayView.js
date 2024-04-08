import { useEffect, useState } from 'react';
import { timeData } from '../../global';
import { useDrag, useDrop } from 'react-dnd';
import HocLoader from '../../components/hocloader/HocLoader';
import AppointmentModal from './AppointmentModal';

const useFetch = (initialUrl, initialParams = {}, skip = false) => {
    const [url, updateUrl] = useState(initialUrl);
    const [params, updateParams] = useState(initialParams);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [refetchIndex, setRefetchIndex] = useState(0);

    const queryString = Object.keys(params)
        .map(
            (key) =>
                encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        )
        .join('&');

    const refetch = () =>
        setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);

    useEffect(() => {
        const fetchData = async () => {
            if (skip) return;
            setIsLoading(true);
            try {
                const response = await fetch(`${url}${queryString}`);
                const result = await response.json();
                if (response.ok) {
                    setData(result);
                } else {
                    setHasError(true);
                    setErrorMessage(result);
                }
            } catch (err) {
                setHasError(true);
                setErrorMessage(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [url, params, refetchIndex, queryString, skip]);

    return {
        data,
        isLoading,
        hasError,
        errorMessage,
        updateUrl,
        updateParams,
        refetch,
    };
};
/**
 * @param {string[]} timeData a representation of the selectable times from 00:00 to 24:00
 * @param {object[]} appointments fetched array from server containing the booked appointments
 * @returns {object[]} a formatted appointments array to be used for mapping
 */
function appointmentsMap(timeData, appointments) {
    const res = [];

    timeData.forEach((time) => {
        const appointment = appointments.find(
            (app) => app.appointmentHour === time
        );
        if (appointment) res.push(appointment);
        else
            res.push({
                appointmentHour: time,
                appointmentDate: new Date().toISOString().split('T')[0],
            });
    });

    return res;
}

function Draggable({ appointment }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'APPOINTMENT',
        item: {
            patientID: appointment.patientID,
            appointmentID: appointment.appointmentID,
            appointmentHour: appointment.appointmentHour,
            appointmentDate: appointment.appointmentDate,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <td
            // onClick={() => console.log('Clicked')}
            className='schedule-table-data stage-saturn grabbable'
            style={{ opacity: isDragging ? 0.5 : 1 }}
            ref={drag}
        >
            {appointment.fullName} <span>{appointment.doctorName}</span>
        </td>
    );
}

function Dropable({ appointment, setLoading, refetch }) {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        // The type (or types) to accept - strings or symbols
        accept: 'APPOINTMENT',
        // Props to collect
        collect: (monitor) => {
            // console.log('collect...', monitor);
            return {
                item: monitor.getItem(),
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            };
        },
        drop: async (item, monitor) => {
            setLoading(true);
            const { patientID, appointmentID, appointmentDate } = item;

            const newAppointmentHour = appointment.appointmentHour;

            const res = await fetch(
                `/api/appointments?patientID=${patientID}&appointmentID=${appointmentID}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${document.cookie}`,
                    },
                    body: JSON.stringify({
                        appointmentDate,
                        appointmentHour: newAppointmentHour,
                    }),
                }
            );

            setLoading(false);

            if (res.status === 200) {
                refetch();
            }
        },
        // canDrop: () => console.log('can drop'),
    }));

    return (
        <td
            ref={drop}
            role={'Dustbin'}
            style={{ backgroundColor: isOver ? 'red' : 'white' }}
            className='schedule-table-data'
        >
            {/* {canDrop ? 'Release to drop' : ''} */}
        </td>
    );
}

/**
 * @param {object} appointment
 * @note appointment.appointmentHour is garaunteed, while the other properties are not
 */
function ScheduleTableRow({ appointment, setLoading, refetch, setModalProps }) {
    return (
        <tr
            className='schedule-table-row'
            onClick={() => setModalProps(appointment)}
        >
            <th className='schedule-table-header'>
                {appointment.appointmentHour}
            </th>
            {/* If appointmentID is present, that means other appointment properties are also present */}
            {appointment.appointmentID ? (
                <Draggable appointment={appointment} />
            ) : (
                <Dropable
                    appointment={appointment}
                    setLoading={setLoading}
                    refetch={refetch}
                />
            )}
        </tr>
    );
}

export default function DayView() {
    const [appointments, setAppointments] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState(undefined);

    const { data, refetch, isLoading } = useFetch('/api/appointments/today');

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const todayAppointments = data;

    useEffect(() => {
        if (todayAppointments) {
            const mappedAppointments = appointmentsMap(
                timeData,
                todayAppointments
            );
            setAppointments(mappedAppointments);
        }
    }, [todayAppointments]);

    // console.log({ appointments });

    return (
        <HocLoader relative isLoading={loading}>
            <AppointmentModal
                show={modalData !== undefined}
                modalData={modalData}
                setModalData={setModalData}
            />
            <table className='schedule-table'>
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}></th>
                        <th style={{ width: '80%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {appointments &&
                        appointments.map((appointment, i) => (
                            <ScheduleTableRow
                                setModalProps={setModalData}
                                key={i}
                                appointment={appointment}
                                setLoading={setLoading}
                                refetch={refetch}
                            />
                        ))}
                    {/* <tr className='schedule-table-row'>
                        <th className='schedule-table-header'>09:00</th>
                        <td
                            colSpan='4'
                            className='schedule-table-data stage-earth'
                        >
                            Speaker One <span>Earth Stage</span>
                        </td>
                    </tr> */}
                </tbody>
            </table>
        </HocLoader>
    );
}
