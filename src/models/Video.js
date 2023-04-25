/*mongoose를 사용하기 전 
내 어플리케이션의 데이터들이 어떻게 생겼는지 알려줘야함.
----> 데이터 타입 정의 */
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