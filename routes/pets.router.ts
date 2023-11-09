import {Request, Response, Router} from "express";
import {PetRecord} from "../database/records/pet.record";
import * as jwt from "jsonwebtoken";
import {verificateJWT} from "../utils/jwt-verification";
import {Pet} from "../types";

export class PetRouter{
    public readonly router: Router = Router();

    constructor() {
        this.setUpRoutes();
    }

    private setUpRoutes() {
        this.router.get('/getAll',verificateJWT, this.getAllPetsFromOneOwner);
        this.router.post('/addOne',verificateJWT, this.addOne);
        this.router.delete('/deleteOne',verificateJWT,this.deleteOne);
        this.router.put('/updateOne',verificateJWT,this.updateOne);
    }

    private async getAllPetsFromOneOwner(req:Request,res:Response){
        const {id, ...body} = (jwt.decode(req.cookies.jwt) as { id: string, iat: number });

        const petsArr = await PetRecord.getAllFromOneOwner(id);

        res.status(200).json(petsArr);
    }

    private async addOne(req:Request,res:Response){
        const petReq = req.body;
        const {id, ...body} = (jwt.decode(req.cookies.jwt) as { id: string, iat: number });

        const pet:Pet = {...petReq,ownerId:id};
        const newPet = new PetRecord(pet);

        await newPet.add();
        res.sendStatus(200);
    }

    private async deleteOne(req:Request,res:Response){
        const petId = req.body.id;
        const {id, ...body} = (jwt.decode(req.cookies.jwt) as { id: string, iat: number });

        const petToDelete = await PetRecord.getOneFromOneOwner(id,petId);

        await petToDelete.delete();

        res.sendStatus(200);
    }

    private async updateOne(req:Request,res:Response){
        const petReq = req.body;
        const {id, ...body} = (jwt.decode(req.cookies.jwt) as { id: string, iat: number });

        const pet:Pet = {...petReq,ownerId:id};

        const getPet = await PetRecord.getOneFromOneOwner(pet.ownerId,pet.id);

        getPet.name = petReq.name;
        getPet.birthday = petReq.birthday;
        getPet.species = petReq.species;
        getPet.race = petReq.race;

        await getPet.update();

        res.sendStatus(200);
    }
}