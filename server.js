const express = require("express");
const cors = require("cors");
const fs = require('fs');
const file = require("./file.json");
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.

app.get("/", function(request, response) {
    response.send("welcome Chat");
});


app.get("/file", function(request, response) {
    response.send(file);
});

app.post("/file/add", (req, res) => {
    const message = req.body
    message.id = file[file.length - 1].id + 1;
    console.log("esto", file.length);
    const chats = file;
    chats.push(message);
    fs.writeFileSync("./file.json", JSON.stringify(chats), () => {});
    res.send(message);
});

app.delete("/file/:id", (req, res) => {
    const id = req.params.id;
    const chat = file.filter(el => el.id === Number(id));
    let chats = file;
    let index = chats.indexOf(chat[0]);
    chats.splice(index, 1);
    fs.writeFileSync("./file.json", JSON.stringify(chats), () => {});
    res.status(200).json({ succes: true });
})

app.get("/file/:id", (req, res) => {
    const id = req.params.id;
    const chat = file.filter(el => el.id === Number(id));
    res.send(chat);
})
app.listen(4001, function() {
    console.log("Your app is listening on port 4001");
});