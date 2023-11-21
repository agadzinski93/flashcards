const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'secret'
Promise.all([import('./utilities/db/configure.mjs'),import('./routes/authRoutes.mjs')])
.then(([{default:connectDB},{default:authRoutes}])=>{
    const app = express();
    
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(cookieParser(COOKIE_SECRET));

    let db = connectDB();

    app.use("/api/auth", authRoutes)

    app.get("/api",(req,res)=>res.json({result:"Hello"}));
    app.get("/api/test",async (req,res)=>{
        let result = await db.query(`SELECT count(username) FROM users;`);
        console.log(result);
        res.send("Testing");
    })

    if (process.env.NODE_ENV === 'production'){
        const __dirname = path.resolve();
        app.use(express.static(path.join(__dirname,'client/dist')));

        app.get('*',(req,res)=>{
            res.sendFile(path.resolve(__dirname,'client','dist','index.html'));
        });
    }else {
        app.get("/",(req,res)=>{res.send("Server running")});
    }

    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err)=>{
    console.log(`App Error: ${err.message}`);
});