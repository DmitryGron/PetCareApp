import * as SQLite from 'expo-sqlite';
import { Pet, Reminder, HealthLog } from '../types';

// Singleton database instance
let db: SQLite.SQLiteDatabase;
let isInitialized = false;

// Helper function to migrate the database schema for existing installations
const migrateSchema = (tx: SQLite.SQLTransaction): void => {
  // Add new columns to pets table if they don't exist
  tx.executeSql(
    "PRAGMA table_info(pets)",
    [],
    (_, result) => {
      const columns = result.rows._array;
      const columnNames = columns.map((col: any) => col.name);
      
      // Add photos column if it doesn't exist
      if (!columnNames.includes('photos')) {
        tx.executeSql(
          "ALTER TABLE pets ADD COLUMN photos TEXT",
          [],
          () => console.log("Added photos column to pets table"),
          (_, error) => { console.error("Failed to add photos column:", error); return false; }
        );
      }
      
      // Add allergies column if it doesn't exist
      if (!columnNames.includes('allergies')) {
        tx.executeSql(
          "ALTER TABLE pets ADD COLUMN allergies TEXT",
          [],
          () => console.log("Added allergies column to pets table"),
          (_, error) => { console.error("Failed to add allergies column:", error); return false; }
        );
      }
      
      // Add tags column if it doesn't exist
      if (!columnNames.includes('tags')) {
        tx.executeSql(
          "ALTER TABLE pets ADD COLUMN tags TEXT",
          [],
          () => console.log("Added tags column to pets table"),
          (_, error) => { console.error("Failed to add tags column:", error); return false; }
        );
      }
      
      // Add birthday column if it doesn't exist
      if (!columnNames.includes('birthday')) {
        tx.executeSql(
          "ALTER TABLE pets ADD COLUMN birthday TEXT",
          [],
          () => console.log("Added birthday column to pets table"),
          (_, error) => { console.error("Failed to add birthday column:", error); return false; }
        );
      }
    },
    (_, error) => {
      console.error("Failed to get table info:", error);
      return false;
    }
  );
};

// Helper function to create tables after WAL mode is set
const createTablesIfNeeded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Create tables in a separate transaction after WAL mode is set
    db.transaction(
      tx => {
        // Create pets table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS pets (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            breed TEXT,
            age INTEGER,
            birthday TEXT,
            weight REAL,
            notes TEXT,
            photoUri TEXT,
            photos TEXT,
            allergies TEXT,
            tags TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
          )`,
          [],
          () => {},
          (_, error) => { reject(error); return false; }
        );
        
        // Create reminders table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS reminders (
            id TEXT PRIMARY KEY,
            petId TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            scheduledDate TEXT NOT NULL,
            recurring TEXT,
            completed INTEGER DEFAULT 0,
            completedAt TEXT,
            notificationEnabled INTEGER DEFAULT 1,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
          )`,
          [],
          () => {},
          (_, error) => { reject(error); return false; }
        );
        
        // Create health_logs table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS health_logs (
            id TEXT PRIMARY KEY,
            petId TEXT NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            value TEXT,
            notes TEXT,
            photoUri TEXT,
            FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
          )`,
          [],
          () => {},
          (_, error) => { reject(error); return false; }
        );
        
        // Create indices
        tx.executeSql(
          `CREATE INDEX IF NOT EXISTS idx_reminders_petId ON reminders(petId)`,
          [],
          () => {},
          (_, error) => { reject(error); return false; }
        );
        
        tx.executeSql(
          `CREATE INDEX IF NOT EXISTS idx_health_logs_petId ON health_logs(petId)`,
          [],
          () => {},
          (_, error) => { reject(error); return false; }
        );
      },
      error => {
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
};

export const initializeDatabase = async (): Promise<void> => {
  if (isInitialized) {
    console.log("Database already initialized.");
    return;
  }
  
  console.log("[DB] Starting database initialization...");
  
  return new Promise((resolve, reject) => {
    console.log("[DB] Opening database...");
    db = SQLite.openDatabase('petcare.db');
    
    console.log("[DB] Setting WAL mode...");
    // First, set WAL mode for better performance and concurrency
    db.exec([{ sql: 'PRAGMA journal_mode = WAL;', args: [] }], false, (err, result) => {
      if (err) {
        console.error("[DB] Failed to set WAL mode:", err);
        reject(err);
        return;
      }
      
      console.log("[DB] WAL mode result:", result);
      
      console.log("[DB] Creating tables...");
      // Then create tables if needed
      createTablesIfNeeded()
        .then(() => {
          console.log("[DB] Tables created successfully");
          
          // Run schema migrations for existing tables
          console.log("[DB] Running schema migrations...");
          db.transaction(
            tx => {
              migrateSchema(tx);
            },
            error => {
              console.error("[DB] Migration failed:", error);
              reject(error);
            },
            () => {
              console.log("[DB] Migration completed successfully");
              isInitialized = true;
              resolve();
            }
          );
        })
        .catch(error => {
          console.error("[DB] Failed to create tables:", error);
          reject(error);
        });
    });
  });
};

// Pet operations
export const insertPet = async (pet: Pet): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // Serialize arrays to JSON strings for storage
    const photos = pet.photos ? JSON.stringify(pet.photos) : null;
    const allergies = pet.allergies ? JSON.stringify(pet.allergies) : null;
    const tags = pet.tags ? JSON.stringify(pet.tags) : null;

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO pets (id, name, type, breed, age, weight, notes, photoUri, photos, allergies, tags, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pet.id, 
          pet.name, 
          pet.type, 
          pet.breed ?? null, 
          pet.age ?? null, 
          pet.weight ?? null, 
          pet.notes ?? null, 
          pet.photoUri ?? null, 
          photos, 
          allergies, 
          tags, 
          pet.createdAt, 
          pet.updatedAt
        ],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const getAllPets = async (): Promise<Pet[]> => {
  return new Promise<Pet[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pets ORDER BY createdAt DESC',
        [],
        (_, { rows }) => {
          const pets = rows._array.map((pet: any) => ({
            ...pet,
            photos: pet.photos ? JSON.parse(pet.photos) : undefined,
            allergies: pet.allergies ? JSON.parse(pet.allergies) : undefined,
            tags: pet.tags ? JSON.parse(pet.tags) : undefined,
          }));
          resolve(pets as Pet[]);
        },
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const getPetById = async (id: string): Promise<Pet | null> => {
  return new Promise<Pet | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pets WHERE id = ?',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            const pet = rows._array[0] as any;
            const result: Pet = {
              ...pet,
              photos: pet.photos ? JSON.parse(pet.photos) : undefined,
              allergies: pet.allergies ? JSON.parse(pet.allergies) : undefined,
              tags: pet.tags ? JSON.parse(pet.tags) : undefined,
            };
            resolve(result);
          } else {
            resolve(null);
          }
        },
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const updatePet = async (id: string, updates: Partial<Pet>): Promise<void> => {
  const fields = Object.keys(updates).filter(key => key !== 'id');
  
  // Explicitly type the values array to ensure it only contains SQLStatementArg types
  const values: (string | number | null)[] = fields.map(field => {
    const value = updates[field as keyof Pet];
    
    // Serialize array fields to JSON strings for storage
    if (field === 'photos' || field === 'allergies' || field === 'tags') {
      // Ensure arrays are serialized to JSON strings
      return Array.isArray(value) ? JSON.stringify(value) : (value ? JSON.stringify(value) : null);
    }
    
    return value === undefined ? null : (value as string | number | null); // Convert undefined to null for SQL
  });
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE pets SET ${setClause} WHERE id = ?`,
        [...values, id],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const deletePet = async (id: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM pets WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

// Reminder operations
export const insertReminder = async (reminder: Reminder): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO reminders (id, petId, title, description, type, scheduledDate, recurring, completed, completedAt, notificationEnabled, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reminder.id, 
          reminder.petId, 
          reminder.title, 
          reminder.description ?? null, 
          reminder.type, 
          reminder.scheduledDate, 
          reminder.recurring ?? null, 
          reminder.completed ? 1 : 0, 
          reminder.completedAt ?? null, 
          reminder.notificationEnabled ? 1 : 0, 
          reminder.createdAt
        ],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const getAllReminders = async (): Promise<Reminder[]> => {
  return new Promise<Reminder[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT r.*, p.name as petName 
         FROM reminders r 
         JOIN pets p ON r.petId = p.id 
         ORDER BY r.scheduledDate ASC`,
        [],
        (_, { rows }) => {
          const reminders = rows._array.map(row => ({
            ...row,
            completed: Boolean(row.completed),
            notificationEnabled: Boolean(row.notificationEnabled),
          }));
          resolve(reminders as Reminder[]);
        },
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const getRemindersByPetId = async (petId: string): Promise<Reminder[]> => {
  return new Promise<Reminder[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reminders WHERE petId = ? ORDER BY scheduledDate ASC',
        [petId],
        (_, { rows }) => {
          const reminders = rows._array.map(row => ({
            ...row,
            completed: Boolean(row.completed),
            notificationEnabled: Boolean(row.notificationEnabled),
          }));
          resolve(reminders as Reminder[]);
        },
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const getReminderById = async (id: string): Promise<Reminder | null> => {
  return new Promise<Reminder | null>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reminders WHERE id = ?',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            const reminder = {
              ...rows._array[0],
              completed: Boolean(rows._array[0].completed),
              notificationEnabled: Boolean(rows._array[0].notificationEnabled),
            };
            resolve(reminder as Reminder);
          } else {
            resolve(null);
          }
        },
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const updateReminder = async (id: string, updates: Partial<Reminder>): Promise<void> => {
  const fields = Object.keys(updates).filter(key => key !== 'id');
  const values = fields.map(field => {
    const value = updates[field as keyof Reminder];
    if (field === 'completed' || field === 'notificationEnabled') {
      return value === true ? 1 : value === false ? 0 : null;
    }
    return value ?? null;
  });
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Convert any potential boolean values to numbers (0/1) to satisfy SQLStatementArg type
      const sqlParams = [...values.map(v => 
        typeof v === 'boolean' ? (v ? 1 : 0) : v
      ), id];
      
      tx.executeSql(
        `UPDATE reminders SET ${setClause} WHERE id = ?`,
        sqlParams,
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const deleteReminder = async (id: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM reminders WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

// Health log operations
export const insertHealthLog = async (healthLog: HealthLog): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO health_logs (id, petId, date, type, value, notes, photoUri)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [healthLog.id, healthLog.petId, healthLog.date, healthLog.type, healthLog.value ?? null, healthLog.notes ?? null, healthLog.photoUri ?? null],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const getHealthLogsByPetId = async (petId: string): Promise<HealthLog[]> => {
  return new Promise<HealthLog[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM health_logs WHERE petId = ? ORDER BY date DESC',
        [petId],
        (_, { rows }) => resolve(rows._array as HealthLog[]),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const updateHealthLog = async (id: string, updates: Partial<HealthLog>): Promise<void> => {
  const fields = Object.keys(updates).filter(key => key !== 'id');
  const values = fields.map(field => {
    const value = updates[field as keyof HealthLog];
    return value ?? null; // Convert undefined to null for SQL
  });
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE health_logs SET ${setClause} WHERE id = ?`,
        [...values, id],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const deleteHealthLog = async (id: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM health_logs WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};

export const getHealthLogsByType = async (petId: string, type: string): Promise<HealthLog[]> => {
  return new Promise<HealthLog[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM health_logs WHERE petId = ? AND type = ? ORDER BY date DESC',
        [petId, type],
        (_, { rows }) => resolve(rows._array as HealthLog[]),
        (_, error) => { reject(error); return false; }
      );
    });
  });
};