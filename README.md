# Digital-Crafts-Project
## Meme-spiration

Create, organize and update your tasks and set alerts to
receive meme push notifications.

## Group members include

  - Hawazin Abdullah
  - Benjamin Lin
  - Merry Mac Miller
  - Faris Huskovic


## Order of Dependency Installation

    npm install -g node
    npm init
    npm install express --save
    npm install axios --save
    npm install twilio --save

## Running

    node server.js

## Endpoints

| endpoint    |  params      |example request                 |
| ----------- |--------------|--------------------------------|
| /sendCode/  | phone number |baseURL/sendCode/7701234567     |
| /sendAlert/ | phone number, image | baseURL/sendCode/7701234567/uriEncodedimgPath.jpg|

