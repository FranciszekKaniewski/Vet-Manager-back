import {Request, Response, Router} from "express";
import {UserRecord} from "../database/records/user.record";
import {User} from "../types";
import * as jwt from "jsonwebtoken";
import {compareSync} from "bcrypt";
import {verificateJWT} from "../utils/jwt-verification";


export class UserRouter {
    public readonly router: Router = Router();

    constructor() {
        this.setUpRoutes();
    }

    private setUpRoutes() {
        this.router.post('/register', this.register)
        this.router.post('/login', this.login)
        this.router.post('/logout', this.logout)
        this.router.get('/info', verificateJWT, this.getData)
        this.router.get('/is_logged', this.isLoggedIn)
    }

    private register = async (req: Request, res: Response) => {
        const {...body}: User = req.body;

        const dbUser = new UserRecord(body as User);
        await dbUser.addOne();

        console.log(`User, ${body.name} was added to db!`);

        res.status(200).end();
    }

    private login = async (req: Request, res: Response) => {
        const {email, password} = req.body;

        const user = await UserRecord.getOneByEmail(email);

        if (!compareSync(password, user.password)) {
            throw new Error("Wrong password!");
        }

        const token = jwt.sign({id: user.id}, "/Ov'm`2>=8|,lPUH2e[r2bCIBqv&/MEyV<,'}sb$,>Xq=&3N(Z-a_7yF9t_xmS(");

        res
            .status(200)
            .cookie("jwt", token, {
                httpOnly: true,
            })
            .end();
    }

    private logout = async (req: Request, res: Response) => {

        res
            .clearCookie("jwt", {
                secure: true,
                sameSite: "none",
            })
            .status(200)
            .json("Logged out!")
    }

    private getData = async (req: Request, res: Response) => {
        const {id, ...body} = (jwt.decode(req.body.token) as { id: string, iat: number })

        const userData = await UserRecord.getOneById(id);
        const {password, ...dataToSend} = userData;

        res.send(dataToSend);
    }

    private isLoggedIn = async (req: Request, res: Response) => {
        const token = req.cookies.jwt

        if (token) {
            jwt.verify(token, "/Ov'm`2>=8|,lPUH2e[r2bCIBqv&/MEyV<,'}sb$,>Xq=&3N(Z-a_7yF9t_xmS(",(err:any)=>{
                if(err) throw new Error(err.message);
            })

            res.status(200).json({isLogged : true})
        }else{
            res.status(401).json({isLogged : false});
        }
    }
}