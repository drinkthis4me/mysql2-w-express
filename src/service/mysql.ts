import mysql from 'mysql2/promise'
import * as mysqlpool from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * Using createConnection + .execute() with promise
 * @param sql sql string
 * @returns results
 */
export const sqlConnectionExecute = async (sql: string) => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })

  const [results] = await connection.execute(sql)

  return results
}

/**
 * Using pools + .execute() with promise
 * @param sql sql string
 * @returns results
 */
export const sqlPoolExecute = async (
  sql: string | { sql: string; nestTables: boolean | '_' }
) => {
  const pool = mysqlpool.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })

  const promisePool = pool.promise()

  const [results] = await promisePool.execute(sql)

  return results
}
