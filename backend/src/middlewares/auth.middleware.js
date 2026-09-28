import { readAccessToken } from "../utils/auth.utils.js";
import {blacklistModel} from '../models/blacklist.model.js'

export const authenticate = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  

  if (!accessToken) {
    return res.status(400).json({
      message: "AccessToken not found in request header.",
    });
  }

  const blacklistedtoken = await blacklistModel.findOne({token: accessToken})
  if(blacklistedtoken){
    return res.status(400).json({
      message: "AccessToken is expired.",
    });
  }

  try {
    const decoded = readAccessToken(accessToken);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid access token.",
    });
  }
};

export const authorize = (req, res, next)=>{
    const user = req.user;
    if(user.role != 'seller'){
        return res.status(403).json({
            message: "Unauthorized User."
        })
    }
    next();
}