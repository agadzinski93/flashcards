import AppError from '../validators/AppError.mjs';
import connectDB from '../db/configure.mjs';

const getUser = async (username) => {
    let output = null;
    try {
        const db = await connectDB();
        const result = await db.query(`SELECT username,email,password FROM users WHERE username = '${username}'`);
        if (!result[0][0]) {
            output = "error"; //No user with given username
        }
        else {
            output = result[0][0];
        }
    }catch(err) {
        output = new AppError(500,"Error Retrieving User Data");
    }
    return output;
}

const addUser = async (username,email,password) => {
    let status = 500;
    let msg;
    let output;
    try {
        const db = connectDB();
        const result = await db.query(`CALL registerUser('${username}','${email}','${password}')`);
        if (result?.error) {
            console.error(`${new Date().toString()} - AddUser Procedure Failure: ${result.error}`);
            output = new AppError(500,"Registration Procedure Failed.");
        }
        else {
            output = true;
        }
    } catch(err) {
        console.error(`${new Date().toString()} - AddUser: ${err.message}`);
        msg = err.message;
        output = new AppError(status,msg);
    }
    return output;
}

const usernameOrEmailExists = async (username,email) => {
    try {
        const db = await connectDB();
        const result = await db.query(`CALL usernameOrEmailExists('${username}','${email}')`);
        return result[0][0][0].output;
    } catch(err) {
        return new AppError(500,"Error Checking Username and Email");
    }
}

export {getUser,usernameOrEmailExists,addUser};