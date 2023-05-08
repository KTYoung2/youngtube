import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
                                        //오직 하나의 값만 저장.
    avatarUrl: {type: String, require: true},
    socialOnly: {type: Boolean, default: false},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    name: {type: String, require: true},
    location: String, 
}); 

/**     비번을 그대로 db에 저장하는건 미친짓 ~ 해킹이슈에 너무 취약.
          비번 보호를 하기 위해 해싱 ! 해싱한 비번을 db에 저장. ( npm i bcrypt 설치)
          해싱이란? 일방향 함수. 입력값으로 출력값을 알 수 있지반 그 반대의 경우엔 알아낼 수 없음.
          그리고 같은 입력값으로는 항상 같은 출력값이 나온다. 
          ex) 설정비번 :1235 -> sjdsjd 이런식으로 암호화해서 바꿔주는 것. 
        다시한번 ! 몽구스 미들웨어는 mongoose.model이 생기기 전에 만들어야함.
        몽구스 미들웨어는 오브젝트 함수가 실행하기전 (db에저장하기전) 중간에 잠깐 끼어들어
        작업할 수 있게 만들어줌.        
          */ 
userSchema.pre("save", async function(){
    this.password = await bcrypt.hash(this.password, 5)
//이 function 안에서의 this 는 create (만들어지는)되는 User 지칭
//bcrypt.hash(this.password, 해싱 횟수)
});


const User = mongoose.model("User", userSchema);

export default User;

