import "./db"; //sever에 db파일 import
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`Server listening on port http://localhost/:${PORT}🚀`);

/*
 3. 서버 외부에 개방하기. 
 서버는 listen 하고 있어야함.  
 JS event 함수 생각하면 이해가 쉬울 것. 
 app.listen(포트번호, 실행함수);  
*/
app.listen(PORT, handleListening);
