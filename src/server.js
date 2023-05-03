import express from "express";
import logger from "morgan";
/**미들웨어를 직접 만들어서 사용할 수 있지만  "morgan"이 좀 더 정교함
 GET, path, satus code, 응답시간 이 모든 정보를 가지고 있음.
*/
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middleware";



//1.express application 생성
const app = express();

//순서 중요 ! 1.use(미들웨어) 2.get(path) -> express는 js처럼 모든걸 위에서 아래 순으로 실행시킴.
app.use(logger("dev"));
/* (morgan)logger 함수는 미들웨어를 리턴해줌
"combined" , "common" , "dev", "short", "tiny"
*/

/*뷰(템플릿)엔진 -> pug 세팅.(html을 return하기 위해) 
app.set("view engine", "pug");
세팅만 해주면 express가 views 디렉토리에서 pug 파일을 찾도록 설정이 되어 있어
import 안 해줘도됨. 
*/
app.set("view engine", "pug");

/*
기본적으로 express는 
현재 작업 위치(디렉토리)에서 pug를 찾음.
** 현재 작업 위치의 기준은? 
-> 서버를 기동하는 파일의 위치에 따라 결정 (node.js를 어디서 실행시키고 있지??)
                                         -> package.json 
 현재 작업 위치 변경 
 app.set("views", process.cwd() + "/src/views(경로)");                                   
*/
app.set("views", process.cwd() + "/src/views");
/* express에게 form value를 이해하도록 하고, 자바스크립트 형식으로 변형시켜줌 */
app.use(express.urlencoded({ extended: true }));

/*
세션 미들웨어. (유저 기억하기)
                --> 세션 미들워에가 브라우저에게 쿠키 보내줌. 

세션이란? 백엔드 / 브라우저 사이에 어떤 활동을 했는지 기억하는 것. (하지만 2주 뒤에 세션은  사라짐. )
즉 브라우저와 백엔드 사이의 memory, history 같은 거임. 
이게(기억하는것이) 작동하려면 백엔드& 브라우저가 서로에대한 정보를 가지고 있어야한다. 
서버에서 http에 요청한것이 끝나면 백엔드, 브라우저는 아무것도 더이상 할 수 없고
서버는 누가 요청을 보냈는지 잊어버림(브라우저도).-> 이것을 스테이리스(무상태)
한번 연결하고 끝나기 때문. 
그래서 우리는 유저가 백엔드에게 뭔가 요청할 때미다 누가 요청할 수 있는지
알 수 있게끔  유저에게 어떤 정보를 남겨줘야함. 

브라우저 & 백엔드 사이에는 wifi처럼 유지되는 연결이 없으니 
백엔드에 요청을 보낼때마다 서버가 브라우저에게 쿠키(를 같이 보내줘야 유저를 기억할 수 있다! 
-> 세션과 세션 id 는 브라우저를 기억하는 방식 중 하나


import session from "express-session"; 이 있으면
익스프레스가 알아서 브라우저를 위한 세션 id를 만들고
브라우저에게 보내줌.-> 브라우저가 쿠키에 그 세션 id 저장->
익스프레스에서 그 세션을 세션 스토어 저장 (세션 db에 있는 id = 쿠키 id 같도록)
-> 브라우저한테 보내서 쿠키에 저장한 세션 id를 브라우저가 localhost의 모든 url에 요청을 보낼 때마다 
세션 id를 요청과 함께 보냄. -> 그러면 백엔드에서 어떤 유저가 어느 브라우저에게 요청을 보냈는지 알 수 있음 !

*/




app.use(session({
    /*secret => 쿠키에 sing할 때 사용하는 string(내 back-end가 쿠키를 줬다는걸 보여주기 위함)
        이게 그대로 노출되면 해킹이슈에 취약하기 때문에 string( "Hello!")를 말그대로 숨겨줘함.
        =======>  "Hello!" 가 나임을 증명하는 sing string(페스워드 같은 것 )
    */
    secret: process.env.COOKIE_SECRET,
    /*
    resave: false,
    saveUninitialized: false    ==> 로그인 사용자의 세션만 저장해야하기 때문. 
    */
    resave: false,
    saveUninitialized: false,
    //세션 스토어(user session id 저장)
    store: MongoStore.create({mongoUrl:process.env.DB_URL}),
})
);


app.use(localsMiddleware);
//router 생성
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


export default app;