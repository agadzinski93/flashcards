import {
    getUser,
    usernameOrEmailExists,
    addUser} from '../utilities/helpers/userHelpers.mjs'
import AppError from "../utilities/validators/AppError.mjs";
import { ApiResponse } from '../utilities/ApiResponse.mjs';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

const loginUser = async (req,res) => {
    const {username,password} = req.body;
    const output = new ApiResponse('error','Database Error.');
    let result = await getUser(username);
    if (!(result instanceof AppError)) {
        if (result === "error") {
            output.setMessage = "Username or email is incorrect.";
        }
        else {
            if (!(await bcrypt.compare(password,result.password))) {
                output.setMessage = "Username or email is incorrect.";
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
                output.setApiResponse('success','Successfully Logged In',{token});
            }
        }
    }
    res.json(output.getApiReponse());
}
const logoutUser = (req,res) => {
    const output = new ApiResponse('success','Logged Out User');
    res.clearCookie('token');
    res.json(output.getApiReponse());
}
const registerUser = async (req,res) => {
    const {username,email,password,confirmPassword} = req.body;
    const output = new ApiResponse('error','Database Error.');

    if (password !== confirmPassword) {
        output.setMessage = 'Passwords do not match.';
    }
    else {
        let result = await usernameOrEmailExists(username,email);
        
        if (!(result instanceof AppError)) {
            if (result === 1) {
                output.setMessage = 'Username or email already exists.';
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
                    output.setApiResponse('success','Successfully Registered User',{token});
                }
                else {
                    output.setMessage = result.message;
                }
            }
        }
    }
    res.json(output.getApiReponse());
}

export {loginUser,logoutUser,registerUser};