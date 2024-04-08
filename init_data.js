const db = require('./lib/db')

const statement = `
INSERT INTO credentials (username, password) VALUES ('test', 'test');
INSERT INTO doctors (doctor_name, is_deleted) VALUES ('Dr. John Doe', false);
INSERT INTO doctors (doctor_name, is_deleted) VALUES ('Dr. Jane Doe', false);
INSERT INTO translators (name, phone_number, is_deleted) VALUES ('Translator 1', '1234567890', false);
INSERT INTO translators (name, phone_number, is_deleted) VALUES ('Translator 2', '0987654321', false);
`

db.query(statement).then(() => {
    console.log('data inserted successfully')
    process.exit(0)
}).catch((err) => {
    console.log(err)
})