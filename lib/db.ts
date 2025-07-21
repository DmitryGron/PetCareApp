import * as SQLite from 'expo-sqlite';
import { Pet, Reminder, HealthLog } from '../types';

// Singleton database instance
let db: SQLite.SQLiteDatabase;
let isInitialized = false;

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
            weight REAL,
            notes TEXT,
            photoUri TEXT,
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
  // Prevent double initialization
  if (isInitialized) {
    console.log('[DB] Database already initialized');
    return Promise.resolve();
  }

  console.log('[DB] Starting database initialization...');
  
  return new Promise<void>((resolve, reject) => {
    try {
      console.log('[DB] Opening database...');
      // Open the database
      db = SQLite.openDatabase('petcare.db');
      
      console.log('[DB] Setting WAL mode...');
      // Set WAL mode first - must be outside a transaction
      db.exec([{ sql: 'PRAGMA journal_mode = WAL;', args: [] }], false, (error, resultSet) => {
        if (error) {
          console.error('[DB] Error setting WAL mode:', error);
          return reject(error);
        }
        
        console.log('[DB] WAL mode result:', resultSet);
        console.log('[DB] Creating tables...');
        
        // Now create tables in a transaction
        createTablesIfNeeded()
          .then(() => {
            console.log('[DB] Tables created successfully');
            isInitialized = true;
            resolve();
          })
          .catch(err => {
            console.error('[DB] Error creating tables:', err);
            reject(err);
          });
      });
    } catch (error) {
      console.error('[DB] Fatal initialization error:', error);
      reject(error);
    }
  });
};

// Pet operations
export const insertPet = async (pet: Pet): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO pets (id, name, type, breed, age, weight, notes, photoUri, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [pet.id, pet.name, pet.type, pet.breed ?? null, pet.age ?? null, pet.weight ?? null, pet.notes ?? null, pet.photoUri ?? null, pet.createdAt, pet.updatedAt],
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
        (_, { rows }) => resolve(rows._array as Pet[]),
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
            resolve(rows._array[0] as Pet);
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
  const values = fields.map(field => {
    const value = updates[field as keyof Pet];
    return value ?? null; // Convert undefined to null for SQL
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