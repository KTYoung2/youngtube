import User from "../models/User";
import Video from "../models/Video";

/**    Video.find({}, (error,Videos) => {
        /*callback -> 어떤 동작이 끝나면 특정 function을 부르도록 만들어진 함수.
                      why?? javascript는 기다리는 기능이 없으니까.  
                      추가적인 코드 없이 에러를 바로 불러 올 수 있다 !
            if(error){
            return res.render("server-error")
        }
        return res.render("home", { pageTitle: "Home" , videos });
    });
*/

//메인 홈
export const home = async(req, res) => { 
    /* promise -> async, await 는 callback보다 좀 더 최신기술.
        직관적인 것이 장점이라  javascript가 어디서 어떻게 기다리는지 바로 알 수 있음. 
        try / cath (에러를 부르는 방식)
    */
    try {
        const videos = await Video.find({}).sort({createdAt:"desc"});
        // await -> db에게 결과값을 받을 때까지 javascript가 기다려줌. 
        /* sort(); -> 무엇을 기준으로 데이터를 정렬할 것인가.
           desc : 내림차순
           asc: 오름차순
        */
        return res.render("home", { pageTitle: "Home" , videos });
    } catch(error){
        return res.render("server-error", {error});
    }
};
/* user에게 html을 return 해줘야 하는데, 방대한 html을 일일이
   여기서 작성하기 어렵고 비효율적. 
   home 파일을 pug에게 보내고 -> pug가 이 파일을 렌더링해서 평범한 html로 변환-> 유저 화면  
   res.render("view name", 템플릿에 보낼 변수);
   pug 파일 이름 주의 사항
   1.앞에 공백이 있으면 안 됨.
   2.전부 소문자로만 
*/

//비디오시청
export const watch = async (req, res) => {
    const { id } = req.params;
    // id-> req.params에서 얻어오는것. 즉 router에 "/:id([0-9a-f]{24})" experss를 시켜 url을 인식하도록 설정했기때문.
    const video = await Video.findById(id).populate("owner");
                        /*populate() => 몽구스에서 제공하는 프로퍼티,
                        몽구스가 'video'를 찾고 그 안에서 owner도 찾아줌
                        owner => ObjectID => User 객체 전체를 값으로 가져옴.  
                                                                    */
    if(!video){
        return res.render("404", { pageTitle:"Video not found."});
    }   
    return res.render("watch", { pageTitle: video.title, video });
};


//비디오 수정
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user : { _id },
    }= req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found."});
    }
    if(String(video.owner) !== String( _id)){
        //js는 생김새 뿐만아니라 type도 비교
        return res.status(403).redirect("/");
    }
    //에러 체크를 먼저 해주면 나머지 코드는 에러를 걱정할 필요가 업ㅅ음~~
    return res.render("edit", { pageTitle: `Editing : ${video.title}` , video});
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id : id });
    /*update 같은 경우 video object를 굳이 불러올 이유가 없음. 
    단순히 영상이 존재하는지만 확인하면 됨
    exists({ _id : id }); -> true or false 
    exists-> filter로 받음.
    */
    if(!video){
        return res.render("404", { pageTitle:"Video not found."});
    }
    await Video.findByIdAndUpdate(id, {
        title, 
        description, 
        hashtags : Video.formatHashtags( hashtags),
    });
    /* 업데이트를 할 때 목록을 일일히 적어주며 수정이기엔,,,, 너무 비효율적. 몽구스에서 제공하는 
       .findByIdAndUpdate(업데이트할 id, 업데이트 목록) -> .findById ~ 는 꼭 id를 인자(argument)로 받음.
    */
    return res.redirect(`/videos/${id}`);
    //redirect()는 브라우저가 자동으로 이동하도록 하는 것.
};


//비디오 업로드
export const upload = (req, res) => {
    return res.render("upload", { pageTitle: "upload video"});
};

export const postUpload = async (req, res) => {
    //video의 owner로 현재 로그인 중인 유저 id 사용. 
    const { 
        user : {_id}, 
    } = req.session;
    const file = req.file;
    const { title, description, hashtags } = req.body;
    //pug 파일에서 input name과 일치해야함 
    //사용자가 upload할 data를 받아낼 document(js object) 작성
    try {  
        const newVideo = await Video.create({
        title,
        description,
        fileUrl: file.path,
        owner: _id, 
        hashtags : Video.formatHashtags( hashtags),
    });
    /*
    
    title:title
    description:description 
    이렇게 적는 것과 똑같음
    왼쪽은 document, 오른쪽은 Schema
    
    사용자에게 받아낸 data저장 -> db에 저장
    await video.save();
     --> save();는 promise를 return해줌. 즉 save 작업이 끝날 때까지 await 기다려줘야함.
        why? 위에 작성한 document(object)가 db에 기록 되고 저장되는데 시간이 좀 걸리니까~
    */
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
    //array에 요소를 추가할 때는 push() 사용
    } catch(error){
    console.log(error);
    //에러를 잡는다고 해도 무언가를 return 해야함 ! 
                //에러 메세지 출력. 
    return res.status(400).render("upload", { 
                       pageTitle: "upload video", 
                       errorMessage: error._message,});
}   
};


//비디오 삭제
export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const { user : { _id },
    }= req.session;
    const video = await Video.findById(id);
    /** 왜 여기서는 populate를 쓰지 않을까?
     * populate는 모든 정보를 가져와 비교하는데
     * 필요없는 데이터를 굳이 로드할 필요가 없으니까 ~ 
     * 여기서는 id만을 가지고 비교하는 것으로 충분 ! 
     */
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found."});
    }
    if(String(video.owner) !== String( _id)){
        //js는 생김새 뿐만아니라 type도 비교
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};


//비디오 검색
export const search = async (req, res) => {
   const { keyword } = req.query;
   //req.query -> url에 있는 모든 정보를 확인 할 수 있음.
   let videos = [];
   if(keyword) {
        videos = await Video.find({
        title: {
            $regex: new RegExp(`^${keyword}
            `, "i"),
        },       
    });
} 
   return res.render("search", { pageTitle: "Search", videos});
};

