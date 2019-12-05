var MongoClient=require('mongodb').MongoClient;
var state={
    db:null
};
exports.connect = function (url,inf,done) {
    if(state.db){
        return done();
    }
    MongoClient.connect(url,{ useUnifiedTopology: true },function (err,db) {
        if(err){
            return done(err);
        }
        state.db=db.db('storeapi');
        done();
    })
}
exports.get =function () {
    return state.db;

}