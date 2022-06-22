const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;
const uuid = require("/utils");

const app = express();
app.use(express.static("./public"));

// middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get request for all the notes in index.js
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.get("api/notes", (req, res) => {
    // logging the info request into the terminal
    console.info(`${req.method} request received to get notes`)
});

// post request to add the note to the side
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add notes`)

    // destructuring items in request . body
    const { title, text } = req.body;
    
    // if the note has a title and text in it..
    if (title && text) {
    
    // all objects that will be saved
    const notes = {
        title,
        text,
        uuid: uuid(),
    };

    // converting the data to a string so it can be saved
    const savedNotes = JSON.stringify(notes, null, 2);

    // taking in the input note title and text (json) and converting it to a string so it can be written to a file

    // writing the string sent to a file
    fs.writeFile("./db/db.json", savedNotes, err => 
        // if there is an error, show it in console, otherwise log the string "Note saved!"
        err 
        ? console.error(err)
        : console.log(`Note saved!`));

        // response when sent
        const response = {
            status: "success",
            body: notes
        };
        console.log(response)
        res.status(201).json(response);
    } else {
            // response when sent
        res.status(500).json("Error in saving note");
    }
});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);
