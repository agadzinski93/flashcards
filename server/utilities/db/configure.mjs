import mysql from 'mysql2'
import bluebird from 'bluebird'
let DB;
class MySQLDatabaseConnection {
    #pool;
    constructor() {
        if (process.env.NODE_ENV === 'production') {
            this.#pool = mysql.createPool({
                host:process.env.DB_HOST_PRODUCTION,
                user:process.env.DB_USER_PRODUCTION,
                port:process.env.DB_PORT_PRODUCTION,
                password:process.env.DB_PASSWORD_PRODUCTION,
                database:process.env.DB_DATABASE_PRODUCTION,
                connectionLimit:10,
                waitForConnections:true,
                Promise:bluebird
            });
        }
        else {
            this.#pool = mysql.createPool({
                host:process.env.DB_HOST_DEVELOPMENT,
                port:process.env.DB_PORT_DEVELOPMENT,
                user:process.env.DB_USER_DEVELOPMENT,
                password:process.env.DB_PASSWORD_DEVELOPMENT,
                database:process.env.DB_DATABASE_DEVELOPMENT,
                connectionLimit:10,
                waitForConnections:true,
                Promise:bluebird
            });
        }
    }
    getPool() {return this.#pool;}
    async query(q) {
        let result;
        try {
            const promisePool = this.#pool.promise();
            result = await promisePool.query(q);
        } catch(err) {
            result = {"error":`Query Failed: ${err.message}`};
            console.error(`${new Date().toString()} - DB: ${err.message}`);
        }
        return result;
    }
}

const connectDB = () => {
    if (DB === null || DB === undefined) {
        DB = new MySQLDatabaseConnection();
    }
    return DB;
}

export default connectDB;