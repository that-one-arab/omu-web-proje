import { lazy } from 'react';
const Accounting = lazy(() => import('../../../views/accounting/Accounting'));

const Appointments = lazy(() =>
    import('../../../views/appointments/Appointments')
);
const Dashboard = lazy(() => import('../../../views/dashboard/Dashboard'));
const AllPatients = lazy(() =>
    import('../../../views/allpatients/AllPatients')
);
const Patient = lazy(() => import('../../../views/patient/Patient'));
const AddNewPatient = lazy(() =>
    import('../../../views/addnewpatient/AddNewPatient')
);
const AllAppointments = lazy(() =>
    import('../../../views/allappointments/AllAppointments')
);
const AllTreatments = lazy(() =>
    import('../../../views/alltreatments/AllTreatments')
);
const IncomeAndExpense = lazy(() =>
    import('../../../views/incomeandexpense/IncomeAndExpense')
);

const routes = [
    { path: '/', exact: true, name: 'Home' },
    {
        path: '/dashboard',
        exact: true,
        name: 'dashboard',
        component: Dashboard,
    },
    {
        path: '/patients/all',
        exact: true,
        name: 'all patients',
        component: AllPatients,
    },
    {
        path: '/patients/new',
        exact: true,
        name: 'add new patient',
        component: AddNewPatient,
    },
    {
        path: '/appointments/all',
        exact: true,
        name: 'all appointments',
        component: AllAppointments,
    },
    {
        path: '/treatments/all',
        exact: true,
        name: 'all treatments',
        component: AllTreatments,
    },
    {
        path: '/patients/:patientID',
        exact: true,
        name: 'patient',
        component: Patient,
    },
    {
        path: '/manager',
        exact: true,
        name: 'appointments',
        component: Appointments,
    },
    {
        path: '/accounting',
        exact: true,
        name: 'accounting',
        component: Accounting,
    },
    {
        path: '/income-and-expense',
        exact: true,
        name: 'income and expense',
        component: IncomeAndExpense,
    },
];

export default routes;
