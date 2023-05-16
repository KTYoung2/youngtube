import express  from "express";
import { getEdit, 
         postEdit, 
         remove, 
         logout, 
         startGithubLogin,
         finishGithubLogin,
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

//깃허브 로그인
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);


userRouter.get("/:id", see);

userRouter.get("/delete", remove);


export default userRouter;