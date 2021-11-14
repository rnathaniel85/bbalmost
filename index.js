var express = require('express');
var app     = express();
var cors    = require('cors');
var dal     = require('./dal.js');
const e = require('express');
var MongoClient = require('mongodb').MongoClient;
const fireBaseApp = require('firebase/app').initializeApp;
const firebaseAuth = require("firebase/auth");

// the name "mongo" comes from the docker link, in the docker-compose.yml
var url = 'mongodb://badbankdb:27017/BadBank2';
var db;

MongoClient.connect(url, function (err, database) {
    if(err){ console.log('failed to connect: ' + err); return;}
    db = database;
    console.log("Connected correctly to server!!");
});

// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors());

const firebaseConfig = {
    apiKey: "AIzaSyAcRtS49b734Ksm0g3_TpjepflZCPfazX4",
    authDomain: "curso-e599b.firebaseapp.com",
    databaseURL: "https://curso-e599b-default-rtdb.firebaseio.com",
    projectId: "curso-e599b",
    storageBucket: "curso-e599b.appspot.com",
    messagingSenderId: "719936613513",
    appId: "1:719936613513:web:60fb3b8431434893f5aa58"
  };
const fireapp = fireBaseApp(firebaseConfig);
const auth = firebaseAuth.getAuth(fireapp);




// create user account
app.get('/account/create/:name/:email/:password', function (req, res) {

    // check if account exists
    dal.find(req.params.email).
        then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already in exists');                
                res.status(409).send('User already in exists');
            }
            else{
                // else create user
                return dal.create(req.params.name,req.params.email,req.params.password).
                    then((user) => {
                        return firebaseAuth.createUserWithEmailAndPassword(auth, req.params.email, req.params.password)
                        .then((userCredential) => {
                            console.log("your in", userCredential);
                            const firebaseUser = userCredential.user;                            
                            firebaseUser.getIdToken().then(token => { 
                                const response = {user:{name:user.name, email:firebaseUser.email, balance:user.balance ,token:token}}
                                return res.send(response);
                            })                        
                        })           
                    });            
            }

        });
});


// login user 
app.get('/account/login/:email/:password', function (req, res) {

    dal.find(req.params.email).
        then((user) => {

            // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    // res.send(user[0]);
                    return firebaseAuth.signInWithEmailAndPassword(auth, req.params.email, req.params.password)
                    .then((userCredential) => {
                        console.log("Logged in backend", userCredential);
                        const firebaseUser = userCredential.user;                                                
                        firebaseUser.getIdToken().then(token => { 
                            const response = {user:{name:user[0].name, email:firebaseUser.email, balance:user[0].balance ,token:token}}
                            return res.send(response);
                        })                        
                    })
                }
                else{
                    res.send('Login failed: wrong password');
                }
            }
            else{
                res.send('Login failed: user not found');
            }
    });
    
});

// login user 
app.get('/account/logout/:email', function (req, res) {

    dal.find(req.params.email).
        then((user) => {
            console.log(req.params.email)
            console.log(user)
            // if user exists, check password
            if(user.length > 0){       
                firebaseAuth.signOut(auth)              
                res.send('User logged out')
            }
            else{
                res.send('Logout failed: user not found');
            }
    });
    
});

// find user account
app.get('/account/find/:email', function (req, res) {

    dal.find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', function (req, res) {

    dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});


// update - deposit/withdraw amount
app.get('/account/update/:email/:amount', function (req, res) {

    var amount = Number(req.params.amount);

    dal.update(req.params.email, amount).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
});

// all accounts
app.get('/account/all', function (req, res) {

    dal.all().
        then((docs) => {
            console.log(docs);
            res.send(docs);
    });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Running on port: ' + port);