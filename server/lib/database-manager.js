const mysql = require("mysql");
const { v4: uuid } = require("uuid");
const constants = require("./constants");
const level = process.env.LOG_LEVEL;

/**
 * Database Manager
 * @author Ashley Scott
 */
class DatabaseManager {
    /**
     * Constructor
     * Initialises the object.
     * @param {string} hostname | Hostname of the server to connect to
     * @param {string} username | Username to use for logging in
     * @param {string} password | Password to use for logging in
     * @param {string} database | Database to use
     */
    constructor(hostname, username, password, database) {
        level >= constants.LOG_LEVEL.TRACE ? console.log(`[TRACE] ${this.constructor.name}: Initialised`) : null;
        level >= constants.LOG_LEVEL.TRACE ? console.trace("[TRACE]") : null;

        this.instance = uuid();

        this.pool = mysql.createPool({
            host: hostname,
            user: username,
            password: password,
            database: database,
            port: 3306,
            multipleStatements: true
        });

        this.pool.on('acquire', (connection) => {
            console.log(`[I-${this.instance}] Connection ${connection.threadId} acquired`);
        });
        this.pool.on('connection', (connection) => {
            connection.query(`[I-${this.instance}] Connected ${connection.threadId}`)
        });
        this.pool.on('enqueue', () => {
            console.log(`[I-${this.instance}] Waiting for available connection slot`);
        });
        this.pool.on('release', (connection) => {
            console.log(`[I-${this.instance}] Connection ${connection.threadId} released`);
        });
    }

    /**
     * Get Connection
     * Returns connection from the connection pool.
     */
    async getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
                if (error) {
                    reject(error);
                }

                resolve(connection);
            })
        });
    }

    /**
     * Selects data from a table.
     * @param {object} options | Options for the selection.
     * // todo: document option inputs
     * 
     * @example where
     *      [
     *          {cond, cond}, -- Each item will be concatenated with AND
     *                        -- Inserts an OR before the next set of conditions
     *          {cond, cond}  -- Each item will be concatenated with AND
     *      ]
     *      -- WHERE (condition AND condition) or (cond AND cond)
     *      -- WHERE condition OR condition
     */
    async select(options) {
        level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: select called with options:", options) : null;
        let columns = options.columns,
            table = options.from,
            where = options.where || undefined,
            join = options.join || undefined,
            sort = options.sort || undefined,
            first = false;

        if (options.options) {
            first = options.options.singleItem || false;
        }

        return new Promise(async (resolve, reject) => {
            let tableParams = [table];
            let selectStatement = "";
            let joinStatement = "";
            let groupStatement = "";
            let sortStatement = "";

            if (where) {
                selectStatement += "WHERE ?";
                if (Array.isArray(where)) {
                    for (let i = 0; i < where.length; i++) {
                        let keys = Object.keys(where[i]);
                        keys.forEach(key => {
                            tableParams.push({ [key]: where[i][key] });
                        });

                        if (keys.length > 1) {
                            selectStatement += "AND ?".repeat(keys.length - 1);
                        }

                        if (i < where.length - 1) {
                            selectStatement += " OR ?";
                        }
                    }
                } else {
                    let keys = Object.keys(where);
                    keys.forEach((key) => {
                        tableParams.push({ [key]: where[key] });
                    });

                    if (keys.length > 1) {
                        selectStatement += " AND ?".repeat(keys.length - 1);
                    }
                }
            }

            if (join) {
                joinStatement = ` ${join.mode} JOIN ${join.on.table} ON ${table}.${join.from.id}=${join.on.table}.${join.on.id}`;
                groupStatement = ` GROUP BY ${join.groupBy} `;
            }

            if (sort) {
                sortStatement = ` ORDER BY ${sort.by} ${sort.mode}`;
            }

            let connection = await this.getConnection()
                .catch((error) => {
                    reject(error);
                });

            if (connection) {
                let queryString = `SELECT ${columns} FROM ?? ${joinStatement} ${selectStatement} ${groupStatement} ${sortStatement}`;
                level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: select final statement:", queryString) : null;

                connection.query(queryString, tableParams, function (error, results, fields) {
                    if (error) {
                        reject(error);
                    }

                    connection.release();

                    if (results && results.length > 0) {
                        resolve(first ? results[0] : results);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    }

    /**
     * Updates data in a table
     * @param {string} table | Table to update
     * @param {object} set   | Values to change
     * @param {object} where | Conditions for the selection
     */
    async update(options) {
        level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: update called with options:", options) : null;

        let table = options.table,
            set = options.set,
            where = options.where || undefined;

        return new Promise(async (resolve, reject) => {
            let tableParams = [table, set];
            let updateStatement = '';

            if (where) {
                updateStatement += "WHERE ?";
                if (Array.isArray(where)) {
                    for (let i = 0; i < where.length; i++) {
                        let keys = Object.keys(where[i]);

                        keys.forEach(key => {
                            tableParams.push({ [key]: where[i][key] });
                        });

                        if (keys.length > 1) {
                            updateStatement += "AND ?".repeat(keys.length - 1);
                        }

                        if (i < where.length - 1) {
                            updateStatement += " OR ?";
                        }
                    }
                } else {
                    let keys = Object.keys(where);
                    keys.forEach((key) => {
                        tableParams.push({ [key]: where[key] });
                    });

                    if (keys.length > 1) {
                        updateStatement += " AND ?".repeat(keys.length - 1);
                    }
                }
            }

            let connection = await this.getConnection()
                .catch((error) => {
                    reject(error);
                });

            if (connection) {
                let queryString = `UPDATE ?? SET ? ${updateStatement}`;
                level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: update final statement:", queryString) : null;

                connection.query(queryString, tableParams, (error, results, fields) => {
                    if (error) {
                        reject(error);
                    }

                    connection.release();
                    resolve(results);
                });
            }
        });
    }

    /**
     * Increments a column in a table
     * @param {string} table | Table to update
     * @param {string} column| Column to change
     * @param {object} where | Conditions for the selection
     */
    async increment(table, column, where) {
        level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: increment called with options:", table, column, where) : null;

        return new Promise(async (resolve, reject) => {
            let connection = await this.getConnection()
                .catch((error) => {
                    reject(error);
                });

            if (connection) {
                let queryString = `UPDATE ?? SET ${column} = ${column}+1`;
                level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: increment final statement:", queryString) : null;

                connection.query(queryString, [table], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    }

                    connection.release();
                    resolve(results);
                });
            }
        });
    }

    /**
     * Inserts data in a table
     * @param {string} table | Table to insert
     * @param {object} set   | Values to insert
     */
    async insert(table, value) {
        level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: insert called with options:", table, value) : null;

        return new Promise(async (resolve, reject) => {
            let connection = await this.getConnection()
                .catch((error) => {
                    reject(error);
                });

            if (connection) {
                let queryString = 'INSERT INTO ?? SET ?';
                level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: insert final statement:", queryString) : null;

                connection.query(queryString, [table, value], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    }

                    connection.release();
                    resolve(results);
                });
            }
        });
    }

    /**
     * Deletes data from a table
     * @param {string} table | Table to delete from
     * @param {object} where | Conditions to be used
     */
    async delete(table, where) {
        level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: delete called with options:", options) : null;

        return new Promise(async (resolve, reject) => {
            let tableparams = [table];
            let selectStatement = '';

            if (where != null) {
                Object.keys(where).forEach((key) => {
                    tableparams.push({ [key]: where[key] });
                })
            }

            if (tableparams.length > 1) {
                selectStatement = 'WHERE ?';
                selectStatement += ' AND ?'.repeat(tableparams.length - 2);
            }

            let connection = await this.getConnection()
                .catch((error) => {
                    reject(error);
                });

            if (connection) {
                let queryString = `DELETE FROM ?? ${selectStatement}`;
                level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: delete final statement:", queryString) : null;

                connection.query(queryString, tableparams, function (error, results, fields) {
                    if (error) {
                        reject(error);
                    }

                    connection.release();
                    resolve(results);
                });
            }
        });
    }

    /**
     * Inserts or updates a record
     * @param {string} table  | Table to be used
     * @param {object} values | Values to insert or update
     * @param {object} keys   | Keys to be used for upsert
     */
    async upsert(table, values, keys) {
        level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: upsert called with options:", options) : null;

        let keyUpdate = "";

        keys.forEach(k => {
            keyUpdate += `${k} = VALUES(${k}),`;
        });

        keyUpdate = keyUpdate.slice(0, -1);

        return new Promise(async (resolve, reject) => {
            let connection = await this.getConnection()
                .catch((error) => {
                    reject(error);
                });

            if (connection) {
                let queryString = `START TRANSACTION; INSERT INTO ?? ( ${this.connection.escape(keys)} ) VALUES ? ON DUPLICATE KEY UPDATE ${keyUpdate}; COMMIT;`;
                level >= constants.LOG_LEVEL.DEBUG ? console.log("[DEBUG] DatabaseManager: delete final statement:", queryString) : null;
                
                connection.query(queryString, [table, values], (error, results) => {
                    if (error) {
                        reject(error);
                    }

                    connection.release();
                    resolve(results);
                });
            }
        })
    }

}

module.exports = DatabaseManager;
