import {pool} from "./utils/pool";

(async ()=>{

    const [results] = (await pool.execute("SELECT * FROM `users`"));

    console.log(results)

})()
