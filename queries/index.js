const { serverErrorRes, generateDiseaseID } = require('../helpers');
const { pool } = require('../lib/db');

module.exports = {
    insertNewPatient: async (
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
    ) => {
        const client = await pool
            .connect()
            .catch((err) => serverErrorRes(err.stack, res));

        try {
            await client.query('BEGIN');

            const insertPatientRecordStatement = `
                INSERT INTO patients (
                    patient_id,
                    full_name,
                    identity_no,
                    gender,
                    birth_date,
                    phone_no,
                    address,
                    translator_id,
                    doctor_id,
                    description,
                    record_date
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11
                )
            `;

            const diseaseID = generateDiseaseID();

            await client.query(insertPatientRecordStatement, [
                patientID,
                fullName,
                identityNo,
                gender === 'female' ? 'F' : 'M',
                birthDate,
                phoneNo,
                address,
                translatorID,
                doctorID,
                extraDetails,
                recordDate,
            ]);

            const insertPatientLogRecordStatement = `
                INSERT INTO patients_log (
                    patient_id,
                    full_name,
                    identity_no,
                    gender,
                    birth_date,
                    phone_no,
                    address,
                    translator_id,
                    doctor_id,
                    description,
                    record_date
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11
                )
            `;

            await client.query(insertPatientLogRecordStatement, [
                patientID,
                fullName,
                identityNo,
                gender === 'female' ? 'F' : 'M',
                birthDate,
                phoneNo,
                address,
                translatorID,
                doctorID,
                extraDetails,
                recordDate,
            ]);

            const insertPatientDiseasesRecordStatement = `
                INSERT INTO
                    patient_diseases
                VALUES ($1, $2, -1, -1, -1, -1, $3, '', '', '', '', $4)
            `;
            await client.query(insertPatientDiseasesRecordStatement, [
                patientID,
                diseaseID,
                JSON.stringify([
                    {
                        key: 'l1-1',
                        value: -1,
                    },
                    {
                        key: 'l1-2',
                        value: -1,
                    },
                    {
                        key: 'l1-3',
                        value: -1,
                    },
                    {
                        key: 'l1-4',
                        value: -1,
                    },
                ]),
                new Date(),
            ]);

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    updatePatientInfo: async (
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
    ) => {
        const client = await pool
            .connect()
            .catch((err) => serverErrorRes(err.stack, res));

        try {
            await client.query('BEGIN');

            const updatePatientStatement = `
                UPDATE patients
                SET
                    full_name = $1,
                    record_date = $2,
                    description = $3,
                    identity_no = $4,
                    gender = $5,
                    birth_date = $6,
                    phone_no = $7,
                    address = $8,
                    translator_id = $9,
                    doctor_id = $10
                WHERE
                    patient_id = $11
            `;
            await client.query(updatePatientStatement, [
                fullName,
                recordDate,
                extraDetails,
                identityNo,
                gender === 'female' ? 'F' : 'M',
                birthDate,
                phoneNo,
                address,
                translatorID,
                doctorID,
                patientID,
            ]);

            const insertPatientLogStatement = `
                INSERT INTO patients_log (
                    patient_id,
                    full_name,
                    identity_no,
                    gender,
                    birth_date,
                    phone_no,
                    address,
                    translator_id,
                    doctor_id,
                    description,
                    record_date
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11
                )
            `;

            await client.query(insertPatientLogStatement, [
                patientID,
                fullName,
                identityNo,
                gender === 'female' ? 'F' : 'M',
                birthDate,
                phoneNo,
                address,
                translatorID,
                doctorID,
                extraDetails,
                recordDate,
            ]);

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    insertNewAppointment: async (
        appointmentID,
        patientID,
        appointmentDate,
        appointmentHour
    ) => {
        const client = await pool
            .connect()
            .catch((err) => serverErrorRes(err.stack, res));

        try {
            await client.query('BEGIN');

            const insertAppointmentStatement = `
                INSERT INTO
                    appointments (
                        appointment_id,
                        patient_id,
                        appointment_date,
                        appointment_hour
                    ) VALUES (
                        $1, $2, $3, $4
                    )
            `;

            await client.query(insertAppointmentStatement, [
                appointmentID,
                patientID,
                appointmentDate,
                appointmentHour,
            ]);

            const insertAppointmentLogStatement = `
                INSERT INTO
                    appointments_log (
                        appointment_id,
                        patient_id,
                        appointment_date,
                        appointment_hour
                    ) VALUES (
                        $1, $2, $3, $4
                    )
            `;

            await client.query(insertAppointmentLogStatement, [
                appointmentID,
                patientID,
                appointmentDate,
                appointmentHour,
            ]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    updateAppointment: async (
        appointmentID,
        patientID,
        appointmentDate,
        appointmentHour
    ) => {
        const client = await pool
            .connect()
            .catch((err) => serverErrorRes(err.stack, res));
        try {
            await client.query('BEGIN');

            const updateAppointmentStatement = `
                UPDATE
                    appointments
                SET
                    appointment_date = $1,
                    appointment_hour = $2
                WHERE
                    patient_id = $3
                AND
                    appointment_id = $4
                AND
                    is_deleted = false
            `;

            await client.query(updateAppointmentStatement, [
                appointmentDate,
                appointmentHour,
                patientID,
                appointmentID,
            ]);

            const insertAppointmentLogStatement = `
                INSERT INTO
                    appointments_log (
                        appointment_id,
                        patient_id,
                        appointment_date,
                        appointment_hour
                    ) VALUES (
                        $1, $2, $3, $4
                    )
            `;

            await client.query(insertAppointmentLogStatement, [
                appointmentID,
                patientID,
                appointmentDate,
                appointmentHour,
            ]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    updateDiseases: async (
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
    ) => {
        const client = await pool
            .connect()
            .catch((err) => serverErrorRes(err.stack, res));
        try {
            await client.query('BEGIN');

            const updateDiseasesStatement = `
                UPDATE
                    patient_diseases
                SET
                    b1 = $1,
                    b2 = $2,
                    b3 = $3,
                    b4 = $4,
                    l1 = $5,
                    text1 = $6,
                    text2 = $7,
                    text3 = $8,
                    text4 = $9
                WHERE
                    patient_id = $10
                AND
                    disease_id = $11
            `;

            await client.query(updateDiseasesStatement, [
                b1,
                b2,
                b3,
                b4,
                JSON.stringify(l1),
                text1,
                text2,
                text3,
                text4,
                patient_id,
                disease_id,
            ]);
            
            const insertPatientDiseasesRecordStatement = `
                INSERT INTO
                    patient_diseases_log (
                        patient_id,
                        disease_id,
                        b1,
                        b2,
                        b3,
                        l1,
                        text1,
                        text2,
                        text3,
                        text4,
                        record_date,
                        b4
                    )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `;
            await client.query(insertPatientDiseasesRecordStatement, [
                patient_id,
                disease_id,
                b1,
                b2,
                b3,
                JSON.stringify(l1),
                text1,
                text2,
                text3,
                text4,
                new Date(),
                b4,
            ]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    insertNewTreatment: async (statement, statementLogQuery, params) => {
        const client = await pool
            .connect()
            .catch((err) => serverErrorRes(err.stack, res));
        try {
            await client.query('BEGIN');

            await client.query(statement, params);
            await client.query(statementLogQuery, params);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    parseSymbolToCurrencyName: (price) => {
        const parsePrice = (price) => {
            const splitArr = price.split('');
            let res = '';
            splitArr.forEach((split) => {
                if (isNaN(split)) res = res + split;
            });
            return res;
        };
        const symbol = parsePrice(price);

        switch (symbol) {
            case 'TL':
                return 'lira';
            case '$':
                return 'dollar';
            case '€':
                return 'euro';
            default:
                return false;
        }
    },

    updateTreatment: async (
        treatmentName,
        treatmentPrice,
        treatmentPriceCurrency,
        treatmentTeethNo,
        treatmentDescription,
        treatmentDate,
        patientID,
        treatmentID
    ) => {
        const client = await pool
            .connect()
            .catch((err) => serverErrorRes(err.stack, res));
        try {
            await client.query('BEGIN');

            const updateTreatmentStatement = `
                UPDATE
                    patient_treatments
                SET
                    treatment_name = $1,
                    treatment_price = $2,
                    treatment_price_currency = $3,
                    teeth_num = $4,
                    treatment_description = $5,
                    record_date = $6
                WHERE
                    patient_id = $7
                AND
                    patient_treatment_id = $8
                AND
                    is_deleted = false
            `;
            await client.query(updateTreatmentStatement, [
                treatmentName,
                treatmentPrice,
                treatmentPriceCurrency,
                treatmentTeethNo,
                treatmentDescription,
                treatmentDate,
                patientID,
                treatmentID,
            ]);

            const insertTreatmentRecordStatement = `
                INSERT INTO
                    patient_treatments_log (
                        treatment_name,
                        treatment_price,
                        treatment_price_currency,
                        teeth_num,
                        treatment_description,
                        record_date,
                        patient_id,
                        patient_treatment_id
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;

            await client.query(insertTreatmentRecordStatement, [
                treatmentName,
                treatmentPrice,
                treatmentPriceCurrency,
                treatmentTeethNo,
                treatmentDescription,
                treatmentDate,
                patientID,
                treatmentID,
            ]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
};
