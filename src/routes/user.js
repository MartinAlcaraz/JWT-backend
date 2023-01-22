import { Router } from "express";
import UsersCtrl from "../controllers/user.controller.js";
const { login, getUsers, logout, register, getProfile } = UsersCtrl;
const usersRouter = Router();

usersRouter.route('/login')
    .get(getUsers)
    .post(login);

usersRouter.route('/logout')
    .post(logout);

usersRouter.route('/register')
    .post(register);

usersRouter.route('/profile')
    .get(getProfile)


export default usersRouter;