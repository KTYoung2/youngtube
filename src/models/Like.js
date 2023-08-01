import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    like : {type: Boolean, default: false},
    videos : [{type : mongoose.Schema.Types.ObjectId, ref:"Video"}],
    owner : {type : mongoose.Schema.Types.ObjectId, require: true, ref:"User"},
});

const Like = mongoose.model("Like", likeSchema);

export default Like;