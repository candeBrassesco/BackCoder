import jwt from 'jsonwebtoken'
import config from '../config.js'


const JWT_SECRET_KEY = config.JWT_SECRET_KEY

export const jwtValidation = ( req, res, next ) => {
    try {
        const token = req.cookies.token
        console.log(token)
        const response = jwt.verify( token, JWT_SECRET_KEY )
        req.user = response.user
        next()
    } catch (error) {
        res.status(500).json({message: error})
    }
}

export const jwtPassResetVal = ( req, res, next ) => {
    try {
        const token = req.cookies.tokenPassReset
        const response = jwt.verify( token, JWT_SECRET_KEY)
        const tokenExpires = new Date(response.exp * 1000)
        if (Date.now() > tokenExpires) {
            res.status(401).json({ message: 'Expired token' });
        }
        req.user = response.user
        next()
    } catch (error) {
        res.status(500).json({message: error})
    }
}