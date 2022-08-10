const { Client } = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "BazliNabil97",
    database: "webDB"
})

module.exports = client