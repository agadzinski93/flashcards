"use strict"
const express = require('express');
const closeApp = require('./utilities/closeApp');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const PORT = process.env.PORT || 5000;
const helmet = require('helmet');
const logger = require('pino-http');
const cookieParser = require('cookie-parser');
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'secret'

const {addRoutes} = require('./utilities/init');

const app = express();
    
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(COOKIE_SECRET));

//Web Content Policy and CORS
app.use(helmet({
    contentSecurityPolicy:{
      useDefaults:true,
      directives:{
        imgSrc:["'self'"],
        scriptSrc:["'self'","unsafe-inline"],
      }
    },
}));

;(async () => {
    try {
        await addRoutes(app);
    } catch(err) {
        console.error(`${new Date().toString()} -> App Init Failure: ${err.stack}`);
        process.exit(1);
    }
})();

app.get('/_health',(req,res)=>{
    res.status(200).send('App is running');
});

if (process.env.NODE_ENV === 'production'){
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname,'client/dist')));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','dist','index.html'));
    });
}else {
    app.get("/",(req,res)=>{res.send("Server running")});
}

const server = app.listen(PORT,()=>{});

const exitHandler = closeApp(server, {
    coredump:false,
    timeout:500
});

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));