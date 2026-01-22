
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from '../config/index.js';

// Setup connection pool
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

// Setup Prisma Adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma with adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
