import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "createAccount" });

export const postJoin = async (req, res) => {
    const { email, username, password, name, location } = req.body;
    await User.create({
        email, 
        username, 
        password,
        name, 
        location
    });   
    return res.redirect("/login");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const login = (req, res) => res.send("Login User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");




