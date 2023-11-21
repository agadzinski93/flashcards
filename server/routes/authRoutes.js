import express from 'express'
const router = express.Router({caseSensitive:true,strict:false});

import {loginUser,logoutUser,registerUser} from '../controller/authController.js'

router.post("/login",loginUser);
router.get("/logout",logoutUser);
router.post("/register",registerUser);

export default router;