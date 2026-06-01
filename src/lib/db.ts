import { Pool, Client } from 'pg';
import { weddingConfig } from '@/config/wedding';

export interface DbGreeting {
  id: number;
  name: string;
  message: string;
  approved: boolean;
  created_at: string;
}

// In-memory mock database fallback for local dev when Postgres is not set
let mockGreetings: DbGreeting[] = weddingConfig.guestbook.initialGreetings.map((g, idx) => ({
  id: idx + 1,
  name: g.name,
  message: g.message,
  approved: true, // Initial mock greetings are public/approved
  created_at: new Date(g.created_at).toISOString()
}));

// Helper to determine if we have a live Postgres connection string
const isDbConnected = (): boolean => {
  const connectionString = 
    process.env.POSTGRES_URL || 
    process.env.sanaya_POSTGRES_URL || 
    process.env.samaya_POSTGRES_URL;
  return (
    typeof connectionString === 'string' && 
    connectionString.trim().length > 0 &&
    (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://'))
  );
};

// Lazy pool helper to prevent ESM import hoisting timezone/connection string lag
let pool: Pool | null = null;

// Executing queries using pooled connection or direct connection depending on connection string type
const dbQuery = async (text: string, params?: any[]): Promise<any> => {
  const connectionString = 
    process.env.POSTGRES_URL || 
    process.env.sanaya_POSTGRES_URL || 
    process.env.samaya_POSTGRES_URL;

  if (!connectionString) {
    throw new Error("No database connection string configured.");
  }

  // Neon direct connections or other serverless direct connections can cause pool exhaustion.
  // We check if the connection specifies pooler or if it's generally pooled.
  const isPooled = connectionString.includes('-pooler') || connectionString.includes('pool');
  const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  if (isPooled) {
    if (!pool) {
      pool = new Pool({
        connectionString,
        ssl: isLocalhost ? false : { rejectUnauthorized: false }
      });
    }
    return await pool.query(text, params);
  } else {
    // Create an ephemeral client for direct connections to prevent connection pool exhaustion in serverless environments
    const client = new Client({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false }
    });
    await client.connect();
    try {
      return await client.query(text, params);
    } finally {
      await client.end();
    }
  }
};

// Initialize table if using live Postgres
export async function initDatabase() {
  if (!isDbConnected()) return;

  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS greetings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Postgres database table initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database table:", error);
    throw error;
  }
}

// 1. Get Public Approved Greetings
export async function getApprovedGreetings(): Promise<DbGreeting[]> {
  if (isDbConnected()) {
    try {
      await initDatabase(); // Ensure table exists
      const { rows } = await dbQuery(`
        SELECT id, name, message, approved, created_at 
        FROM greetings 
        WHERE approved = true 
        ORDER BY created_at DESC 
        LIMIT 50;
      `);
      return rows as DbGreeting[];
    } catch (error) {
      console.error("Postgres error in getApprovedGreetings:", error);
      throw error;
    }
  }

  // Fallback to approved mock greetings
  return mockGreetings.filter(g => g.approved).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// 2. Get All Greetings for Admin Moderation
export async function getAllGreetings(): Promise<DbGreeting[]> {
  if (isDbConnected()) {
    try {
      await initDatabase();
      const { rows } = await dbQuery(`
        SELECT id, name, message, approved, created_at 
        FROM greetings 
        ORDER BY created_at DESC;
      `);
      return rows as DbGreeting[];
    } catch (error) {
      console.error("Postgres error in getAllGreetings:", error);
      throw error;
    }
  }

  return [...mockGreetings].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// 3. Add a New Greeting (Defaults to approved=false for moderation)
export async function addGreeting(name: string, message: string): Promise<DbGreeting> {
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (isDbConnected()) {
    try {
      await initDatabase();
      const { rows } = await dbQuery(`
        INSERT INTO greetings (name, message, approved)
        VALUES ($1, $2, false)
        RETURNING id, name, message, approved, created_at;
      `, [trimmedName, trimmedMessage]);
      return rows[0] as DbGreeting;
    } catch (error) {
      console.error("Postgres error in addGreeting:", error);
      throw error;
    }
  }

  // Add to local mock database
  const newGreeting: DbGreeting = {
    id: mockGreetings.length + 1,
    name: trimmedName,
    message: trimmedMessage,
    approved: false, // Moderation queue
    created_at: new Date().toISOString()
  };
  mockGreetings.push(newGreeting);
  return newGreeting;
}

// 4. Approve a Greeting
export async function approveGreeting(id: number): Promise<boolean> {
  if (isDbConnected()) {
    try {
      const result = await dbQuery(`
        UPDATE greetings 
        SET approved = true 
        WHERE id = $1;
      `, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Postgres error in approveGreeting:", error);
      throw error;
    }
  }

  // Handle mock update
  const greeting = mockGreetings.find(g => g.id === id);
  if (greeting) {
    greeting.approved = true;
    return true;
  }
  return false;
}

// 5. Delete a Greeting
export async function deleteGreeting(id: number): Promise<boolean> {
  if (isDbConnected()) {
    try {
      const result = await dbQuery(`
        DELETE FROM greetings 
        WHERE id = $1;
      `, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Postgres error in deleteGreeting:", error);
      throw error;
    }
  }

  // Handle mock delete
  const index = mockGreetings.findIndex(g => g.id === id);
  if (index !== -1) {
    mockGreetings.splice(index, 1);
    return true;
  }
  return false;
}
