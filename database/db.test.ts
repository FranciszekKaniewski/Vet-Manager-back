import {UserRecord} from "./records/user.record";
import {Pet, User} from "../types";
import {PetRecord} from "./records/pet.record";

(async ()=>{

    // UserRecord
    const userObj:User = {id:'test',name:"Test",surname:"Test",email:"Test@gmail.com",password:"Test1234",role:'user'};
    const newUser = new UserRecord(userObj);
    console.log("New user:",newUser);

    // await newUser.addOne();

    const allUsers = await UserRecord.getAll();
    // console.log("All users: ",allUsers);

    const oneUserById = await UserRecord.getOneById('test');
    // console.log("One user taken by id: ",oneUserById);

    const oneUserByEmail = await UserRecord.getOneByEmail("Test@gmail.com")
    // console.log("One user taken by e-mail: ",oneUserByEmail);


    //PetRecord
    const petObj:Pet={id:"test",birthday:"2012/12/02",name:"Test",species:"test",race:"test",ownerId:oneUserById.id};
    const newPet = new PetRecord(petObj);
    // console.log("New pet:",newPet);

    newPet.name = 'Edited';
    await newPet.update();

    await newPet.add();

    const allPetsFromOneUser = await PetRecord.getAllFromOneOwner(oneUserById.id);
    // console.log(allPetsFromOneUser);

    const onePetFromOneUser =await PetRecord.getOneFromOneOwner(oneUserById.id,newPet.id);
    // console.log(onePetFromOneUser);

    await onePetFromOneUser.delete();
})()
