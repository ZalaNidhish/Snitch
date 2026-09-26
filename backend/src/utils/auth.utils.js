import jwt from 'jsonwebtoken';

import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from '../config/config.js'

export const createTokens = ({userID, role})=>{
    const access_token = jwt.sign({userID, role}, ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    const refresh_token = jwt.sign({userID, role}, REFRESH_TOKEN_SECRET, {expiresIn: '7d'})

    return {access_token, refresh_token};
}

export const readRefreshToken = (refreshToken)=>{
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
}

export const readAccessToken = (accessToken)=>{
    return jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
}