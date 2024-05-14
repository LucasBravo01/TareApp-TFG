"use strict"

require('dotenv').config()

module.exports = {
    mysqlConfig: { // Conexión BBDD
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    },

    port: process.env.APP_PORT  // Puerto del servidor
}