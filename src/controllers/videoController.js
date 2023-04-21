let videos = [
    {
        title: "1 video",
        rating: 5,
        comments: 2,
        createdAt:"2 minutes ago",
        views:59,
        id:1,
    },
    {
        title: "2 video",
        rating: 8,
        comments: 11,
        createdAt:"10 minutes ago",
        views:88,
        id:2,
    },
    {
        title: "3 video",
        rating: 10,
        comments: 2,
        createdAt:"9 minutes ago",
        views:16,
        id:3,
    },
];


export const trending = (req, res) => { 
    return res.render("home", { pageTitle: "Home", videos });}
/* user에게 html을 return 해줘야 하는데, 방대한 html을 일일이
   여기서 작성하기 어렵고 비효율적. 
   home 파일을 pug에게 보내고 -> pug가 이 파일을 렌더링해서 평범한 html로 변환-> 유저 화면  
   res.render("view name", 템플릿에 보낼 변수);
   pug 파일 이름 주의 사항
   1.앞에 공백이 있으면 안 됨.
   2.전부 소문자로만 
*/
export const see = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render("watch", { pageTitle: `Watching ${video.title}` });
};

export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Videos");
export const deleteVideo = (req, res) => {
    return res.send("Delete Videos");
}

