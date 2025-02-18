const express = require("express");
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
  res.send("Welcome to the REST API!");
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//APP GET REQ

// GET -----------------------------------------------
app.get("/api/shops", (req, res) => {
  // Here you would normally fetch items from a database
  fs.readFile(`./stores.json`, `utf8`, (err, data) => {
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
