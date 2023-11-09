import {FieldPacket} from "mysql2";
import {User} from "../../types";
import {pool} from "../utils/pool";
import {Cypher} from "../../utils/Ciphering/Cypher";
import {ValidationError} from "../../utils/errors";
import {v4 as uuid} from "uuid"

type UserResult = [User[],FieldPacket[]]

export class UserRecord implements User{
    id?: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    avatar?: string | null;
    phoneNumber?: number | null;
    role: 'admin'|'doctor'|'user';

    constructor(obj:User) {
        this.id = obj.id ? obj.id : uuid();
        this.name = obj.name;
        this.surname = obj.surname;
        this.email = obj.email;
        this.password = obj.password;
        this.phoneNumber = obj.phoneNumber;
        this.avatar = obj.avatar;
        this.role = obj.role;

        this.validation();
    }

    private validation() {
        const containsUpperCaseLetter = (string:string) => string.toLowerCase() !== string;
        const containsNumber = (string:string) => /\d/.test(string);

        const {name,surname,email,password,phoneNumber} = this;

        if(name.length < 3 || name.length > 60) throw new ValidationError("Name should have more than 3 characters and less than 61.");
        if(surname.length < 3 || surname.length > 60) throw new ValidationError("Surname should have more than 3 characters and less than 61.");
        if(!email.includes('@') || surname.length < 3 || surname.length > 60) throw new ValidationError("E-mail have to be between maximum 60 and minimum 3 characters and contains @ character.");
        if(password.length < 7 || password.length > 60 || !containsUpperCaseLetter(password) || !containsNumber(password)) throw new ValidationError("Password have to be between maximum 60 and minimum 7 characters, contains capital letter and number.");
        if(phoneNumber){
            if(phoneNumber.toString().length !== 9) throw new ValidationError("Phone number have to contains 9 characters.");
        }
    }

    public static async getAll():Promise<User[]>{
        const [result] = (await pool.execute("SELECT * FROM `users`") as UserResult);

        return result.map(user => new UserRecord(user));
    }

    public static async getOneById(id:string):Promise<User|null>{
        const [results] = await pool.execute("SELECT * FROM `users` WHERE id = :id",{
            id:id,
        }) as UserResult

        return results[0] ? new UserRecord(results[0]) : null;
    }

    public static async getOneByEmail(email:string):Promise<User|null>{
        const [results] = await pool.execute("SELECT * FROM `users` WHERE email = :email",{
            email:email,
        }) as UserResult

        if(results.length === 0) throw new ValidationError("User with that e-mail do not exist!");

        return results[0] ? new UserRecord(results[0]) : null;
    }

    public async addOne():Promise<User>{
        const allEmails:string[] = ((await UserRecord.getAll()).map(e=>e.email));
        if(allEmails.filter(email=>email === this.email).length) throw new ValidationError("This email is already taken.");

        const userData = {
            id: this.id,
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: Cypher(this.password),
            phoneNumber: this.phoneNumber ? this.phoneNumber : null,
            avatar: this.avatar ? this.avatar : null,
            role: this.role,
        }

        await pool.execute("INSERT INTO `users` (`id`,`name`,`surname`,`email`,`password`,`phone-number`,`avatar`,`role`) VALUES (:id,:name,:surname,:email,:password,:phoneNumber,:avatar,:role)",
            userData,
        );


        return new UserRecord(userData);
    }
}