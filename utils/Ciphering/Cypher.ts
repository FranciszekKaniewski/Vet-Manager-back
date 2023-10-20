import {hashSync} from 'bcrypt'
const saltRounds = 10;

export const Cypher = (password:string):string => (
    hashSync(password,saltRounds)
);