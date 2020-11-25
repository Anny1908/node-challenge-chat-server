const express = require("express");
const cors = require("cors");
const fs = require('fs');
const file = require("./file.json");
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const newChats = file;


//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.

app.get("/", function(request, response) {
    response.send("welcome Chat");
});

app.get("/messages", function(request, response) {
    response.send(newChats);
});

app.get("/messages/search", (req, res) => {
    let texto = req.query.text;
    let search = newChats.find(element => element.text.includes(texto));
    console.log(newChats);
    res.send(search);
});

app.get("/messages/latest", (req, res) => {
    let ultimos = newChats.slice(-10);
    res.send(ultimos);
})

app.get("/messages/:id", (req, res) => {
    const id = req.params.id;
    const chat = newChats.find(el => el.id === Number(id));
    console.log("id", id);
    res.send(chat);
})
app.post("/messages", (req, res) => {
    const message = req.body
    message.id = newChats[newChats.length - 1].id + 1;
    console.log("esto", newChats.length);
    if (message.from == "" || message.from == undefined) {
        res.sendStatus(400);
    } else if (message.text == "" || message.text == undefined) {
        res.sendStatus(400);
    } else {
        newChats.push(message);
        message.timeSent = new Date();
    }
    fs.writeFileSync("./file.json", JSON.stringify(newChats), () => {});
    res.send(message);
});

app.delete("/messages/:id", (req, res) => {
    const id = req.params.id;
    const chat = file.filter(el => el.id === Number(id));
    let newChats = file;
    let index = newChats.indexOf(chat[0]);
    newChats.splice(index, 1);
    fs.writeFileSync("./file.json", JSON.stringify(newChats), () => {});
    res.status(200).json({ succes: true });
})


app.listen(4001, function() {
    console.log("Your app is listening on port 4001");
});