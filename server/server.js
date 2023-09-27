const express = require('express');
var dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const PORT = 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

if (process.env.NODE_ENV === 'production'){
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname,'frontend/dist')));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'frontend','dist','index.html'));
    });
}else {
    app.get("/",(req,res)=>{res.send("Server running")});
}

app.listen(()=>{
    console.log(`Server running on port ${PORT}`);
});