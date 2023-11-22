const Routes =  {
    getRoutes:async() => {
        try {
            const {default:connectDB} = await import('../utilities/db/configure.mjs');
            const {default:authRoutes} = await import('../routes/authRoutes.mjs');
            return {connectDB,authRoutes};
        } catch(err) {
            console.error(`${new Date().toString()} - AddUser Procedure Failure: ${err.message}`);
        }
        return null;
    }
}
    
module.exports = Routes;