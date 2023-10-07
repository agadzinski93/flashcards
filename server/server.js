const express = require('express');
let dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const connectDB = require('./utilities/db/configure');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

let db = connectDB();

app.get("/api",(req,res)=>res.json({result:"Hello"}));
app.get("/api/test",async (req,res)=>{
    let result = await db.query(`SELECT count(username) FROM users;`);
    console.log(result);
    res.send("Test");
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