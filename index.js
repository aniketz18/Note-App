const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
const fs = require("fs");
const port = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      console.error("Error reading files folder:", err);
      files = []; // fallback if folder missing or error
    }
    res.render("index", { files });
  });
});

app.get("/files/:filename", (req, res) => {
  fs.readFile(
    `files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      res.render("show", { filename: req.params.filename, data: filedata });
      console.log(filedata);
    }
  );
});

// create the task
app.post("/create", (req, res) => {
  const fileName = req.body.title.split(" ").join("") + ".txt";
  const filePath = `./files/${fileName}`;
  fs.writeFile(filePath, req.body.info, (err) => {
    if (err) console.error("Error writing file:", err);
    res.redirect("/");
  });
});

// route to delete the task

app.get("/delete/:filename", (req, res) => {
  const fs = require("fs");
  const file = req.params.filename;

  fs.unlink(`files/${file}`, (err) => {
    if (err) {
      console.log(err);
      return res.send("Error deleting file");
    }
    res.redirect("/");
  });
});

// app running on port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
