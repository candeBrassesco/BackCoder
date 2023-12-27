import { Router } from "express";
import { changePassController, changeRolFormController, deleteUserController, deleteUserforTestController, getUsersController, loginUserController, logoutUserController, registerUserController, resetPasswordController } from "../controllers/users.controller.js";
import { checkUsersAuth } from "../middlewares/auth.middleware.js";
import SessionDTO from "../dal/dto/sessions.dto.js";
import passport from "passport";

const router = Router()

router.get('/', getUsersController )

router.post('/delete/:mail', checkUsersAuth, deleteUserController)

router.post('/register', registerUserController)

router.post("/login", passport.authenticate("login",{failureRedirect: "/api/views/loginError", successRedirect: "/products", passReqToCallback: true}))

router.post("/resetPass", resetPasswordController )

router.post('/changePass', changePassController)

router.post('/premium/:uid', changeRolFormController)

router.delete('/delete', deleteUserforTestController)

//register con Github
router.get('/registerGithub', passport.authenticate("github", { scope: [ 'user:email' ] }))

router.get('/github', passport.authenticate("github", {failureRedirect:'/api/views/registerError'}), async (req,res) =>{
    req.session.email = req.user.email
    res.redirect("/products/")
})

router.get('/logout', logoutUserController)

router.get("/current", passport.authenticate("jwt", {session:false}), (req, res)=>{
    const userDTO = new SessionDTO(req.user)
    res.send(userDTO)
})


export default router