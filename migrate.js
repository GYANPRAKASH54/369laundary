// LuxeClean Database Migration & Seeding Script
require('dotenv').config();
const { Client } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.includes("[YOUR-PASSWORD]") || databaseUrl.includes("[YOUR-PROJECT-REF]")) {
    console.error("❌ ERROR: DATABASE_URL is not configured in .env!");
    console.log("Please edit your `.env` file, uncomment DATABASE_URL, and replace [YOUR-PASSWORD] with your actual Supabase DB password.");
    console.log("Example:");
    console.log("DATABASE_URL=postgres://postgres:yourSuperSecurePassword@db.ngzdpmymkgyfhfgujnqw.supabase.co:6543/postgres");
    process.exit(1);
}

const client = new Client({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

const schemaSql = `
-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer'
);

-- 2. Create Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_phone TEXT NOT NULL,
    type TEXT NOT NULL,
    address_line TEXT NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    date TEXT NOT NULL,
    slot TEXT NOT NULL,
    address TEXT NOT NULL,
    address_type TEXT NOT NULL,
    payment TEXT NOT NULL,
    weight REAL NOT NULL,
    items_count INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    latitude REAL DEFAULT 0.0,
    longitude REAL DEFAULT 0.0
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    qty INTEGER NOT NULL,
    weight REAL NOT NULL,
    service_code TEXT NOT NULL,
    service_label TEXT NOT NULL,
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL
);

-- 5. Create Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
`;

const seedSql = `
-- Seed default Admin account if it doesn't exist
INSERT INTO users (name, phone, email, password, role) 
VALUES ('Admin Manager', 'admin', 'admin@luxeclean.com', 'ADMIN123', 'admin')
ON CONFLICT (phone) DO NOTHING;

-- Seed default Customer accounts
INSERT INTO users (name, phone, email, password, role) VALUES 
('Priya Nair', '+91 88390 12345', 'priya@email.com', 'password', 'customer'),
('Amit Patel', '+91 98230 45678', 'amit@email.com', 'password', 'customer'),
('Vikram Singh', '+91 77382 99221', 'vikram@email.com', 'password', 'customer'),
('Rahul Sharma', '+91 99999 88888', 'rahul@email.com', 'password', 'customer')
ON CONFLICT (phone) DO NOTHING;
`;

async function migrate() {
    try {
        console.log("Connecting to Supabase PostgreSQL database...");
        await client.connect();
        console.log("Connected successfully. Running table creations...");
        
        await client.query(schemaSql);
        console.log("✅ Tables created/verified successfully.");

        console.log("Running seed script for default users and credentials...");
        await client.query(seedSql);
        console.log("✅ Default administrator and mock customer users seeded.");

        console.log("\n🎉 Supabase Database Setup Completed Successfully!");
    } catch (err) {
        console.error("❌ Migration failed with error:", err.message);
    } finally {
        await client.end();
    }
}

migrate();
