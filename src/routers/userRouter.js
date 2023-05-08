import express  from "express";
import { getEdit, 
         postEdit, 
         remove, 
         logout, 
         see, 
         getChangePassword , 
         postChangePassword } from "../controllers/userController"
import { protectorMiddleware, avatarUpload } from "../middleware";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
.route("/edit")
.all(protectorMiddleware)
//all() => get, post등 어떤 http method를 사용하든지 이 미들웨어를 사용하겠다는 것. 
.get(getEdit)
.post(avatarUpload.single("avatar"), postEdit);
                    
userRouter
.route("/change-password")
.all(protectorMiddleware)
.get(getChangePassword)
.post(postChangePassword);

userRouter.get("/delete", remove);
/*
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
*/

userRouter.get("/:id", see);

export default userRouter;