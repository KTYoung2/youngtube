/*mongoose를 사용하기 전 
내 어플리케이션의 데이터들이 어떻게 생겼는지 알려줘야함.
----> 데이터 타입 정의  why?? 형태를 미리 만들어둬야 사용자가 어떤 data값을 넘기든간에
mongoose가 내가 작성한 코드를 보호해줄 수 있음 */
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type : String, required: true, trim: true, maxlength:80},
    fileUrl: { type: String, required: true },
       //String은 더 많은 옵션들을 추가해줄 수 있음. trim -> 앞뒤 스페이스(공간)없애기.            
    description: {type : String, required: true, trim: true, minlength:20},
    createdAt: { type : Date, required: true, default: Date.now },
                    // required: ture 필수항목 설정 default -> db 필드에 무조건 삽입
    hashtags: [{type: String, trim: true}],
    meta: {
        views: { type: Number, default: 0, required: true},
        rating: { type: Number, default: 0, required: true},
    }, //초록색의 data type들은 js에서 제공하는 것.
    comments : [{type: mongoose.Schema.Types.ObjectId, require: true, ref:"Comment"}],
    //user와 video DB연결
    owner : {type : mongoose.Schema.Types.ObjectId, require: true, ref:"User"},
    //owner의 타입은 objectId -> 몽구스 코드에서만 사용할 수 있음 !  ref:"User" => 지정하려는 model
});

/*몽구스 미들웨어는 mongoose.model이 생기기 전에 만들어야함.
몽구스 미들웨어는 오브젝트 함수가 실행할때 중간에 끼어들어
자신이 할 일을 실행할뿐, 흐름을 방해하지 않음.  
*/

videoSchema.static("formatHashtags", function(hashtags){
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word :`#${word}`));
    //split(분할의 기준) -> 문자열을 분활하는 메소드
   //map ->  callbackFunction을 실행한 결과를 가지고 새로운 배열을 만들 때 사용
})

const Video = mongoose.model("Video", videoSchema);

export default Video;