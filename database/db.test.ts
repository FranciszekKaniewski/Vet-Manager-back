import {pool} from "./utils/pool";
import {UserRecord} from "./records/user.record";
import {User} from "../types";

(async ()=>{

    const users = await UserRecord.getAll();
    console.log(users);

    const newUser:UserRecord = new UserRecord({name:"Tomm",surname:"Smith",email:"TomwwS@gmail.com",password:"Password123",role:'user'})
    const result = await newUser.addOne();
    console.log(result)

})()
