export const config = !process.env.JAWSDB_URL ?{
    dbHost: 'localhost',
    dbUser: 'root',
    dbPassword: '',
    dbDatabase: 'database',
}
: {
    dbHost: process.env.JAWSDB_HOST,
    dbUser: process.env.JAWSDB_USER,
    dbPassword: process.env.JAWSDB_PASSWORD,
    dbDatabase: process.env.JAWSDB_DATABASE,
};