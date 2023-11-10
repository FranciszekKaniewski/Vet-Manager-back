import {Request, Response, Router} from "express";
import {UserRecord} from "../database/records/user.record";
import {User} from "../types";
import * as jwt from "jsonwebtoken";
import {compareSync} from "bcrypt";
import {verificateJWT} from "../utils/jwt-verification";
import {ValidationError} from "../utils/errors";


export class UserRouter {
    public readonly router: Router = Router();

    constructor() {
        this.setUpRoutes();
    }

    private setUpRoutes() {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
        this.router.post('/logout', this.logout);
        this.router.get('/info', verificateJWT, this.getData);
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
            throw new ValidationError("Wrong password!");
        }

        const token = jwt.sign({id: user.id}, "/Ov'm`2>=8|,lPUH2e[r2bCIBqv&/MEyV<,'}sb$,>Xq=&3N(Z-a_7yF9t_xmS(");

        res
            .status(200)
            .cookie("jwt", token, {
                secure:true,
                sameSite: 'none',
                maxAge: 900000,
                httpOnly: true,
            })
            .json({message:"logged in"});
    }

    private logout = async (req: Request, res: Response) => {

        res
            .clearCookie("jwt", {
                secure: true,
                sameSite: "none",
            })
            .status(200)
            .json("Logged out!");
    }

    private getData = async (req: Request, res: Response) => {
        const {id, ...body} = (jwt.decode(req.cookies.jwt) as { id: string, iat: number });

        const userData = await UserRecord.getOneById(id);
        const {password, ...dataToSend} = userData;

        res.send(dataToSend);
    }
}