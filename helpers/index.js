const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/**
 * @returns unique ID
 * @param {String} beginingPad an optional string to add to the begining of the uuid
 * @param {String} endPad an optional string to add to the end of the uuid
 */
const uuid = (beginingPad = '', endPad = '') => {
    return `${beginingPad}${uuidv4()}${endPad}`;
};

const generateDiseaseID = () => {
    return uuid('DIS-');
};

module.exports = {
    generateAccessToken: (payload = { success: true }) => {
        return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '4h' });
    },
    /**
     * @param {String} token the JWT to be verified
     * @returns {Object} an object with information from the decoded JWT, if the JWT is unverified
     * it returns OBJECT {userID: undefined}
     */
    decodeToken: (token) => {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            return decodedToken;
        } catch (error) {
            return null;
        }
    },

    uuid,

    successRes: (res, message, rest, code = 200) => {
        return res.status(code).json({
            message,
            ...rest,
        });
    },

    errorRes: (res, message, code = 400) => {
        return res.status(code).json(message);
    },

    serverErrorRes: (error, res, message = 'server error', code = 500) => {
        const errorID = uuid('ERR-');

        console.error(error);
        console.error(`Above error ID is: '${errorID}'`);

        return res.status(code).json(`error: ${message} \n ID ${errorID}`);
    },

    timeData: [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
    ],

    buildTreatmentsQuery: (treatments, patientID) => {
        let statementQuery = `
            INSERT INTO
                patient_treatments (
                    treatment_name,
                    treatment_price,
                    treatment_price_currency,
                    teeth_num,
                    treatment_description,
                    record_date,
                    patient_id,
                    patient_treatment_id
                ) VALUES 

        `;

        let statementLogQuery = `
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
                ) VALUES 
        `;

        let result = '';
        let paramCounter = 0;
        let params = [];

        treatments.forEach((treatment) => {
            const treatmentID = uuid('TRT-');

            result =
                result +
                ` ($${paramCounter + 1}, $${paramCounter + 2}, $${
                    paramCounter + 3
                }, $${paramCounter + 4}, $${paramCounter + 5}, $${
                    paramCounter + 6
                }, $${paramCounter + 7}, $${paramCounter + 8}), `;

            params.push([
                treatment.name,
                treatment.price,
                treatment.currency,
                treatment.teethNum,
                treatment.description,
                treatment.date,
                patientID,
                treatmentID,
            ]);

            paramCounter = paramCounter + 8;
        });

        params = params.flat();
        result = result.substring(0, result.length - 2);
        statementLogQuery = statementLogQuery + result;
        result = statementQuery + result;

        return { params, statement: result, statementLogQuery };
    },

    generateDiseaseID,

    /** UNUSED IMPLEMENTATION */
    // generateNewPatientDiseasesRecords: (diseases) => {
    //     let booleanDiseases = [];
    //     let listDiseases = [];

    //     diseases.forEach((disease) => {
    //         const diseaseID = generateDiseaseID();

    //         /** If dbKey begins with 'b' */
    //         if (disease.dbKey.split('')[0] === 'b') {
    //             booleanDiseases.push(`(${diseaseID}, ${disease.dbKey}, -1)`);
    //         } else if (disease.dbKey.split('')[0] === 'l') {
    //             listDiseases.push(`(${diseaseID}, ${disease.dbKey}, -1)`);
    //         }
    //     });
    // },
};
