import { createPool, createClient } from '@vercel/postgres';
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
  created_at: new Date(g.date).toISOString()
}));

// Helper to determine if we have a live Vercel Postgres connection string
const isDbConnected = (): boolean => {
  const connectionString = 
    process.env.POSTGRES_URL || 
    process.env.sanaya_POSTGRES_URL || 
    process.env.samaya_POSTGRES_URL;
  return (
    typeof connectionString === 'string' && 
    connectionString.trim().length > 0 &&
    (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://')) &&
    !connectionString.includes('db.prisma.io') // Prisma Accelerate is not compatible with direct node-postgres drivers
  );
};

// Lazy pool helper to prevent ESM import hoisting timezone/connection string lag
let pool: any = null;

// Executing queries using pooled connection or direct connection depending on connection string type
const executeQuery = async <T = any>(
  queryFn: (sql: any) => Promise<T>
): Promise<T> => {
  const connectionString = 
    process.env.POSTGRES_URL || 
    process.env.sanaya_POSTGRES_URL || 
    process.env.samaya_POSTGRES_URL;

  if (!connectionString) {
    throw new Error("No database connection string configured.");
  }

  // Neon direct connections throw if used with createPool in @vercel/postgres.
  // We automatically detect if the connection is pooled (contains '-pooler') or direct.
  const isPooled = connectionString.includes('-pooler');

  if (isPooled) {
    if (!pool) {
      pool = createPool({ connectionString });
    }
    return await queryFn(pool.sql);
  } else {
    // Create an ephemeral client for direct connections to prevent connection pool exhaustion in serverless environments
    const client = createClient({ connectionString });
    await client.connect();
    try {
      return await queryFn(client.sql);
    } finally {
      await client.end();
    }
  }
};

// Initialize table if using live Postgres
export async function initDatabase() {
  if (!isDbConnected()) return;

  try {
    await executeQuery((sql) => {
      return sql`
        CREATE TABLE IF NOT EXISTS greetings (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          approved BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
    });
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
      const { rows } = await executeQuery((sql) => {
        return sql`
          SELECT id, name, message, approved, created_at 
          FROM greetings 
          WHERE approved = true 
          ORDER BY created_at DESC 
          LIMIT 50;
        `;
      });
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
      const { rows } = await executeQuery((sql) => {
        return sql`
          SELECT id, name, message, approved, created_at 
          FROM greetings 
          ORDER BY created_at DESC;
        `;
      });
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
      const { rows } = await executeQuery((sql) => {
        return sql`
          INSERT INTO greetings (name, message, approved)
          VALUES (${trimmedName}, ${trimmedMessage}, false)
          RETURNING id, name, message, approved, created_at;
        `;
      });
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
      const result = await executeQuery((sql) => {
        return sql`
          UPDATE greetings 
          SET approved = true 
          WHERE id = ${id};
        `;
      });
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
      const result = await executeQuery((sql) => {
        return sql`
          DELETE FROM greetings 
          WHERE id = ${id};
        `;
      });
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
