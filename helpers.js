var db = require('./connection')

module.exports = {
    saveDist:(id,dis)=>{
            let data = {
                discordId : id,
                district : dis,
                age : null
            }
            db.get().collection('users').insertOne(data)
    },
    saveAge:(id,age)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('users').updateOne({discordId:id},
                {
                    $set:{
                        age:age
                    }
                })  
        })
    },
    getData:(id)=>{
        return new Promise(async (resolve,reject)=>{
         let data = await db.get().collection('users').findOne({discordId:id})
        resolve(data)
        })
    }
}
