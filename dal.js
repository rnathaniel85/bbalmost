const MongoClient = require('mongodb').MongoClient;
const url         = 'mongodb://localhost:27017';
let db            = null;
 
// connect to mongo
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {

    if(err){
        console.log("Failed to connect " + err);
    }else{
        console.log("Connected successfully to db server");

        // connect to myproject database
        db = client.db('myproject');
    }
   
});

// create user account
function create(name, email, password, userID){
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, password, userID ,balance: 0, activity:[]};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

// Get Balance function
function getBalance(userID) {
    return new Promise((resolve, reject) => {
        const customer = db
            .collection('users')
            .find({"userID": userID})
            .toArray(function(err,user) {
                err ? reject(err) : resolve (user);
            });
    })
}


// Function to update user Balance
function updateUserBalance(userID, newBalance){
    return new Promise((resolve, reject) => {    
        const customer = db
            .collection('users')            
            .updateOne({"userID": userID }, {$set : {"balance" : newBalance} })
            .then((result) => {
                console.log(result)
                resolve(result)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            });  
    });   
}


// Update Activity Function
function updateActivity(userID, depositDateTime,newBalance ) {
    return new Promise((resolve, reject) => {
        const customer = db
            .collection('users')
            .updateOne({"userID" : userID}, {$push : {"activity" : {"datetime" : depositDateTime, "balance" : newBalance}}})
            .then((result) => {
                console.log(result)
                resolve(result)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            });
    })
}
// Function to return all users data
function all(){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}


module.exports = {create, getBalance, updateUserBalance, updateActivity, all};