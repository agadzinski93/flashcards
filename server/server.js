const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'secret'

const {getRoutes} = require('./routes/Routes');

const app = express();
    
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(COOKIE_SECRET));

app.get("/api",(req,res)=>res.json({result:"Hello"}));

;(async () => {
    try {
        const {connectDB,authRoutes} = await getRoutes();

        let db = connectDB();
        app.use("/api/auth", authRoutes)
        app.get("/api",(req,res)=>res.json({result:"Hello"}));

    } catch(err) {
        console.error(`${new Date().toString()} - App Init Failure: ${err/message}`);
        process.exit(1);
    }
})();

if (process.env.NODE_ENV === 'production'){
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname,'client/dist')));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','dist','index.html'));
    });
    }else {
        app.get("/",(req,res)=>{res.send("Server running")});
}

app.listen(PORT,()=>{});