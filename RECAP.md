
3.7 Setup

 모든 건 package-json에서 시작. (node.js 관련 정보를 담는 방법(그저 text))
 -----> 동료에게  package-json만 공유하면 npm i 명령어로 
 내 프로젝트에 필요한 페키지들을 자동으로 다운 받을 수 있음.

 - "scripts"

  "scripts": {
    "dev": "nodemon --exec babel-node src/server.js"
  }
  
  npm 행동 설정 -> 터미널에 " npm run nodemon --exec babel-node src/server.js" 전체를 입력하게 하는 대신
  dev라는 명령어를 설정. "npm run dev"

- "dependencies"

    "dependencies": {
    "express": "^4.18.2"
  }

 dependencies는 프로젝트가 작동하기 위해  꼭 필요한 페키지들. 
 express는 node_modules 폴더에 저장 (익스프레스 외에도(devDependencies) 설치한 모든 것들이 다)


-"devDependencies"

  "devDependencies": {
    "@babel/core": "^7.21.4",
    ------> 최신 node.js도 (ES6같은) 최신 코드를 지원하지 않을 떄가 있음.
    babel-node가 서버를 작동해 babel이 최신 javascrip를 이해하고 
    평범한 node.js방식으로 변환해 node.js 서버를 작동시는 것 (이 과정을 컴파일이라고 함)
    babel-node를 사용하려면 babel.confug.json 파일을 만들어야함.

    {
    "presets": ["@babel/preset-env"]
                ---> 최신 js를 사용하게 해주는 preset-env
    }

    이처럼  babel에 추가하고 싶은 plugin 추가

    "@babel/node": "^7.20.7",
    "@babel/preset-env": "^7.21.4",
    "nodemon": "^2.0.22"
    -----> 파일을 보고 있다가 변화가 생기면 commend를(서버를)재시작해줌
    (서버를 만드는데 꼭 필요한 건 아님.) 
  }


 개발자가 개발할 때 필요한 것들


==================================================================




3.8 Servers


서버란 무엇일까?
항상 켜져있고 인터넷에 연결 돼 있으면서 request(요청)을 listening 하고 있는 컴퓨터.

request는 우리가  서버에게 요청하는 것들. 
ex) 유튜브로 들어가는 것. 카톡을 보내는 것 댓글을 쓰는것 등등
브라우저가 해당 웹사이트로 request를 보내는 것임.



import express from "express";
1. node_module에서 import express 

const PORT = 4000;
3.서버는 특정 request만 listen할 수 있고 
네 컴퓨터 전체를 listen 할 수 없음.-> port가 있어야함. 
내가 request를 보낼 때 해당 port로 request를 보내는 거임. (지금은 4000 포트만 개방한것.) 

const app = express();
2.express 함수호출을 하면 express 어플리케이션을 바로 사용할 수 있게
바로 return 해줌.


const handleHome = (req,res) => {
    return res.send("<h1>사랑해<h1>");
};
5.모든 controller에는 request와 response가 있음.(express가 제공
    (1.req, 2.res) -> 함수 이름은 상관없는데 중요한 건  인자의 첫번째가 request, 두번 째가 response라는 것!)
req -> request에 대한 정보를 줌. request한 유저의 ip,cookei...등등
res -> response에 어떻게 응답하느냐. 무엇이로든 응답해주는 게 필수 ! 



app.get("/", handleHome);
4.request하려면 url을 사용해야함(즉 url을 통해 서버에 요청).
** 브라우저는 서버에게 페이지를 request하는 것임!
일단 지금은 get 요청
app.get(route, 실행함수);



const handleListening = () => console.log(`Server listening on port http://localhost/:${PORT}🚀`);

app.listen(PORT, handleListening);
                ----> Listening이 시작 되면 호출되는 함수



====================================================================




3.10 Middleware

미들웨어란? request와 response 중간에 있는 소프트웨어


const routerLogger = (req, res, next) => {
    next();
}

const methodLooger = (req, res, next) => {
    next();
}

const logger = (req, res, next) => {
    console.log(`${req.method}가 이쪽으로 가려고 합니다 : ${req.url} `);
    next();
};

미들웨어는 컨트롤러와 비슷함. (누군가 응답하기 response 전까진 컨트롤러 전부 미들웨어임! )
미들웨어엔  (req, res, next)가 있음.
next(); 함수를 호출하면
express가 다음 함수를 호출하겠지. 누군가 응답 할 때까지.
express는 묻겠지? logger 응답할거야??? 하면 logger는 ㄴㄴ 하고 다음! 함수로 보내는것. 
그럼 handleHome함수가 실행되고 연결이 종료 됨.


const handleHome = (req,res) => {
    return res.send("<h1>사랑해<h1>");
};
**관습적으로 응답해주는 마지막 controller에는 next 안씀



app.use(routerLogger, methodLooger,);
이 함수 아래에 오는 다른 함수들 전체에 미들웨어를 
사용하고 싶다면 use(공통 미들웨어)
순서 중요 ! 1.use(미들웨어) 2.get(path) -> express는 js처럼 모든걸 위에서 아래 순으로 실행시킴.
** 미들웨어는 원하는만큼 만들 수 있음. 
app.get("/", logge, routerLogger, methodLooger, handleHome);
실행순서 ------1 ------- 2 ----------- 3 ---------- 4(응답) -->
만약  methodLooger에서 return, 응답한다면 handleHome은 실행 X




====================================================================


4.4 Router

라우터란 url이 어떻게 시작하는지에 따라 나누는 방법
**url을 더 낫고 독립적으로 관리하기 위해 라우터를 사용.

app.use("/", globalRouter); 
----> home
app.use("/videos", videoRouter);
----> video
app.use("/users", userRouter);
----> user

공통 시작을 부분으로 그룹화해 분류. (READEME 참고)

url의 시작이 /videos가 된다면, 분류한 라우터대로
express가 videoRouter.get("/watch", watch);
          videoRouter.get("/edit", edit); 실행.
라우터를 사용하기 때문에 videoRouter.get("/videos/watch", watch); 
이렇게 반복할 필요가 없음.


================================================================



4.5 Architecture

무언가를 import하기 전엔 export를 먼저 해야함.
javascript의 모든 파일은 독립되어 있기 때문에! 


import express  from "express";
import { watch, edit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/edit", edit);

export default videoRouter;

videoRouter 파일에서 공유하고 싶은 변수는 오직 videoRouter 뿐. -> export default 


다른 파일에서 videoRouter import하려면 
import videoRouter from "./routers/videoRouter"; 
      ---> 변수명 (export default는 공유된 변수와 이름이 달라도됨.
      이름을 바꾸더라고 node.js는 videoRouter 참조하고 있다는 걸 알고있음. ) , from (경로)



하나 이상을 공유하고 싶다면, export
export const trending = (req, res) => res.send("Home Page Videos");
export const watch = (req, res) => res.send("Watch");
export const edit = (req, res) => res.send("Edit Videos");


다른 파일에서 videoController import하려면 
import { watch, edit } from "../controllers/videoController";
      ---> export default와는 다르게 어느 함수를 가져올지 구체적으로 지정해여함.
           변수명을 똑같이 import 해야합니다. 

           ** ../ -> 지금 파일에서 벗어남을 의미
              ./ ->  지금의 위치

