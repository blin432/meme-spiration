const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({
    path: '.env'
});

var accountSid = process.env.ACCOUNT_SID;
var authToken = process.env.AUTH_TOKEN;
var twilioNum = process.env.TWILIO_NUM;

const client = require('twilio')(accountSid, authToken);


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
         from: twilioNum,
         to: phoneNumber
       }).then(() => console.log("Alert succesfully sent!")).done();
    }

function sendVerificationCode(req,res){

    var phoneNumber = req.params.pn.toString();
    var code =  Math.floor(100000 + Math.random() * 900000);
    res.status(200).send(code.toString());
   

    client.messages.create({
         body: code,
         from: twilioNum,
         to: phoneNumber
       }).then(() => console.log("code sent")).done();
    }

app.get('/sendCode/:pn',sendVerificationCode);
app.get('/sendAlert/:pn/:img',sendAlert);
app.listen(3000, serverListening());
app.use(express.static('public'));