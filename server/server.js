const express = require('express');
const path = require('path');
const PORT = 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,'frontend/dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'frontend','dist','index.html'));
});

app.listen(()=>{
    console.log(`Server running on port ${PORT}`);
});