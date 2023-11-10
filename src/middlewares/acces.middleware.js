export const privateAcces = (req,res,next) => {
    const {user} = req
    if(!user) return res.redirect('/api/views/login');
    next();
}