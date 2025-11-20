import { DatabaseState, QueryResult, Row } from '../types';

/**
 * A very basic regex-based SQL parser for demonstration purposes.
 * It supports:
 * - SELECT * FROM [table]
 * - SELECT [col1], [col2] FROM [table]
 * - Basic WHERE clauses (primitive string matching only for demo)
 */
export const executeQuery = (sql: string, db: DatabaseState): QueryResult => {
  const normalizedSql = sql.trim();
  const lowerSql = normalizedSql.toLowerCase();

  try {
    // 1. Identify Query Type
    if (lowerSql.startsWith('select')) {
      return handleSelect(normalizedSql, db);
    } 
    
    if (lowerSql.startsWith('insert')) {
        return { success: false, message: "INSERT not implemented in this read-only demo." };
    }

    return { success: false, message: "Unsupported query type. Try SELECT." };

  } catch (e: any) {
    return { success: false, message: e.message || "Execution failed" };
  }
};

const handleSelect = (sql: string, db: DatabaseState): QueryResult => {
    // Regex to extract parts: SELECT (cols) FROM (table) [WHERE (condition)]
    const regex = /select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+))?/i;
    const match = sql.match(regex);

    if (!match) {
        return { success: false, message: "Invalid SELECT syntax." };
    }

    const [, colString, tableName, whereClause] = match;
    const table = db.tables.find(t => t.name.toLowerCase() === tableName.toLowerCase());

    if (!table) {
        return { success: false, message: `Table '${tableName}' not found.` };
    }

    let resultRows = [...table.rows];

    // Basic WHERE filtering (Very simple implementation)
    if (whereClause) {
        // e.g., "status = 'active'"
        // Splitting by basic operators =, >, <
        // This is extremely simplified
        if (whereClause.includes('=')) {
            const [key, val] = whereClause.split('=').map(s => s.trim());
            // Remove quotes if string
            const cleanVal = val.replace(/^'|'$/g, "").replace(/^"|"$/g, "");
            resultRows = resultRows.filter(row => {
                // Loose equality for string/number mix
                // eslint-disable-next-line eqeqeq
                return row[key] == cleanVal || String(row[key]).toLowerCase() == cleanVal.toLowerCase();
            });
        } else if (whereClause.toLowerCase().includes('like')) {
             // Simple LIKE '%val%' support
             const [key, val] = whereClause.split(/\s+like\s+/i).map(s => s.trim());
             const cleanVal = val.replace(/^'|'$/g, "").replace(/%/g, "");
             resultRows = resultRows.filter(row => {
                 return String(row[key]).toLowerCase().includes(cleanVal.toLowerCase());
             });
        }
    }

    // Column Projection
    let finalColumns = table.columns.map(c => c.name);
    if (colString.trim() !== '*') {
        const requestedCols = colString.split(',').map(s => s.trim());
        // Filter columns to only those requested and existing
        finalColumns = requestedCols.filter(rc => table.columns.some(tc => tc.name === rc));
        
        // Map rows to new objects with only requested columns
        resultRows = resultRows.map(row => {
            const newRow: Row = { id: row.id }; // Keep ID for keys
            finalColumns.forEach(col => {
                newRow[col] = row[col];
            });
            return newRow;
        });
    }

    return {
        success: true,
        data: resultRows,
        columns: finalColumns,
        executionTimeMs: Math.floor(Math.random() * 20) + 1
    };
};
