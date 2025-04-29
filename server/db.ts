import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
import { SearchQuery, Record, SearchResult } from "@shared/schema";

// Database names list
const DB_NAMES = [
  "al-anbar",
  "babylon",
  "baghdad",
  "balad",
  "basra",
  "dhiqar",
  "diyala",
  "duhok",
  "erbil",
  "karbalaa",
  "kirkuk",
  "mesan",
  "muthana",
  "najaf",
  "nineveh",
  "qadisiya",
  "salah-aldeen",
  "sulaymaniyah",
  "wasit"
];

// Cache for database connections to avoid re-opening
const dbConnectionCache: { [key: string]: Database.Database } = {};

// Scan directory for potential database files
function scanForDatabases(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  try {
    const files = fs.readdirSync(dir);
    return files
      .filter(file => {
        const ext = path.extname(file);
        return ['.db', '.sqlite', '.sqlite3'].includes(ext);
      })
      .map(file => path.join(dir, file));
  } catch (err) {
    console.warn(`Error scanning directory ${dir}:`, err);
    return [];
  }
}

// Find all database files in common locations
const potentialDatabaseFiles: string[] = [
  ...scanForDatabases(path.resolve(process.cwd(), 'databases')),
  ...scanForDatabases(process.cwd()),
  ...scanForDatabases('/home/runner/workspace/databases'),
  ...scanForDatabases('/home/runner/databases'),
  ...scanForDatabases(path.resolve(process.cwd(), '..')),
  ...scanForDatabases(path.resolve(process.cwd(), '../databases'))
];

console.log(`Found ${potentialDatabaseFiles.length} potential database files:`, potentialDatabaseFiles);

// Get a database connection, creating it if needed
function getDbConnection(dbName: string): Database.Database {
  if (!dbConnectionCache[dbName]) {
    // Build a list of possible paths for this database
    const possiblePaths = [
      // Standard locations
      path.resolve(process.cwd(), 'databases', `${dbName}.db`),
      path.resolve(process.cwd(), 'databases', `${dbName}.sqlite`),
      path.resolve(process.cwd(), `${dbName}.db`),
      path.resolve(process.cwd(), `${dbName}.sqlite`),
      
      // Additional locations
      path.join('/home/runner/workspace/databases', `${dbName}.db`),
      path.join('/home/runner/workspace/databases', `${dbName}.sqlite`),
      path.join('/home/runner/databases', `${dbName}.db`),
      path.join('/home/runner/databases', `${dbName}.sqlite`),
      path.resolve(process.cwd(), '..', 'databases', `${dbName}.db`),
      path.resolve(process.cwd(), '..', 'databases', `${dbName}.sqlite`),
      
      // Also check any potential database files that match this name
      ...potentialDatabaseFiles.filter(file => {
        const basename = path.basename(file).toLowerCase();
        const name = path.basename(file, path.extname(file)).toLowerCase();
        return name === dbName || name.includes(dbName) || dbName.includes(name);
      })
    ];
    
    let dbPath = '';
    
    // Check which file exists
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        dbPath = p;
        break;
      }
    }
    
    if (!dbPath) {
      throw new Error(`Database file not found for ${dbName}. Looked in: 
        - ${possiblePaths.join('\n        - ')}`);
    }
    
    console.log(`Using database file: ${dbPath}`);
    
    // Create connection with simple settings for read-only
    console.log(`Opening database: ${dbPath}`);
    
    dbConnectionCache[dbName] = new Database(dbPath, {
      readonly: true,
      fileMustExist: true,
    });
    
    // Set only read-friendly pragmas for performance
    try {
      // Cache size pragma is safe for readonly
      dbConnectionCache[dbName].pragma('cache_size = -20000'); // Use 20MB of cache
      console.log(`Successfully set cache size for ${dbName}`);
      
      // Verify the database schema
      const tables = dbConnectionCache[dbName].prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
      console.log(`Database ${dbName} tables:`, tables.map(t => t.name).join(', '));
      
      // Look for either 'person' or 'records' tables
      const mainTables = tables.filter(t => t.name === 'person' || t.name === 'records');
      if (mainTables.length === 0) {
        console.log(`WARNING: Neither 'person' nor 'records' table found in ${dbName} database!`);
        
        // Check each table to see if it has the expected columns
        for (const table of tables) {
          try {
            const columns = dbConnectionCache[dbName].prepare(`PRAGMA table_info(${table.name})`).all() as { name: string }[];
            const columnNames = columns.map(c => c.name);
            console.log(`Table ${table.name} has columns:`, columnNames.join(', '));
            
            // Check if this table has most of our expected columns
            const expectedColumns = ['family_id', 'first_name', 'father_name', 'grandfather_name'];
            const matchCount = expectedColumns.filter(col => columnNames.includes(col)).length;
            
            if (matchCount >= 3) {
              console.log(`Table ${table.name} appears to be a possible data table (matched ${matchCount} columns)`);
            }
          } catch (e: any) {
            console.log(`Could not inspect table ${table.name}: ${e?.message}`);
          }
        }
      } else {
        console.log(`Found main data tables in ${dbName}:`, mainTables.map(t => t.name).join(', '));
      }
    } catch (error: any) {
      // Use 'any' type to safely access message property
      console.log(`Warning: Failed to set cache or inspect database: ${error?.message || String(error)}`);
    }
    
    // Create prepared statements for common queries
    prepareStatements(dbConnectionCache[dbName]);
  }
  
  return dbConnectionCache[dbName];
}

// Prepare common statements to improve performance
function prepareStatements(db: Database.Database) {
  // We'll create these as needed
}

// Build a SQL WHERE clause from search parameters
function buildWhereClause(query: SearchQuery): { whereClause: string, params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  // Extract search fields from query
  const { 
    family_id, 
    first_name, 
    father_name, 
    grandfather_name, 
    birth_date,
    mother_name, 
    maternal_grandfather,
    matchType
  } = query;

  // Add conditions based on provided fields
  if (family_id) {
    if (matchType === "exact") {
      conditions.push("family_id = ?");
      params.push(family_id);
    } else {
      conditions.push("family_id LIKE ?");
      params.push(`%${family_id}%`);
    }
  }

  if (first_name) {
    if (matchType === "exact") {
      conditions.push("first_name = ?");
      params.push(first_name);
    } else {
      conditions.push("first_name LIKE ?");
      params.push(`%${first_name}%`);
    }
  }

  if (father_name) {
    if (matchType === "exact") {
      conditions.push("father_name = ?");
      params.push(father_name);
    } else {
      conditions.push("father_name LIKE ?");
      params.push(`%${father_name}%`);
    }
  }

  if (grandfather_name) {
    if (matchType === "exact") {
      conditions.push("grandfather_name = ?");
      params.push(grandfather_name);
    } else {
      conditions.push("grandfather_name LIKE ?");
      params.push(`%${grandfather_name}%`);
    }
  }

  if (birth_date) {
    // Try different formats of birth dates for matching
    // The database might store it as '200600' but the user enters '2006'
    // It may also be stored as a number, so we need to use CAST in some cases
    conditions.push(`(
      birth_date = ? OR 
      birth_date = ? OR 
      birth_date LIKE ? OR
      CAST(birth_date AS TEXT) = ? OR
      CAST(birth_date AS TEXT) = ? OR
      CAST(birth_date AS TEXT) LIKE ?
    )`);
    params.push(birth_date);           // Exact match
    params.push(birth_date + '00');    // With trailing zeros
    params.push(birth_date + '%');     // Starts with (partial)
    params.push(String(birth_date));   // Exact match as string
    params.push(String(birth_date) + '00');  // Trailing zeros as string
    params.push(String(birth_date) + '%');   // Starts with as string (partial)
  }

  if (mother_name) {
    if (matchType === "exact") {
      conditions.push("mother_name = ?");
      params.push(mother_name);
    } else {
      conditions.push("mother_name LIKE ?");
      params.push(`%${mother_name}%`);
    }
  }

  if (maternal_grandfather) {
    if (matchType === "exact") {
      conditions.push("maternal_grandfather = ?");
      params.push(maternal_grandfather);
    } else {
      conditions.push("maternal_grandfather LIKE ?");
      params.push(`%${maternal_grandfather}%`);
    }
  }

  // Construct the full WHERE clause
  const whereClause = conditions.length > 0 
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  return { whereClause, params };
}

// Function to fetch all family members by family_id
export async function getFamilyMembers(familyId: string, database: string): Promise<Record[]> {
  try {
    if (!familyId || !database) {
      throw new Error('Family ID and database name are required');
    }

    // Ensure the database name is valid
    if (!DB_NAMES.includes(database)) {
      throw new Error(`Invalid database name: ${database}`);
    }

    const db = getDbConnection(database);

    // Check which table exists - person or records
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND (name='person' OR name='records')").all() as {name: string}[];
    
    if (tables.length === 0) {
      throw new Error(`Database ${database} has neither 'person' nor 'records' table`);
    }
    
    // Prefer 'person' table if it exists
    const tableName = tables.some(t => t.name === 'person') ? 'person' : 'records';
    
    // Query for all family members with the given family_id
    const sql = `
      SELECT 
        family_id, 
        first_name, 
        father_name, 
        grandfather_name, 
        birth_date, 
        mother_name, 
        maternal_grandfather,
        '${database}' as database
      FROM ${tableName}
      WHERE family_id = ?
    `;
    
    const stmt = db.prepare(sql);
    const records = stmt.all(familyId) as Record[];
    
    // Process records to fix birth_date format
    return records.map(record => {
      if (record.birth_date) {
        // Convert to string if it's a number
        const bd = String(record.birth_date);
        
        // Various formats we might encounter
        if (bd.endsWith('00') && bd.length > 4) {
          // Format: 200600 -> 2006
          record.birth_date = bd.slice(0, -2);
        } else if (bd.length === 6 && !bd.includes('-')) {
          // Format: YYYYMM -> YYYY
          record.birth_date = bd.slice(0, 4);
        } else if (bd.includes('-')) {
          // Format: YYYY-MM-DD -> YYYY
          record.birth_date = bd.split('-')[0];
        } else if (bd.length === 8 && !bd.includes('-')) {
          // Format: YYYYMMDD -> YYYY 
          record.birth_date = bd.slice(0, 4);
        }
      }
      return record;
    });
    
  } catch (error: any) {
    console.error(`Error fetching family members:`, error);
    throw new Error(`Failed to fetch family members: ${error?.message || String(error)}`);
  }
}

// Search function that queries the databases
export async function searchRecords(query: SearchQuery): Promise<SearchResult> {
  // Determine which databases to search
  const databasesToSearch = query.databases && query.databases.length > 0
    ? query.databases
    : DB_NAMES;

  // Filter databases to only include valid ones
  const validDatabases = databasesToSearch.filter(db => {
    if (!DB_NAMES.includes(db)) {
      console.warn(`Invalid database name: ${db}, skipping`);
      return false;
    }
    return true;
  });
  
  if (validDatabases.length === 0) {
    throw new Error('No valid databases were selected for search');
  }

  const { whereClause, params } = buildWhereClause(query);
  const page = query.page || 1;
  const limit = query.limit || 25;
  const offset = (page - 1) * limit;
  
  const allRecords: Record[] = [];
  let totalRecords = 0;

  // Query each database in sequence, keep track of errors
  const errors: string[] = [];
  
  for (const dbName of validDatabases) {
    try {
      const db = getDbConnection(dbName);
      
      // First, check which table exists - person or records
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND (name='person' OR name='records')").all() as {name: string}[];
      
      if (tables.length === 0) {
        console.warn(`Skipping database ${dbName} because it has neither 'person' nor 'records' table`);
        errors.push(`Database ${dbName} has neither 'person' nor 'records' table`);
        continue;
      }
      
      // Prefer 'person' table if it exists
      const tableName = tables.some(t => t.name === 'person') ? 'person' : 'records';
      console.log(`Using table '${tableName}' for database ${dbName}`);
      
      // Count query
      const countSql = `SELECT COUNT(*) as count FROM ${tableName} ${whereClause}`;
      const countStmt = db.prepare(countSql);
      const countResult = countStmt.get(...params) as { count: number };
      totalRecords += countResult.count;
      
      // Data query
      const dataSql = `
        SELECT 
          family_id, 
          first_name, 
          father_name, 
          grandfather_name, 
          birth_date, 
          mother_name, 
          maternal_grandfather,
          '${dbName}' as database
        FROM ${tableName}
        ${whereClause}
        LIMIT ? OFFSET ?
      `;
      const dataStmt = db.prepare(dataSql);
      const rawRecords = dataStmt.all(...params, limit, offset) as Record[];
      
      // Process records to fix birth_date format (remove trailing 00)
      const records = rawRecords.map(record => {
        if (record.birth_date) {
          // Convert to string if it's a number
          const bd = String(record.birth_date);
          
          // Various formats we might encounter
          if (bd.endsWith('00')) {
            // Format: 200600 -> 2006
            record.birth_date = bd.slice(0, -2);
          } else if (bd.length === 6 && !bd.includes('-')) {
            // Format: YYYYMM -> YYYY
            record.birth_date = bd.slice(0, 4);
          } else if (bd.includes('-')) {
            // Format: YYYY-MM-DD -> YYYY
            record.birth_date = bd.split('-')[0];
          } else if (bd.length === 8 && !bd.includes('-')) {
            // Format: YYYYMMDD -> YYYY 
            record.birth_date = bd.slice(0, 4);
          }
          
          // Ensure it's a reasonable year (4 digits)
          if (record.birth_date.length === 4) {
            console.log(`Formatted birth date: ${bd} -> ${record.birth_date}`);
          }
        }
        return record;
      });
      
      allRecords.push(...records);
      
      // If we have enough records, stop querying more databases
      if (allRecords.length >= limit) {
        allRecords.length = limit;
        break;
      }
      
    } catch (error: any) {
      console.error(`Error querying database ${dbName}:`, error);
      errors.push(`Error in ${dbName} database: ${error?.message || String(error)}`);
      // Continue with other databases instead of throwing
    }
  }
  
  // If we had errors with all databases, throw a combined error
  if (errors.length > 0 && errors.length === validDatabases.length) {
    throw new Error(`Failed to search all databases: ${errors.join('; ')}`);
  }
  
  // If no records were found but we had some databases successfully queried, don't consider it an error
  if (allRecords.length === 0 && errors.length > 0) {
    console.warn(`Completed with ${errors.length} database errors, but no data was found in working databases.`);
  }

  // Sort results by family_id for consistency
  // Use safe sorting that handles both string and number types
  allRecords.sort((a, b) => {
    // Convert both to strings to ensure we can compare them safely
    const aId = String(a.family_id);
    const bId = String(b.family_id);
    return aId.localeCompare(bId);
  });
  
  // Return the formatted results with pagination
  return {
    records: allRecords,
    total: totalRecords,
    page,
    totalPages: Math.ceil(totalRecords / limit),
    limit
  };
}

// Close all database connections (for cleanup)
export function closeAllConnections() {
  for (const dbName in dbConnectionCache) {
    dbConnectionCache[dbName].close();
  }
}
