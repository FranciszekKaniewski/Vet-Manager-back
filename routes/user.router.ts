import {Request, Response, Router} from "express";
import {UserRecord} from "../database/records/user.record";
import {User} from "../types";


export class UserRouter {
    public readonly router:Router = Router();

    constructor() {
        this.setUpRoutes();
    }

    private setUpRoutes(){
        this.router.post('/register', this.register)
    }

    private register = async (req:Request,res:Response)=>{
        const {...body}:User = req.body;
        const newUser = new UserRecord(body);

        //@ToDO cypher the password! here

        await newUser.addOne();

        res.end();
    }
}