import {Request, Response, Router} from "express";
import {UserRecord} from "../database/records/user.record";
import {User} from "../types";
import * as jwt from "jsonwebtoken";
import {compareSync} from "bcrypt";


export class UserRouter {
    public readonly router:Router = Router();

    constructor() {
        this.setUpRoutes();
    }

    private setUpRoutes(){
        this.router.post('/register', this.register)
        this.router.post('/login', this.login)
        this.router.post('/logout', this.logout)
    }

    private register = async (req:Request,res:Response)=>{
        const {...body}:User = req.body;

        const dbUser = new UserRecord(body as User);
        await dbUser.addOne();

        console.log(`User, ${body.name} was added to db!`);

        res.status(200).end();
    }

    private login = async (req:Request,res:Response)=>{
        const {email,password} = req.body;

        const user = await UserRecord.getOneByEmail(email);

        if(!compareSync(password,user.password)){
            throw new Error("Wrong password!");
        }

        const token = jwt.sign({id:user.id}, "/Ov'm`2>=8|,lPUH2e[r2bCIBqv&/MEyV<,'}sb$,>Xq=&3N(Z-a_7yF9t_xmS(");

        res
            .status(200)
            .cookie("jwt",token,{
                httpOnly: true,
            })
            .send({password,...user});
    }

    private logout = async (req:Request,res:Response)=>{

        res
            .clearCookie("jwt",{
                secure: true,
                sameSite: "none",
            })
            .status(200)
            .json("Logged out!")
    }
}