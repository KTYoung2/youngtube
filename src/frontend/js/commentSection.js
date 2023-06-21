import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

//백엔드로 request가 성공적일때 js로 실시간 댓글창 구현하기
const addComment = (text) => {
    const videoCommentList = document.querySelector(".video_comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video_comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    newComment.appendChild(span);
    videoCommentList.appendChild(newComment);
};

const handleSubmit = async(event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    console.log(videoContainer.dataset);
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    //댓글창에 아무것도 입력하지 않고 버튼을 눌렀을 때 리턴 X 
    if (text === ""){
        return;
    }
    //백엔드로 request 보내기
    const { status } = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        //headers에 json을 보내고 있다고 express에게 알리는 것.
        headers: {
            "Content-Type": "application/json", 
        },
        // 백엔드에 string으로 보내기-> JSON.sTRINGIFY (댓글외에도 다른걸 요청할 수 있으니까)
        body: JSON.stringify({ text }),
    });
    //textarea.value는 getter인 동시에 setter
    textarea.value = "";

    //백엔드로 request가 성공적일때 js로 실시간 댓글창 구현하기
    if(status === 201) {
        addComment(text);
    }

};


//로그인 유무에 따라 댓글창이 보이기도 하고 안 보이기도 하니까.
if(form) {
    form.addEventListener("submit", handleSubmit);
};