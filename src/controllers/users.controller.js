import userManager from "../dal/dao/mongoManagers/UserManager.js";
import { generateToken, compareData } from "../utils.js";

export const registerUserController = async ( req, res ) => {
    const { first_name, last_name, email, password, age } = req.body
    if(!first_name || !last_name || !email || !password || !age) {
        return res.status(400).json({message:'Some data is missing!'})
    }
    const userExists = await userManager.findUser(email)
    if(userExists) {
        return res.redirect("/api/views/registerError")
    }
    const newUser = await userManager.createUser(req.body)
    const token = generateToken(newUser)
    res.cookie("token", token)
    if (newUser) {
        res.redirect("/api/views/login")
    } else {
        res.redirect("/views/registerError")
    }
}

export const logoutUserController = async ( req, res ) => {
    req.session.destroy(error =>{
        if (error) return res.status(500).json({message: "Error login out"})
        res.clearCookie("token");
        res.redirect('/api/views/login')
    })
}

// si no se usa passport para el login
export const loginUserController = async ( req, res ) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({message:'Some data is missing!'})
    }

    const user = await userManager.findUser(email)
    if(!user){
        return res.redirect("/api/views/loginError")
    }

    const isPasswordValid = await compareData(password,user.password)
  
    if(!isPasswordValid){
        return res.redirect("/api/views/loginError")
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name} `,
        email: `${user.email}`,
        age: `${user.age}`,
        role: `${user.role}`
    }

    res.redirect('/products')
}

export const loginViewController = ( req, res ) => {
    res.render("login")
}

export const registerViewController = ( req, res ) => {
    res.render("register")
}

export const profileViewController = ( req, res ) => {
    res.render("profile",{
        user: req.session.user
    })
}

export const registerErrorViewController = ( req, res ) => {
    res.render("registerError")
}

export const loginErrorViewController = ( req, res ) => {
    res.render("loginError")
}