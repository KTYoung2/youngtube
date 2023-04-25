import express from "express";
import logger from "morgan";
/**미들웨어를 직접 만들어서 사용할 수 있지만  "morgan"이 좀 더 정교함
 GET, path, satus code, 응답시간 이 모든 정보를 가지고 있음.
*/
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";



//1.express application 생성
const app = express();

//순서 중요 ! 1.use(미들웨어) 2.get(path) -> express는 js처럼 모든걸 위에서 아래 순으로 실행시킴.
app.use(logger("dev"));
/* (morgan)logger 함수는 미들웨어를 리턴해줌
"combined" , "common" , "dev", "short", "tiny"
*/

/*뷰(템플릿)엔진 -> pug 세팅.(html을 return하기 위해) 
app.set("view engine", "pug");
세팅만 해주면 express가 views 디렉토리에서 pug 파일을 찾도록 설정이 되어 있어
import 안 해줘도됨. 
*/
app.set("view engine", "pug");

/*
기본적으로 express는 
현재 작업 위치(디렉토리)에서 pug를 찾음.
** 현재 작업 위치의 기준은? 
-> 서버를 기동하는 파일의 위치에 따라 결정 (node.js를 어디서 실행시키고 있지??)
                                         -> package.json 
 현재 작업 위치 변경 
 app.set("views", process.cwd() + "/src/views(경로)");                                   
*/
app.set("views", process.cwd() + "/src/views");
/* express에게 form value를 이해하도록 하고, 자바스크립트 형식으로 변형시켜줌 */
app.use(express.urlencoded({ extended: true }));
//router 생성
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


export default app;