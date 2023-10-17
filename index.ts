import * as express from 'express'
import 'express-async-errors'
import {Application} from "express";
import * as cors from 'cors'
import {UserRouter} from './routes/user.router'


export class App{
    private app: Application;

    constructor() {
        this.configApp();
        this.setRoutes();
        this.run();
    }

    private configApp() {
        this.app = express();
        this.app.use(cors({origin:'http://localhost:3000'}))

        this.app.use(express.json())
    }

    private setRoutes() {
        this.app.use('/user', new UserRouter().router)
    }

    private run() {
        this.app.listen(3001,'localhost',()=>{
            console.log('Listening on http://localhost:3001/')
        })
    }
}

new App();