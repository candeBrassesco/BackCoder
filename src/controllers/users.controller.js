import userManager from "../dal/dao/mongoManagers/UserManager.js";
import { generateToken, compareData } from "../utils.js";
import { transporter } from "../nodemailer.js";

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

export const logoutUserController = async (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).json({ message: "Error login out" })
        res.clearCookie("token");
        res.redirect('/api/views/login')
    })
}

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
        console.error(error);
        res.status(500).json({ message: error });
    }
};

export const changePassController = async (req, res) => {
    const { email, newPassword, repeatPassword} = req.body
    const userExists = await userManager.findUser(email)
    const actPass = await compareData(newPassword, userExists.password)
    if (!userExists) {
        res.status(400).json({ message: 'User not found' })
    }
    if(actPass) {
        res.status(500).json({message: 'Error. New password must be different from the actual one.'})
    }
    const passChanged = await userManager.changePass(email, newPassword, repeatPassword)
    res.send('Password changed')
}

export const changeRolFormController = async (req, res) => {
    const { uid } = req.params
    const roleChanged = await userManager.updateRole(uid)
    res.status(200).json({ message: "User updated" })
}

export const deleteUserController = async (req, res) => {
    const {email} = req.body
    const userDeleted = await userManager.deleteUser(email)
    res.status(200).json({message: "User deleted"})
}

// login without passport
export const loginUserController = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Some data is missing!' })
    }

    const user = await userManager.findUser(email)
    if (!user) {
        return res.redirect("/api/views/loginError")
    }

    const isPasswordValid = await compareData(password, user.password)

    if (!isPasswordValid) {
        return res.redirect("/api/views/loginError")
    }

    res.redirect('/products')
}

export const loginViewController = (req, res) => {
    res.render("login")
}

export const registerViewController = (req, res) => {
    res.render("register")
}

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

export const registerErrorViewController = (req, res) => {
    res.render("registerError")
}

export const loginErrorViewController = (req, res) => {
    res.render("loginError")
}

export const resetPassViewController = (req, res) => {
    res.render("resetPass")
}

export const newPassViewController = (req, res) => {
    res.render("changePass")
}