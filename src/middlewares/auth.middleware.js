export const authMiddleware = role => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(401).json('You are not authorized')
        }
        next()
    }
}