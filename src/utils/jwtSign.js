import jwt from 'jsonwebtoken';
export function signJwt(payload,secret,options={}){
    return jwt.sign(payload,secret,options);
}