var db = require('./connection')

module.exports = {
    saveDist:(id,dis)=>{
        return new Promise(async (resolve, reject)=>{
        
            let data = {
                discordId : id,
                district : dis,
                updates: false
            }
            db.get().collection('users').insertOne(data)
        resolve(true)
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
        return new Promise(async (resolve, reject)=>{
            db.get().collection('users').updateOne({discordId:id},
                {
                    $set:{
                        district : dis,
                    }
                })
                resolve(true)
        })   
    },
    register4updates:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('users').updateOne({discordId:id},
                {
                    $set:{
                        updates : true,
                    }
                })
                resolve(true)
        })
    },
    updateList:()=>{
        return new Promise(async (resolve,reject)=>{
          let users = await db.get().collection('users').find({updates:true}).toArray()
          resolve(users)
        })
    },
    stopUpdates:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('users').updateOne({discordId:id},
                {
                    $set:{
                        updates : false,
                    }
                })
                resolve(true)
        })
    }
}
