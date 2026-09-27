import {userModel} from '../models/user.model.js'
import bcrypt from 'bcrypt';
import {createTokens} from '../utils/auth.utils.js'
import {readRefreshToken} from '../utils/auth.utils.js'
import {blacklistModel} from '../models/blacklist.model.js'
 
/**
 * @description Register User and save data from req.body
 * @param req.body {email, name, password}
 */
const registerController = async (req, res)=>{

    const {email, name, password} = req.body;

    const isUserAlreadyExist = await userModel.findOne({email});

    if(isUserAlreadyExist){
        return res.status(400).json({
            message: "User already exists with this email.",
            errors: [
                {
                    field: "Email",
                    message: "User already exists with this email."
                }
            ]
        })
    }

    const user = await userModel.create({
        email,
        name,
        password: await bcrypt.hash(password, 4)
    })

    const {access_token, refresh_token} = createTokens({userID: user._id, role: user.role});

    res.cookie("refreshToken", refresh_token, {
        httpOnly: true
    })

    await userModel.findByIdAndUpdate(user._id, {
        refreshToken: refresh_token
    })

    return res.status(200).json({
        message: "User Registered Successfully.",
        data: {
            user: {
                email: user.email,
                name: user.name,
                id: user._id,
            },
            accessToken: access_token
        }
    })
}


/**
 * @description Login User and create new set of tokens
 * @param req.body {email, password}
 */
const loginController = async (req, res)=>{

    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "Invalid Credentials.",
            errors: [
                {
                    field: "email",
                    message: "No user registered with this email."
                }
            ]
        })  
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
        return res.status(400).json({
            message: "Invalid Credentials.",
            errors: [
                {
                    field: "password",
                    message: "Password Mismatch."
                }
            ]
        })
    }

    const {access_token, refresh_token} = createTokens({userID: user._id, role: user.role});

    res.cookie("refreshToken", refresh_token, {
        httpOnly: true
    })

    await userModel.findByIdAndUpdate(user._id, {
        refreshToken: refresh_token
    })

    return res.status(200).json({
        message: "User Logged in successfully.",
        data: {
            email: user.email,
            name: user.name,
            role: user.role,
            id: user._id 
        },
        accessToken: access_token
    })

}

const logoutController = async(req, res)=> {

    await blacklistModel.create({
        token: req.headers['authorization'].split(' ')[1]
    })

    await userModel.findByIdAndUpdate(req.user.userID, {
        refreshToken: null
    })
    
    res.clearCookie('refreshToken');
    
    return res.status(200).json({
        message: "Logout Successfull"
    })
    

}

const refreshController = async (req, res)=>{

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message: "Refresh token is required.",
        })
    }

    try{
        const decoded = readRefreshToken(refreshToken);
        const {userID, role} = decoded;
        const user = await userModel.findById(userID);

        if(!refreshToken == user.refreshToken){
            await userModel.findByIdAndUpdate(user._id, {refreshToken: null});

            return res.status(400).json({
                message: "Refresh token mismatch."
            })
        }

        const {access_token, refresh_token} = createTokens({userID, role});

        await userModel.findByIdAndUpdate(user._id, {refreshToken: refresh_token});

        res.cookie("refreshToken", refresh_token, {httpOnly: true})

        return res.status(200).json({
            message: "Tokens Rotated Successfully.",
            data: {
                    user: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    id: user._id 
               },
               accessToken: access_token
            }
        })

    }catch(err){
        return res.status(400).json({
            message: "Invalid refresh token."
        })
    }
}

const getmeController = async(req, res)=>{
    const {userID} = req.user;

    const user = await userModel.findById(userID);

    res.status(200).json({
        message: "User Data Fetched Successfully.",
        data: {
            user: {
                email: user.emai,
                name: user.name,
                role: user.role,
                id: user._id
            }
        }
    })

}

export {registerController, loginController, refreshController, getmeController, logoutController}