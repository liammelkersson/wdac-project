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
// app.use("/", express.static("public"));
// app.use("/admin", express.static("public"));
// app.use("/stores", express.static("public"));

app.use(express.static("public"));

// ========== DEFINING ROUTES ==========
app.get("/stores", (req, res) => {
    res.sendFile(__dirname + "/public/stores.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/api/stores', async (req, res) => {
    try {
        const stores = await db.getAllStores();
        res.json(stores);
    } catch (err) {
        console.error('Error fetching stores:', err);
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});

// ========== RUNS SERVER & LISTENS ON PORT:  ==========
async function startServer() {
    try {
        await db.connect();
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
        //error handling
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
startServer();

// Handle shutdown gracefully????
process.on('SIGTERM', async () => {
    await db.disconnect();
    process.exit(0);
});
