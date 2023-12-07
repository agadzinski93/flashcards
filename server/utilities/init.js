const Routes =  {
    addRoutes:async(app) => {
        try {
            let {router : authRoutes} = await import('../routes/authRoutes.mjs');
            app.use("/api/auth", authRoutes);

            app.all("*", async (req, res, next) => {
                let AppError = await import('./validators/AppError.mjs');
                return next(new AppError(404, "Page Not Found"));
            });
        
        } catch(err) {
            console.error(`${new Date().toString()} -> Import Routes Failed: ${err.message}`);
        }
        return null;
    }
}
    
module.exports = Routes;