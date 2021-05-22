var db = require('./connection')

module.exports = {
    saveDist:(id,dis)=>{
        return new Promise(async (resolve, reject)=>{
            
            let user = await db.get().collection('users').findOne({discordId:id})
            if(user){
                resolve(true)
            }
            else{
                let data = {
                    discordId : id,
                    district : dis,
                }
                db.get().collection('users').insertOne(data)
            }
        })
    },
    getData:(id)=>{
        return new Promise(async (resolve,reject)=>{
         let data = await db.get().collection('users').findOne({discordId:id})
        resolve(data)
        })
    },
    check:(id)=>{
        return new Promise(async (resolve, reject)=>{
            
            let user = await db.get().collection('users').findOne({discordId:id})
            if(user){
                resolve(true)
            }
            else resolve(false)
        })
    },
    update:(id, dis)=>{
        db.get().collection('users').updateOne({discordId:id},
            {
                $set:{
                    district : dis,
                }
            })
    }
}
