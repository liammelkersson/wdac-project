const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.client = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: '12345',
            database: 'postgres'
        });
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to PostgreSQL database');
            await this.createStoresTable();
            await this.importStoresData();
        } catch (err) {
            console.error('Database connection error:', err.stack);
            throw err;
        }
    }

    async createStoresTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS stores (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url TEXT,
                district VARCHAR(100)
            );
        `;
        try {
            await this.client.query(query);
            console.log('Stores table created or already exists');
        } catch (err) {
            console.error('Error creating stores table:', err.stack);
            throw err;
        }
    }

    async importStoresData() {
        try {
            // First, check if table is empty
            const checkQuery = 'SELECT COUNT(*) FROM stores';
            const { rows } = await this.client.query(checkQuery);

            if (rows[0].count === '0') {
                const storesData = JSON.parse(
                    fs.readFileSync(
                        path.join(__dirname, 'public', 'stores.json'),
                        'utf8'
                    )
                );

                for (const store of storesData) {
                    const query = `
                        INSERT INTO stores (name, url, district)
                        VALUES ($1, $2, $3)
                    `;
                    await this.client.query(query, [
                        store.name,
                        store.url,
                        store.district
                    ]);
                }
                console.log('Stores data imported successfully');
            } else {
                console.log('Stores table already contains data');
            }
        } catch (err) {
            console.error('Error importing stores data:', err.stack);
            throw err;
        }
    }

    async getAllStores() {
        try {
            const query = 'SELECT * FROM stores ORDER BY name';
            const { rows } = await this.client.query(query);
            return rows;
        } catch (err) {
            console.error('Error fetching stores:', err.stack);
            throw err;
        }
    }

    async getStoresByDistrict(district) {
        try {
            const query = 'SELECT * FROM stores WHERE district = $1 ORDER BY name';
            const { rows } = await this.client.query(query, [district]);
            return rows;
        } catch (err) {
            console.error('Error fetching stores by district:', err.stack);
            throw err;
        }
    }

    async deleteStore(id) {
        try {
            const query = 'DELETE FROM stores WHERE id = $1';
            await this.client.query(query, [id]);
        } catch (err) {
            console.error('Error deleting store:', err.stack);
            throw err;
        }
    }

    async disconnect() {
        try {
            await this.client.end();
            console.log('Disconnected from database');
        } catch (err) {
            console.error('Error disconnecting from database:', err.stack);
            throw err;
        }
    }
}

module.exports = new Database();
