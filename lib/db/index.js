const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'mysecretpassword',
    port: 5432,
    database: 'dental-clinic',
    max: 20,
    connectionTimeoutMillis: 2000,
})

module.exports = {
    pool,
    query: async (text, params) => {
        const res = await pool.query(text, params);
        return res;
    },
};
