import {createConnection} from "mysql2/promise";
import {config} from "../config/config";

export const pool = process.env.JAWSDB_URL ? createConnection(process.env.JAWSDB_URL) :
    createConnection({
        host: config.dbHost,
        user: config.dbUser,
        database: config.dbDatabase,
        password: config.dbPassword,
        namedPlaceholders: true,
        decimalNumbers: true,
    });