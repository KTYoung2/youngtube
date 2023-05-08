import express  from "express";
import { 
    upload, 
    watch, 
    getEdit, 
    deleteVideo, 
    postEdit,
    postUpload,
    } from "../controllers/videoController";
import { protectorMiddleware,
    videoUpload
 } from "../middleware";


const videoRouter = express.Router();


videoRouter.get("/:id([0-9a-f]{24})", watch);
/* :(id)변수이름-> parameter  url안에 변수를 포함시킬 수 있게 해줌.
    매번 생겨나는 게시물,동영상에 따라 라우터를 생성할 수 없기 때문에~ 
    각 생성 게시물에 id (변수)를 부여해 해당 라우터로 가져오는 것.  
*/
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter
.route("/upload")
.all(protectorMiddleware)
.get(upload)
.post(videoUpload.single("video"), postUpload);
/* upload를 제일 위에 위치하는 이유는 
   videoRouter.get("/:id", see); 라우터 뒤에 오게 된다면 
   express가 업로드 경로를(/upload) parameter(:id)로 인식!  
   but 파라미터에 (\\d+) 설정해주면 어차피 숫자만 변수로 받기 때문에
   videoRouter.get("/:id", see); 아래에 위치해도 괜찮음.
*/

export default videoRouter;