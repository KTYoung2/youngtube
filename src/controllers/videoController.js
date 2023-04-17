export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
/* user에게 html을 return 해줘야 하는데, 방대한 html을 일일이
   여기서 작성하기 어렵고 비효율적. 
   home 파일을 pug에게 보내고 -> pug가 이 파일을 렌더링해서 평범한 html로 변환-> 유저 화면  
   res.render("view name", 템플릿에 보낼 변수);
   pug 파일 이름 주의 사항
   1.앞에 공백이 있으면 안 됨.
   2.전부 소문자로만 
*/
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Videos");
export const deleteVideo = (req, res) => {
    return res.send("Delete Videos");
}

