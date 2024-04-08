import React, { lazy } from 'react';
import Appointments from '../appointments/Appointments.js';
import TodayAppointments from './TodayAppointments.js';
import TomorrowAppointments from './TomorrowAppointments';

const WidgetsDropdown = lazy(() =>
    import('../../components/widgets/WidgetsDropdown.js')
);

const Dashboard = () => {
    return (
        <>
            <WidgetsDropdown />
            {/* <Appointments /> */}
            <TodayAppointments />
            <TomorrowAppointments />
        </>
    );
};

export default Dashboard;
