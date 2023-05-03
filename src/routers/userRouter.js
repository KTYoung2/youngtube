import express  from "express";
import { getEdit, postEdit, remove, logout, see } from "../controllers/userController"
import { protectorMiddleware } from "../middleware";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
                    //all() => get, post등 어떤 http method를 사용하든지 이 미들웨어를 사용하겠다는 것. 
userRouter.get("/delete", remove);
/*
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
*/

userRouter.get(":id", see);

export default userRouter;