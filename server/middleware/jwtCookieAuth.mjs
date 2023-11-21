import jwt from 'jwt';

const verifyJwtCookie = (req,res,next) => {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.COOKIE_SECRET);
        req.user = user;
        next();
    } catch(err) {
        res.clearCookie('token');
        res.json({response:'error',message:'Failed to Authenticate User'});
    }
}

export {verifyJwtCookie};