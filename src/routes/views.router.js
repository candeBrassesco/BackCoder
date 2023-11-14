import { Router } from "express";
import { privateAcces } from "../middlewares/acces.middleware.js";
import { loginErrorViewController, loginViewController, newPassViewController, profileViewController, registerErrorViewController, registerViewController, resetPassViewController } from "../controllers/users.controller.js";
import { jwtPassResetVal } from "../middlewares/jwt.middleware.js";

const router = Router()


router.get('/login', loginViewController)

router.get('/register', registerViewController)

router.get('/profile', privateAcces, profileViewController)

router.get('/registerError', registerErrorViewController)

router.get('/loginError', loginErrorViewController)

router.get('/resetPass', resetPassViewController)

router.get('/changePass', jwtPassResetVal, newPassViewController )

export default router