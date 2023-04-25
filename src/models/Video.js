/*mongoose를 사용하기 전 
내 어플리케이션의 데이터들이 어떻게 생겼는지 알려줘야함.
----> 데이터 타입 정의  why?? 형태를 미리 만들어둬야 사용자가 어떤 data값을 넘기든간에
mongoose가 내가 작성한 코드를 보호해줄 수 있음 */
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    hashtags: [{type: String}],
    meta: {
        views: Number,
        rating: Number,
    },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;