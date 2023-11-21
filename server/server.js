import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import path from 'path'
const PORT = process.env.PORT || 5000;
import cookieParser from 'cookie-parser'
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'secret'
import connectDB from './utilities/db/configure.js';
import authRoutes from './routes/authRoutes.js'

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