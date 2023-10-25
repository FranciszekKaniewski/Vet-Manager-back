import * as jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {JsonWebTokenError, JwtPayload} from "jsonwebtoken";

export const verificateJWT = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.jwt;

    if (token) {

        jwt.verify(token, "/Ov'm`2>=8|,lPUH2e[r2bCIBqv&/MEyV<,'}sb$,>Xq=&3N(Z-a_7yF9t_xmS(", (err:JsonWebTokenError, user:JwtPayload) => {
            if (err) {
                return res.sendStatus(403);
            }

            (req as any).user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};