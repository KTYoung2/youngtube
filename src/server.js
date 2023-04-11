import express from "express";


//1.express application 생성
const app = express();

const PORT = 4000;

//2.get request 응답(처리)

const handleHome = (req,res) => {
    return res.send("<h1>사랑해<h1>");
};

const handleLogin = (req,res) => {
    return res.send("Login here~");
};


app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () => console.log(`Server listening on port http://localhost/:${PORT}🚀`);

/*
 3. 서버 외부에 개방하기. 
 서버는 listen 하고 있어야함.  
 JS event 함수 생각하면 이해가 쉬울 것. 
 app.listen(포트번호, 실행함수);  
*/
app.listen(PORT, handleListening);
