const mongoClient=require('mongodb').MongoClient;
const state={
    db:null
}

module.exports.connect=function(done){
    const url='mongodb+srv://thabsheer:thabsheer@123@cluster0.h94qs.mongodb.net/User.data?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db("cowinBot")
        done()
    })
}

module.exports.get=function(){
    return state.db
}
