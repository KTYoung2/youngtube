
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");


let deleteComments = document.querySelectorAll(".deleteComment");



//백엔드로 request가 성공적일때 js로 실시간 댓글창 구현하기
const addComment = (text, id) => {
    const videoCommentList = document.querySelector(".video_comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video_comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = "❎";
    span2.id = "deleteComment";
    newComment.appendChild(span);
    newComment.appendChild(span2);
    //새로운 댓글 맨 위에 추가.
    videoCommentList.prepend(newComment);
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
    const response  = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        //headers에 json을 보내고 있다고 express에게 알리는 것.
        headers: {
            "Content-Type": "application/json", 
        },
        // 백엔드에 string으로 보내기-> JSON.sTRINGIFY (댓글외에도 다른걸 요청할 수 있으니까)
        body: JSON.stringify({ text })
    });

    //백엔드로 request가 성공적일때 js로 실시간 댓글창 구현하기
    if( response.status === 201) {
        //textarea.value는 getter인 동시에 setter
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
        deleteComment = document.getElementById(".deleteComment");
        deleteComment.removeEventListener("click", handleDelete);
        deleteComment.addEventListener("click", handleDelete);
    }
 };
    
    
    //로그인 유무에 따라 댓글창이 보이기도 하고 안 보이기도 하니까.
    if(form) {
        form.addEventListener("submit", handleSubmit);
    };


/*

x를 누르면 htnl에서 li 사라지게하기
fech request된 후 딜리트 메소드를 사용해 ㄷ다른 url로 이동 (id)사용
url과 controller로 라우터를 설정하여 
controller에서 x 누른 사람이 댓글 작성자인지 확인
js에서 html 사라지게하기 (id로 삭제)

*/

const handleDelete = async (event) => {
    const li = event.srcElement.parentNode;
    const {
        dataset: { id: commentId },
    } = li;

    await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json", 
        },
      });
      li.remove();
    };
    

    if (deleteComments) {
        deleteComments.forEach((deleteComment) => {
            deleteComment.addEventListener("click", handleDelete);
        });
      }