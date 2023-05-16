import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

//회원가입
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


//로그인
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


//깃허브 로그인
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id:process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email",
        //유저에게 얼마나 많은 정보를 읽어내고 어떤 정보를 가져올 것인가. => scope 설정
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};


export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
      client_id: process.env.GH_CLIENT,
      client_secret: process.env.GH_SECRET,
      code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    //finalUrl에 POST 요청 보내기.
    const tokenRequest = await (
        await fetch(finalUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        })
      ).json();
      if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
          await fetch(`${apiUrl}/user`, {
            headers: {
              Authorization: `token ${access_token}`,
            },
          })
        ).json();
        console.log(userData);
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                  Authorization: `token ${access_token}`,
                },
              })
            ).json();
        //깃헙에서 제공해주는 list에서 primary, verified된 email 객체 찾기
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){
            return res.redirect("/login");    
        }
        const existingUser = await User.findOne({email: emailObj.email});
        if(existingUser){
            req.session.loggedIn = true;
            req.session.user = existingUser;
            return res.redirect("/");
        }else{
            const user = await User.create({
                name:userData.name, 
                email:emailObj.email,
                username:userData.login, 
                password: "",
                socialOnly: true,
                location:userData.location,
            });   
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
      } else {
        return res.redirect("/login");
      }
};


export const logout = (req, res) => {};



//회원 정보수정
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle:"Edit Profile" });
};

export const postEdit = async (req, res) => {
    const file = req.file;
    const {
        session : {
            user: { _id, avatarUrl},
        },
        body: {email, username, name, location }, 
    } = req;
    console.log(file);
    const updatedUser = await User.findByIdAndUpdate(_id, 
    {   
        avatarUrl: file ? file.path : avatarUrl,
        email,
        username,
        name,
        location,
    },
    { new : true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};

//비밀번호변경
export const getChangePassword = (req, res) => {
    return res.render("change-password",  { pageTitle:"ChangePassword" });
};

export const postChangePassword = async (req, res) => {
    const {
        session : {
            user: {_id, password},
            //누가 지금 로그인을 하고 있는지 사용자 확인.
        },
        body: {oldPassword, newPassword, newPassword1 },
    } = req;

    const ok = await bcrypt.compare(oldPassword, password);
    if(!ok){
        return res.status(400).render("change-password",  
        { pageTitle:"ChangePassword", 
        errorMessage: "기존 비밀번호가 일치하지 않습니다."});
    }

    if(newPassword !== newPassword1){
        return res.status(400).render("change-password",  
        { pageTitle:"ChangePassword", 
        errorMessage: "새로운 비밀번호가 일치하지 않습니다."});
    }
  const user = await User.findById(_id);
  user.password = newPassword;
  //새로운 비민번호 hash
  await user.save();
  //새로운 비밀번호 세션 업데이트
  req.session.user.password = user.password;
  return res.redirect("/");  
};


//다른 유저 프로필보기
export const see = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate("videos");
    if(!user){
        return res.status(404).render("404", {pageTitle : "User not found."});
    }
    return res.render("profile", { 
        pageTitle: user.name,
        user,
    });
};

export const remove = (req, res) => res.send("Delete User");



