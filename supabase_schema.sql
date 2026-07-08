-- LuxeClean Supabase Database Schema
-- Copy-paste this SQL into your Supabase SQL Editor to create the necessary tables.

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
