import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {}

export const handleError = (err:Error, req:Request, res:Response, next:NextFunction) : void => {

    console.error('err:',err);

    res
        .status(err instanceof ValidationError ? 400 : 500)
        .json({
            message: err instanceof ValidationError ? err.message : 'Something gone wrong, try again latter.',
        });
};