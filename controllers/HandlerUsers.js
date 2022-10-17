import db from "../models/index.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Users = db.Users
export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}
 
export const Register = async(req, res) => {
    const { name, email, password, confPassword, roles } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            roles: roles
        });
        res.json({msg: "Register Berhasil"});
    } catch (error) {
        console.log(error);
    }
}
 
export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Salah e Salah e"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const roles = user[0].roles;
        const accessToken = jwt.sign({userId, name, email, roles}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({userId, name, email, roles}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '183d'
        });
        await Users.update({access_token: accessToken, refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        const data = {
            userId,
            email,
            roles,
            accessToken,
            refreshToken,
        };
        return res.status(201).json({
            success: true,
            message: "Login Successfully",
            data: data,
        });
    } catch (error) {
        res.status(404).json({msg:"Email tidak ditemukan"});
    }
}
 
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({access_token : "", refresh_token: ""},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const whoAmI = async (req, res) => {
    try {
        const currentUser = req.user;
        res.status(200).json(currentUser)
    } catch (error) {
        console.log(error)
    }
}

export const RegisterAdmin = async(req,res) => {
    const { name, email, password, confPassword, role } = req.body;
    // if(role == "member") {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Kamu gak bisa nambah admin dengan role member",
    //     });
    // }
    
    // console.log(req.body)

    const tokenUser = req.user;
    console.log(tokenUser)

//     if(role !== "r")
//     if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});

//     handle hanya boleh register kalau rolemu superadmin

//     const salt = await bcrypt.genSalt();
//     const hashPassword = await bcrypt.hash(password, salt);
//     try {
//         await Users.create({
//             name: name,
//             email: email,
//             password: hashPassword,
//             role: role
//         });
//         res.json({msg: "Register Admin Berhasil"});
//     } catch (error) {
//         console.log(error);
//     }
}