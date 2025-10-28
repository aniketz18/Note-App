const express = require("express");
const path = require("path");
require('dotenv').config();
const app = express();
const fs = require("fs");
const port = process.env.PORT || 4000

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", { files: files });
  });
});

app.get("/files/:filename", (req, res) => {
  fs.readFile(
    `files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      res.render("show",{filename: req.params.filename,data :filedata } );
      console.log(filedata);
    }
  );
});

app.post("/create", (req, res) => {
  console.log(req.body);
  fs.writeFileSync(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    `${req.body.info}`,
    function (error) {}
  );
  res.redirect("/");
});

app.listen(port);
