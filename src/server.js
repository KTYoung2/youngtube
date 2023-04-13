import express from "express";
import logger from "morgan";
/**미들웨어를 직접 만들어서 사용할 수 있지만  "morgan"이 좀 더 정교함
 GET, path, satus code, 응답시간 이 모든 정보를 가지고 있음.
*/
const PORT = 4000;


//1.express application 생성
const app = express();



//2.get request 응답(처리)
const handleHome = (req,res) => {
    return res.send("Home");
};

const handlelogin = (req,res) => {
    return res.send("login");
};


//순서 중요 ! 1.use(미들웨어) 2.get(path) -> express는 js처럼 모든걸 위에서 아래 순으로 실행시킴.
app.use(logger("tiny"));
/* (morgan)logger 함수는 미들웨어를 리턴해줌
"combined" , "common" , "dev", "short", "tiny"
*/
app.get("/", handleHome);
app.get("/login", handlelogin);


const handleListening = () => console.log(`Server listening on port http://localhost/:${PORT}🚀`);

/*
 3. 서버 외부에 개방하기. 
 서버는 listen 하고 있어야함.  
 JS event 함수 생각하면 이해가 쉬울 것. 
 app.listen(포트번호, 실행함수);  
*/
app.listen(PORT, handleListening);
