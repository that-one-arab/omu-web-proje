const express = require('express');
const {
    generateAccessToken,
    uuid,
    serverErrorRes,
    successRes,
    errorRes,
    timeData,
    buildTreatmentsQuery,
} = require('../helpers');
const { authenticateToken } = require('../helpers/middleware');
const { query } = require('../lib/db');
const {
    insertNewPatient,
    updatePatientInfo,
    insertNewAppointment,
    updateAppointment,
    updateDiseases,
    insertNewTreatment,
    updateTreatment,
    parseSymbolToCurrencyName,
} = require('../queries');

const app = (module.exports = express());

app.get('/verify-token', authenticateToken, (req, res) => {
    return res.json('token valid');
});

app.post('/login', async (req, res) => {
    try {
        if (!req.body || !req.body.username || !req.body.password)
            return res.status(406).json('cheeky breeky arent you?');
        const { username, password } = req.body;

        const credentialsQuery = await query('SELECT * FROM credentials');

        const myUsername = credentialsQuery.rows[0].username;
        const myPassword = credentialsQuery.rows[0].password;

        if (username === myUsername && password === myPassword) {
            const token = generateAccessToken();
            res.json(token);
        } else res.status(401).json('incorrect credentials');
    } catch (error) {}
});

/** Returns all doctors who are active */
app.get('/doctors', authenticateToken, async (req, res) => {
    try {
        const statement = `
            SELECT
                doctor_id AS "doctorID",
                doctor_name AS "doctorName"
            FROM
                doctors
            WHERE
                is_deleted = false
        `;
        const doctors = await query(statement);
        return res.json(doctors.rows);
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

/** Returns all translators who are active */
app.get('/translators', authenticateToken, async (req, res) => {
    try {
        const statement = `
            SELECT
                translator_id AS "translatorID",
                name AS "translatorName",
                phone_number AS "translatorPhoneNumber"
            FROM
                translators
            WHERE
                is_deleted = false
        `;
        const translators = await query(statement);
        return res.json(translators.rows);
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.get('/patients/count', authenticateToken, async (req, res) => {
    try {
        const { query: requestedQuery } = req.query;

        let queryStatement = undefined;

        if (requestedQuery === 'this_month') {
            queryStatement = `
                SELECT COUNT(patient_id) 
                    FROM patients 
                WHERE is_deleted = false 
                AND EXTRACT(MONTH FROM record_date) = $1
            `;

            const currentMonth = new Date().getMonth() + 1;

            const resultQuery = await query(queryStatement, [currentMonth]);

            return res.json(resultQuery.rows[0].count);
        } else if (requestedQuery === 'this_year') {
            queryStatement = `
                SELECT COUNT(patient_id) 
                    FROM patients 
                WHERE is_deleted = false 
                AND EXTRACT(YEAR FROM record_date) = $1
            `;

            const currentYear = new Date().getFullYear();

            const resultQuery = await query(queryStatement, [currentYear]);

            return res.json(resultQuery.rows[0].count);
        } else {
            queryStatement = `
                SELECT COUNT(patient_id) 
                    FROM patients 
                WHERE is_deleted = false 
            `;

            const resultQuery = await query(queryStatement);

            return res.json(resultQuery.rows[0].count);
        }
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.get('/appointments/count', authenticateToken, async (req, res) => {
    try {
        const { query: requestedQuery } = req.query;

        let queryStatement = undefined;

        if (requestedQuery === 'today') {
            queryStatement = `
                SELECT COUNT(appointments.appointment_id)
                FROM appointments
                inner join patients
                on appointments.patient_id = patients.patient_id
                WHERE appointments.is_deleted = false
                AND patients.is_deleted = false
                AND appointments.appointment_date = CURRENT_DATE
            `;

            const resultQuery = await query(queryStatement);
            return res.json(resultQuery.rows[0].count);
        }
    } catch (error) {
        return errorRes(error, res);
    }
});

/** Adds a new patient to the DB */
app.post('/patients', authenticateToken, async (req, res) => {
    try {
        const {
            fullName,
            birthDate,
            gender,
            identityNo,
            phoneNo,
            translatorID,
            recordDate,
            address,
            doctorID,
            extraDetails,
        } = req.body;

        if (
            !fullName ||
            !birthDate ||
            !gender ||
            !identityNo ||
            !phoneNo ||
            !recordDate ||
            !doctorID
        )
            return errorRes(res, 'Required information is missing', 406);

        const verifyIdentityNumberNotDuplicate = async (identityNumber) => {
            try {
                const verifyStatement = `
                    SELECT
                        identity_no
                    FROM
                        patients
                    WHERE
                        identity_no = $1
                    AND
                        is_deleted = false
                `;
                const verifyQuery = await query(verifyStatement, [
                    identityNumber,
                ]);
                if (verifyQuery.rows.length) return false;
                return true;
            } catch (error) {
                throw new Error(error);
            }
        };

        if ((await verifyIdentityNumberNotDuplicate(identityNo)) === false)
            return errorRes(res, 'Your identiy no is duplicate', 405);

        const patientID = uuid('PAT-');

        await insertNewPatient(
            patientID,
            {
                fullName,
                birthDate,
                gender,
                identityNo,
                phoneNo,
                translatorID,
                recordDate,
                address,
                doctorID,
                extraDetails,
            },
            res
        );

        return successRes(
            res,
            'Patient successfully created',
            { patientID },
            201
        );
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.get('/patients', authenticateToken, async (req, res) => {
    try {
        const statement = `
            SELECT
                patients.patient_id AS "patientID",
                patients.full_name AS "fullName",
                patients.identity_no AS "identityNo",
                patients.gender,
                to_char(patients.birth_date, 'DD/MM/YYYY') AS "birthDate",
                patients.phone_no AS "phoneNo",
                patients.address,
                patients.translator_id AS "translatorID",
                doctors.doctor_id AS "doctorID",
                doctors.doctor_name AS "doctorName",
                translators.translator_id AS "translatorID",
                translators.name AS "translatorName",                
                patients.description,
                to_char(patients.record_date, 'DD/MM/YYYY') AS "recordDate"
            FROM
                patients
            INNER JOIN
                doctors
            ON
                doctors.doctor_id = patients.doctor_id
            LEFT JOIN
                translators
            ON
                translators.translator_id = patients.translator_id
            WHERE
                patients.is_deleted = false
        `;
        const patientsData = await query(statement);

        return res.json(patientsData.rows);
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.get('/patients/:patientID', authenticateToken, async (req, res) => {
    try {
        const { patientID } = req.params;
        const statement = `
            SELECT
                patients.patient_id AS "patientID",
                patients.full_name AS "fullName",
                patients.identity_no AS "identityNo",
                patients.gender,
                to_char(patients.birth_date, 'YYYY-MM-DD') AS "birthDate",
                patients.phone_no AS "phoneNo",
                patients.address,
                patients.translator_id AS "translatorID",
                doctors.doctor_id AS "doctorID",
                doctors.doctor_name AS "doctorName",
                translators.translator_id AS "translatorID",
                translators.name AS "translatorName",                
                patients.description,
                to_char(patients.record_date, 'YYYY-MM-DD') AS "recordDate"
            FROM
                patients
            INNER JOIN
                doctors
            ON
                doctors.doctor_id = patients.doctor_id
            LEFT JOIN
                translators
            ON
                translators.translator_id = patients.translator_id
            WHERE
                patients.is_deleted = false
            AND
                patients.patient_id = $1
        `;
        const patientData = await query(statement, [patientID]);

        const appointmentsQueryStatement = `
            SELECT
                appointment_id AS "appointmentID",
                patient_id AS "patientID",
                to_char(appointment_date, 'YYYY-MM-DD') AS "appointmentDate",
                appointment_hour AS "appointmentHour",
                to_char(creation_date, 'YYYY-MM-DD') AS "appointmentCreationDate"
            FROM
                appointments
            WHERE
                patient_id = $1
            AND
                is_deleted = false
        `;
        const appointmentsData = await query(appointmentsQueryStatement, [
            patientID,
        ]);

        const diseasesQueryStatement = `
            SELECT
                *
            FROM
                patient_diseases
            WHERE
                patient_id = $1
        `;

        const diseasesData = await query(diseasesQueryStatement, [patientID]);

        const treatmentsQueryStatement = `
            SELECT
                patient_id AS "patientID",
                patient_treatment_id AS "treatmentID",
                to_char(record_date, 'YYYY-MM-DD') AS "recordDate",
                teeth_num AS "teethNum",
                treatment_name AS "treatmentName",
                treatment_price AS "treatmentPrice",
                treatment_price_currency AS "treatmentPriceCurrency",
                treatment_description AS "treatmentDescription"
            FROM
                patient_treatments
            WHERE
                patient_id = $1
            AND
                is_deleted = false

        `;

        const treatmentsQuery = await query(treatmentsQueryStatement, [
            patientID,
        ]);

        console.info

        const patient = {
            info: patientData.rows[0],
            appointments: appointmentsData.rows,
            // diseases: diseasesData.rows.map((disease) => {
            //     const diseaseObject = {
            //         patient_id: disease.patient_id,
            //         disease_id: disease.disease_id,
            //         b1: disease.b1,
            //         b2: disease.b2,
            //         b3: disease.b3,
            //         b4: disease.b4,
            //         l1: JSON.parse(disease.l1),
            //         text1: disease.text1,
            //         text2: disease.text2,
            //         text3: disease.text3,
            //         text4: disease.text4,
            //     };
            //     return diseaseObject;
            // }),
            diseases: {
                ...diseasesData.rows[0],
                l1: JSON.parse(diseasesData.rows[0].l1)
            },
            treatments: treatmentsQuery.rows,
        };

        return res.json(patient);
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.put('/patients/:patientID', authenticateToken, async (req, res) => {
    try {
        const { patientID } = req.params;
        const {
            fullName,
            birthDate,
            gender,
            identityNo,
            phoneNo,
            translatorID,
            recordDate,
            address,
            doctorID,
            extraDetails,
        } = req.body;

        if (
            !fullName ||
            !birthDate ||
            !gender ||
            !identityNo ||
            !phoneNo ||
            !recordDate ||
            !doctorID
        )
            return errorRes(res, 'Required information is missing', 406);

        await updatePatientInfo(
            fullName,
            recordDate,
            extraDetails,
            identityNo,
            gender,
            birthDate,
            phoneNo,
            address,
            translatorID,
            doctorID,
            patientID
        );

        return successRes(
            res,
            'Patient successfully created',
            { patientID },
            201
        );
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

/** return available appointments for a certain date */
app.get(
    '/appointments/available/:date',
    authenticateToken,
    async (req, res) => {
        try {
            const { date } = req.params;

            const appointmentsQueryStatement = `
            SELECT
                appointment_id AS "appointmentID",
                patient_id AS "patientID",
                appointment_date AS "appointmentDate",
                appointment_hour AS "appointmentHour"
            FROM
                appointments
            WHERE
                appointment_date = $1
            AND
                is_deleted = false
        `;
            const appointmentsQuery = await query(appointmentsQueryStatement, [
                date,
            ]);

            const takenHours = appointmentsQuery.rows.map(
                (appointment) => appointment.appointmentHour
            );

            const filteredAvailableAppointmentHours = timeData.filter(
                (time) => !takenHours.includes(time)
            );

            return res.json({ hours: filteredAvailableAppointmentHours });
        } catch (error) {
            return serverErrorRes(error, res);
        }
    }
);

app.get('/appointments/today', async (req, res) => {
    try {
        const selectAppointmentsStatement = `
            SELECT
                patients.full_name AS "fullName",
                patients.identity_no AS "patientIdentityNo",
                patients.phone_no AS "phoneNum",
                appointments.appointment_id AS "appointmentID",
                appointments.patient_id AS "patientID",
                to_char(appointments.appointment_date, 'YYYY-MM-DD') AS "appointmentDate",
                appointments.appointment_hour AS "appointmentHour",
                to_char(appointments.creation_date, 'YYYY-MM-DD') AS "appointmentCreationDate",
                doctors.doctor_name AS "doctorName",
                doctors.doctor_id AS "doctorID"
            FROM
                patients
            INNER JOIN
                appointments
            ON
                patients.patient_id = appointments.patient_id
            INNER JOIN
                doctors
            ON
                patients.doctor_id = doctors.doctor_id
            WHERE
                appointments.is_deleted = false
            AND
                appointments.appointment_date = CURRENT_DATE
            AND
                patients.is_deleted = false
            AND
                appointments.is_deleted = false
        `;

        const appointmentsQuery = await query(selectAppointmentsStatement);

        console.log('returning today appointments!');

        return res.json(appointmentsQuery.rows);
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.get('/appointments/tomorrow', async (req, res) => {
    try {
        const selectAppointmentsStatement = `
            SELECT
                patients.full_name AS "fullName",
                patients.identity_no AS "patientIdentityNo",
                patients.phone_no AS "phoneNum",
                appointments.appointment_id AS "appointmentID",
                appointments.patient_id AS "patientID",
                to_char(appointments.appointment_date, 'YYYY-MM-DD') AS "appointmentDate",
                appointments.appointment_hour AS "appointmentHour",
                to_char(appointments.creation_date, 'YYYY-MM-DD') AS "appointmentCreationDate",
                doctors.doctor_name AS "doctorName",
                doctors.doctor_id AS "doctorID"
            FROM
                patients
            INNER JOIN
                appointments
            ON
                patients.patient_id = appointments.patient_id
            INNER JOIN
                doctors
            ON
                patients.doctor_id = doctors.doctor_id
            WHERE
                appointments.is_deleted = false
            AND
                appointments.appointment_date = CURRENT_DATE + 1
            AND
                patients.is_deleted = false
            AND
                appointments.is_deleted = false
        `;

        const appointmentsQuery = await query(selectAppointmentsStatement);

        return res.json(appointmentsQuery.rows);
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

/** return available appointments for one patient and a certain date */
app.get('/appointments/available', authenticateToken, async (req, res) => {
    try {
        const { patientID, appointmentDate } = req.query;

        const appointmentsQueryStatement = `
            SELECT
                appointment_id AS "appointmentID",
                patient_id AS "patientID",
                appointment_date AS "appointmentDate",
                appointment_hour AS "appointmentHour"
            FROM
                appointments
            WHERE
                patient_id = $1
            AND
                appointment_date = $2
            AND
                is_deleted = false
        `;

        const appointmentsQuery = await query(appointmentsQueryStatement, [
            patientID,
            appointmentDate,
        ]);

        const takenHours = appointmentsQuery.rows.map(
            (appointment) => appointment.appointmentHour
        );

        const filteredAvailableAppointmentHours = timeData.filter(
            (time) => !takenHours.includes(time)
        );

        return res.json({ hours: filteredAvailableAppointmentHours });
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

const validateAppointmentHour = (input) => {
    if (!timeData.find((time) => time === input)) return false;
    return true;
};

app.post('/appointments/', authenticateToken, async (req, res) => {
    try {
        const { patientID } = req.query;

        const { appointmentDate, appointmentHour } = req.body;

        if (!validateAppointmentHour(appointmentHour))
            return errorRes(res, 'Your appointment hour is invalid', 406);

        const appointmentID = uuid('APM-');

        const appointmentValidationQuery = await query(
            `
                SELECT 
                    * 
                FROM 
                    appointments
                WHERE is_deleted = false AND appointment_hour = $1 AND appointment_date = $2`,
            [appointmentHour, appointmentDate]
        );
        if (appointmentValidationQuery.rowCount)
            return errorRes(res, 'Appointment already taken');

        await insertNewAppointment(
            appointmentID,
            patientID,
            appointmentDate,
            appointmentHour
        );

        return successRes(
            res,
            'Appointment was successfully created',
            undefined,
            201
        );
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.put('/appointments/', authenticateToken, async (req, res) => {
    try {
        const { patientID, appointmentID } = req.query;

        const { appointmentDate, appointmentHour } = req.body;

        if (!validateAppointmentHour(appointmentHour))
            return errorRes(res, 'Your appointment hour is invalid', 406);

        const appointmentValidationQuery = await query(
            `
                SELECT 
                    * 
                FROM 
                    appointments
                WHERE is_deleted = false AND appointment_hour = $1 AND appointment_date = $2`,
            [appointmentHour, appointmentDate]
        );
        if (appointmentValidationQuery.rows.length)
            return errorRes(res, 'Appointment already taken');

        await updateAppointment(
            appointmentID,
            patientID,
            appointmentDate,
            appointmentHour
        );

        return successRes(res, 'Appointment was successfully updated');
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.delete('/appointments/', authenticateToken, async (req, res) => {
    try {
        const { patientID, appointmentID } = req.query;

        const appointmentValidationQuery = await query(
            `
                SELECT 
                    * 
                FROM 
                    appointments
                WHERE is_deleted = false AND appointment_id = $1 AND patient_id = $2`,
            [appointmentID, patientID]
        );
        if (!appointmentValidationQuery.rowCount)
            return errorRes(res, 'Appointment does not exist');

        const deleteAppointmentStatement = `
            UPDATE
                appointments
            SET
                is_deleted = true
            WHERE
                patient_id = $1
            AND
                appointment_id = $2
        `;
        -(await query(deleteAppointmentStatement, [patientID, appointmentID]));

        return successRes(res, 'Appointment was successfully deleted');
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.put(
    '/patients/:patientID/diseases',
    authenticateToken,
    async (req, res) => {
        try {
            const validateDiseasesInput = (reqBody) => {
                for (const key in reqBody) {
                    if (Object.hasOwnProperty.call(reqBody, key)) {
                        /** If the object key begins with 'b' */
                        if (key.split('')[0] === 'b') {
                            if (reqBody[key] < -1 || reqBody > 1) return false;
                        } /** Else if it begins with 'l' */ else if (
                            key.split('')[0] === 'l'
                        ) {
                            reqBody[key].forEach((listItem) => {
                                if (listItem.value < -1 || listItem.value > 1)
                                    return false;
                            });
                        }
                    }
                }
                return true;
            };
            if (!validateDiseasesInput(req.body))
                return errorRes(res, 'Cheeky breeky arent you?');

            const {
                patient_id,
                disease_id,
                b1,
                b2,
                b3,
                b4,
                l1,
                text1,
                text2,
                text3,
                text4,
            } = req.body;

            const patientQueryStatement = `
                SELECT 
                    patients.patient_id, 
                    patient_diseases.disease_id 
                FROM 
                    patient_diseases
                INNER JOIN
                    patients
                ON
                    patients.patient_id = patient_diseases.patient_id
                 WHERE patients.patient_id = $1 AND patient_diseases.disease_id = $2 AND patients.is_deleted = false
            `;
            const patientQuery = await query(patientQueryStatement, [
                patient_id,
                disease_id,
            ]);

            if (!patientQuery.rowCount)
                return errorRes(res, 'patient was not found');

            await updateDiseases(
                patient_id,
                disease_id,
                b1,
                b2,
                b3,
                b4,
                l1,
                text1,
                text2,
                text3,
                text4
            );

            return successRes(res, 'Diseases were successfully updated');
        } catch (error) {
            return serverErrorRes(error, res);
        }
    }
);

app.post(
    '/patients/:patientID/treatments',
    authenticateToken,
    async (req, res) => {
        try {
            const treatmentsArr = req.body;
            const { patientID } = req.params;

            /** Validate the submitted input */
            treatmentsArr.forEach((treatment) => {
                const { name, price, currency } = treatment;

                if (!name.trim() || !price.trim() || !currency.trim())
                    return errorRes(res, 'missing info');
            });

            /** Since 'treatments' adding is configured for database bulk insertion, use below helper function
             * to parse the statement and params */
            const { statement, params, statementLogQuery } =
                buildTreatmentsQuery(treatmentsArr, patientID);

            await insertNewTreatment(statement, statementLogQuery, params);

            return successRes(
                res,
                'Your treatments were added successfully',
                undefined,
                201
            );
        } catch (error) {
            return serverErrorRes(error, res);
        }
    }
);

app.put(
    '/patients/:patientID/treatments/:treatmentID',
    authenticateToken,
    async (req, res) => {
        try {
            const {
                treatmentName,
                treatmentPrice,
                treatmentTeethNo,
                treatmentDescription,
                treatmentDate,
                treatmentPriceCurrency,
            } = req.body;

            const { patientID, treatmentID } = req.params;

            // const treatmentPriceCurrency =
            //     parseSymbolToCurrencyName(treatmentPrice);
            if (!treatmentPriceCurrency)
                return errorRes(res, 'False price input');

            await updateTreatment(
                treatmentName,
                treatmentPrice,
                treatmentPriceCurrency,
                treatmentTeethNo,
                treatmentDescription,
                treatmentDate,
                patientID,
                treatmentID
            );

            return successRes(
                res,
                'Your treatment was modified successfully',
                undefined,
                200
            );
        } catch (error) {
            return serverErrorRes(error, res);
        }
    }
);

app.delete(
    '/patients/:patientID/treatments/:treatmentID',
    authenticateToken,
    async (req, res) => {
        try {
            const { patientID, treatmentID } = req.params;

            const deleteTreatmentStatement = `
                UPDATE
                    patient_treatments
                SET
                    is_deleted = true
                WHERE
                    patient_id = $1
                AND
                    patient_treatment_id = $2
            `;

            await query(deleteTreatmentStatement, [patientID, treatmentID]);

            return successRes(
                res,
                'Your treatment was deleted successfully',
                undefined,
                200
            );
        } catch (error) {
            return serverErrorRes(error, res);
        }
    }
);

app.get('/treatments', authenticateToken, async (req, res) => {
    try {
        const statement = `
            SELECT
                patients.patient_id AS "patientID",
                patients.full_name AS "fullName",
                patients.identity_no AS "identityNo",
                patient_treatments.treatment_name AS "treatmentName",
                patient_treatments.treatment_price AS "treatmentPrice",
                patient_treatments.treatment_price_currency AS "treatmentPriceCurrency",
                to_char(patient_treatments.record_date, 'YYYY-MM-DD') AS "treatmentDate",
                doctors.doctor_name AS "doctorName",
                translators.name AS "translatorName"
            FROM
                patients
            INNER JOIN
                patient_treatments
            ON
                patients.patient_id = patient_treatments.patient_id
            INNER JOIN
                doctors
            ON
                patients.doctor_id = doctors.doctor_id
            LEFT JOIN
                translators
            ON
                translators.translator_id = patients.translator_id
            WHERE
                patient_treatments.is_deleted = false
            AND
                patients.is_deleted = false
        `;
        const patientTreatmentsQuery = await query(statement);
        return res.json(patientTreatmentsQuery.rows);
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.get('/appointments', authenticateToken, async (req, res) => {
    try {
        const statement = `
            SELECT
                patients.patient_id AS "patientID",
                patients.full_name AS "fullName",
                patients.phone_no AS "phoneNum",
                appointments.appointment_hour AS "appointmentHour",
                to_char(appointments.appointment_date, 'YYYY-MM-DD') AS "appointmentDate",
                doctors.doctor_name AS "doctorName",
                translators.name AS "translatorName"
            FROM
                patients
            INNER JOIN
                appointments
            ON
                appointments.patient_id = patients.patient_id
            INNER JOIN
                doctors
            ON
                doctors.doctor_id = patients.doctor_id
            LEFT JOIN
                translators
            ON
                translators.translator_id = patients.translator_id
            WHERE
                appointments.is_deleted = false
            AND
                patients.is_deleted = false
        `;
        const appointmentsQuery = await query(statement);
        return res.json(appointmentsQuery.rows);
    } catch (error) {
        return serverErrorRes(error, res);
    }
});

app.delete('/patients/:patientID', authenticateToken, async (req, res) => {
    try {
        const { patientID } = req.params;

        const statement = `
            UPDATE
                patients
            SET
                is_deleted = true
            WHERE
                patient_id = $1
        `;

        await query(statement, [patientID]);

        return res.json('Your patient was deleted successfully');
    } catch (error) {
        return serverErrorRes(error, res);
    }
});
