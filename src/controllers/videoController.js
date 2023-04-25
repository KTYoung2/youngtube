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

export const home = async(req, res) => { 
    /* promise -> async, await 는 callback보다 좀 더 최신기술.
        직관적인 것이 장점이라  javascript가 어디서 어떻게 기다리는지 바로 알 수 있음. 
        try / cath (에러를 부르는 방식)
    */
    try {
        const videos = await Video.find({})
        // await -> db에게 결과값을 받을 때까지 javascript가 기다려줌. 
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
export const watch = (req, res) => {
    const { id } = req.params;
    return res.render("watch", { pageTitle: "Watching" });
};

export const getEdit = (req, res) => {
    const { id } = req.params;
    return res.render("edit", { pageTitle: "Editing" });
};

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    //form을 사용할땐 req.body로 부터 date를 받는다.
    return res.redirect(`/videos/${id}`);
    //redirect()는 브라우저가 자동으로 이동하도록 하는 것.
};


export const upload = (req, res) => {
    return res.render("upload", { pageTitle: "upload video"});
};

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    //pug 파일에서 input name과 일치해야함 
    //사용자가 upload할 data를 받아낼 document(js object) 작성
    const video = new Video({
        title,
        description,
        createdAt: Date.now(),
        hashtags:hashtags.split(",").map((word) => `#${word}`),
        //split(분할의 기준) -> 문자열을 분활하는 메소드
        //map ->  callbackFunction을 실행한 결과를 가지고 새로운 배열을 만들 때 사용
        meta: {
            views:0,
            rating:0,
        },
    });
    /*
    title:title
    description:description 
    이렇게 적는 것과 똑같음
    왼쪽은 document, 오른쪽은 Schema
    */
    //사용자에게 받아낸 data저장 -> db에 저장
    await video.save();
    /* --> save();는 promise를 return해줌. 즉 save 작업이 끝날 때까지 await 기다려줘야함.
        why? 위에 작성한 document(object)가 db에 기록 되고 저장되는데 시간이 좀 걸리니까~
    */
    return res.redirect("/");
};



export const search = (req, res) => res.send("Search Videos");
export const deleteVideo = (req, res) => {
    return res.send("Delete Videos");
}

