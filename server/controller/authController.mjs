import {
    getUser,
    usernameOrEmailExists,
    addUser} from '../utilities/helpers/userHelpers.mjs'
import AppError from "../utilities/validators/AppError.mjs";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

const loginUser = async (req,res) => {
    const {username,password} = req.body;
    let output = {response:'error',message:'Database Error.'};
    let result = await getUser(username);
    if (!(result instanceof AppError)) {
        if (result === "error") {
            output.message = "Username or email is incorrect.";
        }
        else {
            if (!(await bcrypt.compare(password,result.password))) {
                output.message = "Username or email is incorrect.";
            }
            else {
                const {email} = result;
                const user = {username,email};
                const token = jwt.sign(user,process.env.COOKIE_SECRET,{expiresIn:"1hr"});
                res.cookie("token",token,{
                    httpOnly:true,
                    secure: (process.env.NODE_ENV === 'production') ? true : false,
                    maxAge: Math.floor(Date.now() / 1000) + (60 * 60),
                    sameSite:'Strict',
                    signed:true
                });
                output = {response:'success',message:'Successfully Logged In',data:{token}};
            }
        }
    }
    res.json(output);
}
const logoutUser = (req,res) => {
    res.clearCookie('token');
    res.json({response:'success',message:'Logged Out User'});
}
const registerUser = async (req,res) => {
    const {username,email,password,confirmPassword} = req.body;
    let output = {response:'error',message:'Database Error.'};

    if (password !== confirmPassword) {
        output = {response:'error',message:'Passwords do not match.'};
    }
    else {
        let result = await usernameOrEmailExists(username,email);
        
        if (!(result instanceof AppError)) {
            if (result === 1) {
                output = {response:'error',message:'Username or email already exists.'};
            }
            else {
                const salt = bcrypt.genSaltSync(SALT_ROUNDS);
                const hash = bcrypt.hashSync(password,salt);
                
                result = await addUser(username,email,hash);
                if (!(result instanceof AppError)) {
                    const user = {username,email};
                    const token = jwt.sign(user,process.env.COOKIE_SECRET);
                    res.cookie("token",token,{
                        httpOnly:true,
                        secure: (process.env.NODE_ENV === 'production') ? true : false,
                        maxAge: Math.floor(Date.now() / 1000) + (60 * 60),
                        sameSite:'Lax',
                        signed:true
                    });
                    output = {response:'success',message:'Successfully Registered User',data:{token}};
                }
                else {
                    output = {response:'error',message:result.message};
                }
            }
        }
    }
    res.json(output);
}

export {loginUser,logoutUser,registerUser};