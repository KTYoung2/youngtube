import express  from "express";
import { upload,see, edit, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();


videoRouter.get("/:id(\\d+)", see);
/* :(id)변수이름-> parameter  url안에 변수를 포함시킬 수 있게 해줌.
    매번 생겨나는 게시물,동영상에 따라 라우터를 생성할 수 없기 때문에~ 
    각 생성 게시물에 id (변수)를 부여해 해당 라우터로 가져오는 것.  

    (\\d+) -> express 제공해주는 기능 ! 
    변수에 숫자만 받을 수 있도록 설정. 
    digit(숫자)+(all)
*/
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload);
/* upload를 제일 위에 위치하는 이유는 
   videoRouter.get("/:id", see); 라우터 뒤에 오게 된다면 
   express가 업로드 경로를(/upload) parameter(:id)로 인식!  
   but 파라미터에 (\\d+) 설정해주면 어차피 숫자만 변수로 받기 때문에
   videoRouter.get("/:id", see); 아래에 위치해도 괜찮음.
*/

export default videoRouter;