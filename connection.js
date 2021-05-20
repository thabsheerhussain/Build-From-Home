const mongooose = require('mongoose');
const { MongoClient } = require("mongodb");
  
module.exports.connect=async function () {
    try {
        const dbName="User"; 
        const url = 'mongodb+srv://thabsheer:thabsheer@123@cluster0.h94qs.mongodb.net/User.data?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true'
        const client = new MongoClient(url);
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
         // Use the collection "people"
         const col = db.collection("people"); 
      
    } catch (err) {
        console.log(err.stack);
    }
   
}



// module.exports.storeDis = async function(id,dis) {

//        let personDocument = {
//         "discordID": name,
//         "discordID":id
        
//     }
//     // Insert a single document, wait for promise so we can read it back
//     const p = await col.insertOne(personDocument);

//   }

module.exports.storeDis = async function(id,dis) {

let personDocument = {
    "discordId": id,
    "district":dis
}

 // Insert a single document, wait for promise so we can read it back
 await col.insertOne(personDocument);

}  