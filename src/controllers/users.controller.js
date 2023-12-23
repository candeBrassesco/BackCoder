import { usersModel } from "../dal/db/models/users.models.js";
import { generateToken, compareData } from "../utils.js";
import { transporter } from "../nodemailer.js";
import userManager from "../dal/dao/mongoManagers/UserManager.js";
import SessionDTO from "../dal/dto/sessions.dto.js";
import logger from "../winston.js";

// register without passport
export const registerUserController = async (req, res) => {
    const { first_name, last_name, email, password, age, premium } = req.body
    if (!first_name || !last_name || !email || !password || !age) {
        return res.status(400).json({ message: 'Some data is missing!' })
    }
    const userExists = await userManager.findUser(email)
    if (userExists) {
        return res.redirect("/api/views/registerError")
    }
    const role = premium ? "premium" : "user"
    const userDB = await userManager.createUser({ ...req.body, role })
    const token = generateToken(userDB)
    res.cookie("token", token)
    if (userDB) {
        res.redirect("/api/views/login")
    } else {
        res.redirect("/views/registerError")
    }
}

// get all users
export const getUsersController = async (req, res) => {
    try {
        const { limit = 20, page = 1, ...query } = req.query
        const users = await userManager.getUsers(limit, page, query)
        const usersList = users.payload.map(user => {
            const userDTO = new SessionDTO(user)
            const eachUser = {
                name: userDTO.name,
                mail: userDTO.mail,
                role: userDTO.role
            }
            return eachUser
        })
        res.status(200).json({ usersList })
    } catch (error) {
        res.status(500).json({ error })
    }
}

// login without passport
export const loginUserController = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'Some data is missing!' })
    }
    const user = await userManager.findUser(email)
    console.log(user)
    if (!user) {
        return res.redirect("/api/views/loginError")
    }
    const isPasswordValid = await compareData(password, user.password)
    if (!isPasswordValid) {
        return res.redirect("/api/views/loginError")
    }
    const now = new Date()
    await usersModel.updateOne({ _id: user._id }, { $set: { last_connection: now } })
    res.redirect('/products')
}

// logout (session destroy)
export const logoutUserController = async (req, res) => {
    const { user } = req
    const newDate = await userManager.changeLastConnection(user.email)
    req.session.destroy(error => {
        if (error) return res.status(500).json({ message: "Error login out" })
        res.clearCookie("token");
        res.redirect('/api/views/login')
    })
}

// send email to reset password
export const resetPasswordController = async (req, res) => {
    const { email } = req.body;
    const userExists = await userManager.findUser(email);
    if (!userExists) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const token = generateToken(userExists);
    const sendEmailAndCookie = async () => {
        const cookieOptions = {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
            secure: true,
        };
        res.cookie("tokenPassReset", token, cookieOptions);
        const messagesOpt = {
            from: "coderback99@gmail.com",
            to: email,
            subject: "Password reset",
            html: '<a href="http://localhost:8080/api/views/changePass">Click here to change your password!</a>',
        };
        try {
            await transporter.sendMail(messagesOpt);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error sending email" });
        }
    };
    try {
        await sendEmailAndCookie();
        res.send("Email sent");
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: error });
    }
};

// update users' password
export const changePassController = async (req, res) => {
    const { email, newPassword, repeatPassword } = req.body
    const userExists = await userManager.findUser(email)
    const actPass = await compareData(newPassword, userExists.password)
    if (!userExists) {
        res.status(400).json({ message: 'User not found' })
    }
    if (actPass) {
        res.status(500).json({ message: 'Error. New password must be different from the actual one.' })
    }
    const passChanged = await userManager.changePass(email, newPassword, repeatPassword)
    res.send('Password changed')
}

// change users' role 
export const changeRolFormController = async (req, res) => {
    const { uid } = req.params
    const roleChanged = await userManager.updateRole(uid)
    res.status(200).json({ message: "User updated" })
}

// delete user (only used on supertest)
export const deleteUserforTestController = async (req, res) => {
    const { email } = req.body
    const userDeleted = await userManager.deleteUser(email)
    res.status(200).json({ message: "User deleted" })
}

// delete user
export const deleteUserController = async (req,res) => {
    const {mail} = req.params
    console.log(mail)
    const userExists = await userManager.findUser(mail)
    if (!userExists) {
        res.status(400).json({ message: 'User not found' })
    }
    const sendEmailAndCookie = async () => {
        const messagesOpt = {
            from: "coderback99@gmail.com",
            to: mail,
            subject: "User deleted",
            html: `<p> Dear ${mail}: Your user has been deleted due to inactivity.</p>`,
        };
        try {
            await transporter.sendMail(messagesOpt);
        } catch (error) {
            logger.error(error);
            res.status(500).json({ message: "Error sending email" });
        }
    }
    try {
        await sendEmailAndCookie()
        const userDeleted = await userManager.deleteUser(mail)
        res.send(`User ${mail} deleted`)
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: error })
    }  
}

// login handlebars view
export const loginViewController = (req, res) => {
    res.render("login")
}

// register handlebars view
export const registerViewController = (req, res) => {
    res.render("register")
}

// profile handlebars view
export const profileViewController = async (req, res) => {
    const { user } = req
    const userLogged = await userManager.findUser(user.email)
    let changeRole = "premium"
    if (user.role === "premium") {
        changeRole = "user"
    }
    res.render("profile", {
        user: userLogged.toObject(), role: changeRole
    })
}

// error on register view
export const registerErrorViewController = (req, res) => {
    res.render("registerError")
}

// error on login handlebars view
export const loginErrorViewController = (req, res) => {
    res.render("loginError")
}

// reset password handelbars view. On submit sends email
export const resetPassViewController = (req, res) => {
    res.render("resetPass")
}

// update password handlebars view. On submit changes the users' password
export const newPassViewController = (req, res) => {
    res.render("changePass")
}

// users' handlebars view
export const usersViewController = async (req, res) => {
    const { limit = 20, page = 1, ...query } = req.query
    const users = await userManager.getUsers(limit, page, query)
    const usersList = users.payload.map(user => {
        const userDTO = new SessionDTO(user)
        const eachUser = {
            name: userDTO.name,
            mail: userDTO.mail,
            role: userDTO.role
        }
        return eachUser
    })
    res.render("users", { users: usersList })
}
