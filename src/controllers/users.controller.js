import nodemailer from "nodemailer";
import userManager from "../dal/dao/mongoManagers/UserManager.js";
import { generateToken, compareData, hashData } from "../utils.js";

export const registerUserController = async ( req, res ) => {
    const { first_name, last_name, email, password, age, premium } = req.body
    if (!first_name || !last_name || !email || !password || !age) {
        return res.status(400).json({message:'Some data is missing!'})
    }
    const userExists = await userManager.findUser(email)
    if (userExists) {
        return res.redirect("/api/views/registerError")
    }
    const role = premium ? "premium" : "user"
    const userDB = await userManager.createUser({...req.body, role})
    const token = generateToken(userDB)
    res.cookie("token", token)
    if (userDB) {
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

export const resetPasswordController = async ( req, res ) => {
    const {email} = req.body
    const userExists = await userManager.findUser({email})
    if (!user) {
        return res.status(400).json({message:'User not found'})
    }
    const token = generateToken()
    const expires = new Date(Date.now() + 3600000);

    res.cookie("passwordResetToken", token, { expires: expires });

    const transporter = nodemailer.createTransport({

    })
}

export const changeRolFormController = async ( req, res ) => {
    const {uid} = req.params
    const roleChanged = await userManager.updateRole(uid)
    res.status(200).json({message: "User updated"})
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

    res.redirect('/products')
}

export const loginViewController = ( req, res ) => {
    res.render("login")
}

export const registerViewController = ( req, res ) => {
    res.render("register")
}

export const profileViewController = async ( req, res ) => {
    const {user} = req
    const userLogged = await userManager.findUser(user.email)
    let changeRole = "premium"
    if(user.role === "premium") {
        changeRole = "user"
    }
    res.render("profile",{
        user: userLogged.toObject(), role: changeRole
    })
}

export const registerErrorViewController = ( req, res ) => {
    res.render("registerError")
}

export const loginErrorViewController = ( req, res ) => {
    res.render("loginError")
}

export const resetPassViewController = ( req, res ) => {
    res.render("resetPass")
}