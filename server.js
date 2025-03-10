// ========== LOADING PACKAGES ==========
const express = require("express");
const cors = require('cors');
const fs = require('fs');
const db = require('./db');

// ========== OTHER VARIABLES ==========
const app = express();
const port = 3000;

// ========== MIDDLEWARE ==========
// enables CORS for all routes
app.use(cors());
// serves static files from public directory
app.use(express.static("public"));
// parse JSON bodies
app.use(express.json());

// ========== DEFINING ROUTES/END-POINTS ==========
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/stores", (req, res) => {
    res.sendFile(__dirname + "/public/stores.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});

//========== REST API ==========
// fetching stores
app.get('/api/stores', async (req, res) => {
    try {
        const stores = await db.getAllStores();
        res.json(stores);
    } catch (err) {
        console.error('Error fetching stores:', err);
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});

//deleting individual stores
app.delete('/api/stores/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.deleteStore(id);
        res.status(200).json({ message: 'Store deleted successfully' });
    } catch (err) {
        console.error('Error deleting store:', err);
        res.status(500).json({ error: 'Failed to delete store' });
    }
});

// updating store information
app.put('/api/stores/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, url, district } = req.body;
        await db.updateStore(id, { name, url, district });
        res.status(200).json({ message: 'Store updated successfully' });
    } catch (err) {
        console.error('Error updating store:', err);
        res.status(500).json({ error: 'Failed to update store' });
    }
});

// creating new store
app.post('/api/stores', async (req, res) => {
    try {
        const { name, url, district } = req.body;
        const query = 'INSERT INTO stores (name, url, district) VALUES ($1, $2, $3) RETURNING *';
        const result = await db.client.query(query, [name, url, district]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating store:', err);
        res.status(500).json({ error: 'Failed to create store' });
    }
});

// ========== RUNS SERVER & LISTENS ON PORT  ==========
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

// handles shutdown in a proper way
process.on('SIGTERM', async () => {
    await db.disconnect();
    process.exit(0);
});
