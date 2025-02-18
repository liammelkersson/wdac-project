const express = require("express");
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use("/", express.static("public"));

// GET -----------------------------------------------
app.get("/", (req, res) => {
  res.send("Welcome to the REST API!");
});

app.get("/api/shops", (req, res) => {
  res.sendFile("/index.html");
  //res.send ("welcome to the REST API")
});

app.get("/api/stores", (req, res) => {
  // Here you would normally fetch items from a database
  fs.readFile(__dirname + `/public/stores.json`, `utf8`, (err, data) => {
    if (err) {
      return res.status(500).json({ error: `Failed to read file` });
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: `Failed to parse JSON data` });
    }
  });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
