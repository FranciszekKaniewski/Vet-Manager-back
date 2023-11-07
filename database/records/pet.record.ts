import {Pet} from "../../types";
import {FieldPacket} from "mysql2";
import {pool} from "../utils/pool";
import * as moment from "moment";
import {v4 as uuid} from "uuid"

type PetsResult = [Pet[],FieldPacket[]]

export class PetRecord implements Pet{
    id:string;
    name:string;
    species:string;
    race?:string;
    birthday:string;
    ownerId:string;

    constructor(obj:Pet) {
        this.id = obj.id ? obj.id : uuid();
        this.name = obj.name;
        this.species = obj.species;
        this.race = obj.race;
        this.birthday = obj.birthday;
        this.ownerId = obj.ownerId;

        this.validation();
    }

    private validation(){

    }

    public static async getAllFromOneOwner(ownerId:string):Promise<PetRecord[]|null>{
        const [result] = await pool.execute("Select * FROM `pets` WHERE ownerId = :ownerId",{
            ownerId:ownerId,
        }) as PetsResult;

        const formattedArr = result.map(pet=> {
            const d = moment.utc(`${pet.birthday} UTC`).format("YYYY-MM-DD");
            const newPet:Pet = {...pet,birthday:d};
            return new PetRecord(newPet)
        })

        return result.length ? formattedArr : null;
    }

    public static async getOneFromOneOwner(ownerId:string,petId:String):Promise<PetRecord>{
        const [result] = await pool.execute("Select * FROM `pets` WHERE ownerId = :ownerId AND id = :id",{
            ownerId:ownerId,
            id:petId,
        }) as PetsResult;

        const formattedDataObj = {birthday:moment.utc(result[0].birthday).format('YYYY-MM-DD'),...result[0]}

        return new PetRecord(formattedDataObj);
    }

    public async add():Promise<void>{

        const petData = {
            id: this.id,
            name:this.name,
            birthday:this.birthday,
            species:this.species,
            race: this.race,
            ownerId:this.ownerId
        }

        await pool.execute("INSERT INTO `pets`(`id`, `name`,`birthday`, `species`, `race`, `ownerID`) VALUES (:id,:name,:birthday,:species,:race,:ownerId)",
            petData,
        )
    }

    public async delete():Promise<void>{
        await pool.execute("DELETE FROM `pets` WHERE id = :id",{
            id:this.id,
        })
    }

    public async update():Promise<void>{

        const petData = {
            id: this.id,
            name:this.name,
            birthday:this.birthday,
            species:this.species,
            race: this.race,
            ownerId:this.ownerId
        }

        await pool.execute("UPDATE `pets` SET `name`=:name,`species`=:species,`race`=:race,`birthday`=:birthday,`ownerId`=ownerId WHERE id = :id",
            petData,
        )
    }
}