//mongoDB 연결
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/young", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

/* cmd -> cd C:\Program Files\MongoDB\Server\6.0\bin\(몽고db설치 경로) 
   mongosh 실행 -> 
   Connecting to : mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1
   내 db가 실행되고 있는 url
   mongoose.connect("mongodb://127.0.0.1:27017/db이름")
*/ 



const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB 🚀");

db.on("error", (error) => console.log("DB Error!!!", error));
//on -> 여러번 발생시킬 수 있는 이벤트(db 에러 체크)
db.once("open", handleOpen);
//once -> 오로지 한번만 발생 (디비 연결됐는지 확인용)