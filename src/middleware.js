import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    /*
        locals는 뭐든 할 수 있는 object(추가, 제거 뭐든 넣어둬됨)
        굳이 import, render 해주지 않아도 template이 locals object에 접근 할 수 있음.
        (이미 pug, expresss에 설정 돼 있기 때문)
    */
    res.locals.siteName="YoungTube";
    res.locals.loggedInUser = req.session.user || {};
    next();
};

//login 하지 않은 유저가 edit-profile 경로로 가지 못하게 페이지 보호 
export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        next();
    } else {
        req.flash("error", "로그인하세요.");
        return res.redirect("/login");
    }
};



export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else {
        req.flash("error", "접근할 수 없습니다.");
        //메시지 타입, 내용 
        return res.redirect("/");
    }
};

export const avatarUpload = multer({ 
    dest: "uploads/avatars/", 
    limits: {
    fieldSize: 3000000,
    },
});

export const videoUpload = multer({ 
    dest: "uploads/videos/",
    limits: {
        fieldSize:10000000,
    },
 });

    