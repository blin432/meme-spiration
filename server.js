const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({
    path: '.env'
});

var ACCOUNT_SID = process.env.ACCOUNT_SID;
var AUTH_TOKEN = process.env.AUTH_TOKEN;
var TWILIO_NUM = process.env.TWILIO_NUM;

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);


function serverListening(){
    console.log("listening...");
}

function sendAlert(req,res){

    var phoneNumber = req.params.pn.toString();
    var img = req.params.img.toString();
    res.status(200).send("alert succesfully sent!");


    client.messages.create({
         body: "From your friends at Meme-spiration!",
         mediaUrl: img,
         from: TWILIO_NUM,
         to: phoneNumber
       }).then(() => console.log("Alert succesfully sent!")).done();
    }

function sendVerificationCode(req,res){

    var phoneNumber = req.params.pn.toString();
    var code =  Math.floor(100000 + Math.random() * 900000);
    res.status(200).send(code.toString());
   

    client.messages.create({
         body: code,
         from: TWILIO_NUM,
         to: phoneNumber
       }).then(() => console.log("code sent")).done();
    }

app.get('/sendCode/:pn',sendVerificationCode);
app.get('/sendAlert/:pn/:img',sendAlert);
app.listen(3000, serverListening());
app.use(express.static('public'));