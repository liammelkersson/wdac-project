// ========== LOADING PACKAGES ==========
const express = require("express");
const cors = require('cors');
const fs = require('fs');
const db = require('./db');

// ========== OTHER VARIABLES ==========
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// define static directory "public"
app.use("/", express.static("public"));

// ========== DEFINING ROUTES ==========
app.get("/", (req, res) => {
  res.send("Welcome to the REST API!");
});
// är detta nödvändigt?
// app.get("/api/stores", (req, res) => {
//   res.sendFile("/index.html");
// });

//läser direkt stores.json filen
// app.get("/api/stores", (req, res) => {
//   // Here you would normally fetch items from a database
//   fs.readFile(__dirname + `/public/stores.json`, `utf8`, (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: `Failed to read file` });
//     }
//     try {
//       const jsonData = JSON.parse(data);
//       res.json(jsonData);
//     } catch (parseError) {
//       res.status(500).json({ error: `Failed to parse JSON data` });
//     }
//   });
// });

app.get('/api/stores', async (req, res) => {
    try {
        const stores = await db.getAllStores();
        res.json(stores);
    } catch (err) {
        console.error('Error fetching stores:', err);
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});

// ========== RUNS APP & LISTENS ON PORT:  ==========
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//   });

async function startServer() {
    try {
        await db.connect();
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

  startServer();

// Handle shutdown gracefully
process.on('SIGTERM', async () => {
    await db.disconnect();
    process.exit(0);
});
