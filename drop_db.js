const db = require('./lib/db');

db.query(
    `
drop table public.patient_treatments;

drop table public.patient_treatments_log;

drop table public.patients;

drop table public.patients_log;

drop table public.patient_diseases;

drop table public.patient_diseases_log;

drop table public.appointments;

drop table public.appointments_log;

drop table public.doctors;

drop table public.translators;

drop table public.credentials;
`
)
    .then(() => {
        console.log('Tables dropped successfully');
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
    });
