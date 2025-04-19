const mysql = require('mysql2');

function dbConnection() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Asdf@1234',
        database: 'everything'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            return null;
        }
        console.log('Successfully connected to database');
    });

    connection.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Database connection was closed. Reconnecting...');
            dbConnection();
        }
    });

    return connection;
}

module.exports = dbConnection;