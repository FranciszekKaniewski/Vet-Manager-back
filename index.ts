import express from 'express'
import 'express-async-errors'
import cookieParser from 'cookie-parser'
import {Application} from "express";
import cors from 'cors'
import {UserRouter} from "./routes/user.router";
import {handleError} from "./utils/errors";
import {PetRouter} from "./routes/pets.router";


export class App{
    private app: Application;

    constructor() {
        this.configApp();
        this.setRoutes();
        this.run();
    }

    private configApp() {
        this.app = express();

        this.app.use(cookieParser());
        this.app.use(cors({credentials: true,origin:'https://wet-manager-app.netlify.app'}));
        this.app.use(express.json());
    }

    private setRoutes() {
        this.app.use('/user', new UserRouter().router);
        this.app.use('/pet', new PetRouter().router);
    }

    private run() {
        console.log(process.env.JAWSDB_KEY)
        this.app.use(handleError);
        this.app.listen(process.env.PORT || 3001,()=>{
            console.log('Listening on http://localhost:3001/');
        })
    }
}

new App();