const db = require('./lib/db');

const statement = `
CREATE TABLE patient_treatments (
    patient_treatment_id VARCHAR(255) PRIMARY KEY,
    patient_id VARCHAR(255),
    treatment_name TEXT,
    treatment_price NUMERIC,
    treatment_price_currency TEXT,
    teeth_num INTEGER,
    treatment_description TEXT,
    record_date TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE patient_treatments_log (
    patient_treatment_id VARCHAR(255),
    patient_id VARCHAR(255),
    treatment_name TEXT,
    treatment_price NUMERIC,
    treatment_price_currency TEXT,
    teeth_num INTEGER,
    treatment_description TEXT,
    record_date TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE patients (
    patient_id VARCHAR(255) PRIMARY KEY,
    full_name TEXT,
    identity_no TEXT,
    gender CHAR(1),
    birth_date DATE,
    phone_no TEXT,
    address TEXT,
    translator_id INTEGER,
    doctor_id INTEGER,
    description TEXT,
    record_date TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE patients_log (
    patient_id VARCHAR(255),
    full_name TEXT,
    identity_no TEXT,
    gender CHAR(1),
    birth_date DATE,
    phone_no TEXT,
    address TEXT,
    translator_id INTEGER,
    doctor_id INTEGER,
    description TEXT,
    record_date TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE patient_diseases (
    patient_id VARCHAR(255),
    disease_id VARCHAR(255) PRIMARY KEY,
    b1 INTEGER,
    b2 INTEGER,
    b3 INTEGER,
    b4 INTEGER,
    l1 TEXT,
    text1 TEXT,
    text2 TEXT,
    text3 TEXT,
    text4 TEXT,
    record_date TIMESTAMP,
    additional_info TEXT,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE patient_diseases_log (
    patient_id VARCHAR(255),
    disease_id VARCHAR(255),
    b1 INTEGER,
    b2 INTEGER,
    b3 INTEGER,
    b4 INTEGER,
    l1 TEXT,
    text1 TEXT,
    text2 TEXT,
    text3 TEXT,
    text4 TEXT,
    record_date TIMESTAMP,
    additional_info TEXT,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE appointments (
    appointment_id VARCHAR(255) PRIMARY KEY,
    patient_id VARCHAR(255),
    appointment_date DATE,
    appointment_hour VARCHAR(5),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE appointments_log (
    appointment_id VARCHAR(255),
    patient_id VARCHAR(255),
    appointment_date DATE,
    appointment_hour VARCHAR(5),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    doctor_name TEXT,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE translators (
    translator_id SERIAL PRIMARY KEY,
    name TEXT,
    phone_number TEXT,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE credentials (
    username TEXT PRIMARY KEY,
    password TEXT
);
`;

db.query(statement)
    .then(() => {
        console.log('Tables created successfully');
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
    });
