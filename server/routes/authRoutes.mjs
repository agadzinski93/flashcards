import express from 'express'
const router = express.Router({caseSensitive:true,strict:false});

import {loginUser,logoutUser,registerUser} from '../controller/authController.mjs';

router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/register",registerUser);

export {router};