import {Request, Response, Router} from "express";


export class UserRouter{
    public readonly router:Router = Router();

    constructor() {
        this.setUpRoutes();
    }

    private setUpRoutes(){
        this.router.post('/register', this.register)
    }

    private register = async (req:Request,res:Response)=>{
        const {...body} = req.body;
    }
}