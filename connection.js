const mongoClient=require('mongodb').MongoClient;
require('dotenv').config()
const state={
    db:null
}

module.exports.connect=function(done){
    const url=process.env.MONGO_URL;

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db("cowinBot")
        done()
    })
}

module.exports.get=function(){
    return state.db
}
