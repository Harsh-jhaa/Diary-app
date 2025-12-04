import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';


// create access token 

export const createRefreshToken = (payload) =>{
    return jwt.sign(payload,REFRESH_TOKEN_SECRET, {expiresIn:REFRESH_TOKEN_EXPIRY});
}
// create access token
export const createAccessToken = (payload) =>{
    return jwt.sign(payload,ACCESS_TOKEN_SECRET, {expiresIn:ACCESS_TOKEN_EXPIRY});
}

// Quickly verify access tokeN
export const verifyAccessToken = (token)=>{
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

// Quickly verify refresh tokeN
export const verifyRefreshToken = (token)=>{
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
