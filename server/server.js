/* const express = require('express');
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

    const fs = require('fs');

    const content = 'Some content!';

    fs.writeFile('/Users/joe/test.txt', content, err => {
    if (err) {
        console.error(err);
    }
    // file written successfully
    });
})
.catch((err)=>{
    console.log(`App Error: ${err.message}`);
    process.exit(1);
}); */

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
    /* Promise.all([import('./utilities/db/configure.mjs'),import('./routes/authRoutes.mjs')])
    .then(([{default:connectDB},{default:authRoutes}])=>{
        let db = connectDB();
        app.use("/api/auth", authRoutes)
        app.get("/api",(req,res)=>res.json({result:"Hello"}));
    })
    .catch((err)=>{
        console.error(`${new Date().toString()} - App Init Error: ${err.message}`);
        process.exit(1);
    }); */

    /* try {
        const {default:connectDB} = await import('./utilities/db/configure.mjs');
        const {default:authRoutes} = await import('./routes/authRoutes.mjs');
        let db = connectDB();
        app.use("/api/auth", authRoutes)
        app.get("/api",(req,res)=>res.json({result:"Hello"}));
    } catch(err) {
        console.error(`${new Date().toString()} - AddUser Procedure Failure: ${err.message}`);
    } */

    const {connectDB,authRoutes} = await getRoutes();

    let db = connectDB();
    app.use("/api/auth", authRoutes)
    app.get("/api",(req,res)=>res.json({result:"Hello"}));

    if (process.env.NODE_ENV === 'production'){
        const __dirname = path.resolve();
        app.use(express.static(path.join(__dirname,'client/dist')));

        app.get('*',(req,res)=>{
            res.sendFile(path.resolve(__dirname,'client','dist','index.html'));
        });
        }else {
            app.get("/",(req,res)=>{res.send("Server running")});
    }
})();

app.listen(PORT,()=>{});