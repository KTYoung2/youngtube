import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    const { email, username, password, password2, name, location } = req.body;

    //username 중복체크
    const usernameExists = await User.exists({username});
    if(usernameExists){
        return res.status(400).render("join", 
        /* user가 잘못된 데이터를 넘겨줬을 때 우리는 체크할 수 있지만,
           브라우저는 못 알아 들을 수 있으니 상태 코드 400번대 (클라이언트 에러)
           보내주기. ** 참고 400 bad request
        */
        { pageTitle: "Join", errorMessage: "이미 사용중인 아이디입니다." });
    }

    //email 중복 체크 
    const emailExists = await User.exists({email});
    if(emailExists){
        return res.status(400).render("join", 
        { pageTitle: "Join", errorMessage: "이미 사용중인 이메일 주소 입니다." });
    }

    //비밀번호 일치체크
    if(password !== password2){
        return res.status(400).render("join", 
        { pageTitle: "Join", errorMessage: "비밀번호가 서로 일치하지 않습니다." });
    }
    try{
    await User.create({
        email, 
        username, 
        password,
        name, 
        location
    });   
    return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join", { 
                           pageTitle: "Join", 
                           errorMessage: error._message,});
    }   
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "Login"});
export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    //유저가 로그인 하려는 계정 찾기. 
    
    //유저 id 유무 체크 
    if(!user){
        return res.status(400).render("login", { pageTitle: "Login", 
                                                 errorMessage: "존재하지 않는 ID입니다. "});
    }
    const ok = await bcrypt.compare(password, user.password);
    // 해싱한 password 비교         유저가 입력한 패스워드 , 압호화된(해싱된) 패스워드 

    //password 일치 체크
    if(!ok){
        return res.status(400).render("login", { pageTitle: "Login", 
                                                 errorMessage: "잘못된 비밀번호입니다."});
    }
    // 세션에 정보 추가 (각 브라우저마다 서로 다른 세션을 가지고 있으니 req.session objcet에 덧붙이는 것) 
    req.session.loggedIn = true;
    req.session.user = user;
    //db에서 찾은 사용사의 테이터를 user에 넣어줌. 
    return res.redirect("/");
};


export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");




