import express from "express";
import logger from "morgan";
/**미들웨어를 직접 만들어서 사용할 수 있지만  "morgan"이 좀 더 정교함
 GET, path, satus code, 응답시간 이 모든 정보를 가지고 있음.
*/
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;


//1.express application 생성
const app = express();

//순서 중요 ! 1.use(미들웨어) 2.get(path) -> express는 js처럼 모든걸 위에서 아래 순으로 실행시킴.
app.use(logger("dev"));
/* (morgan)logger 함수는 미들웨어를 리턴해줌
"combined" , "common" , "dev", "short", "tiny"
*/



//router 생성
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


const handleListening = () => console.log(`Server listening on port http://localhost/:${PORT}🚀`);

/*
 3. 서버 외부에 개방하기. 
 서버는 listen 하고 있어야함.  
 JS event 함수 생각하면 이해가 쉬울 것. 
 app.listen(포트번호, 실행함수);  
*/
app.listen(PORT, handleListening);
