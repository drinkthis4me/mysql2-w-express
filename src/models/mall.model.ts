import * as dotenv from 'dotenv'
dotenv.config()
import mysql from 'mysql2/promise'
import { sqlPoolExecute } from '../service/mysql'

export const sqlSelectAll = async () => {
  let sql = `SELECT * FROM category`

  const results = await sqlPoolExecute(sql)

  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}

/**
 * `SELECT * FROM category WHERE id = ?`
 * @param id string of category id
 * @returns results
 */
export const sqlSelectOne = async ( id: string) => {
  let sql = `SELECT * FROM category WHERE id = ?`
  let insert = [id]
  sql = mysql.format(sql, insert)

  const results = await sqlPoolExecute(sql)

  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}
/**
 * `SELECT s.id, s.category_id, s.name, s.description FROM sub_category s`
 * @returns 
 */
export const sqlSelectAllSub = async () => {
  let sql = `SELECT s.id, s.category_id, s.name, s.description FROM sub_category s`

  const results = await sqlPoolExecute(sql)

  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}
/**
 * `SELECT s.id, s.category_id, s.name, s.description FROM sub_category s WHERE category_id = ?`
 * @param id 
 * @returns 
 */
export const sqlSelectSubByCate = async (id: string) => {
  let sql = `SELECT s.id, s.category_id, s.name, s.description FROM sub_category s WHERE category_id = ?`
  let insert = [id]
  sql = mysql.format(sql, insert)

  const results = await sqlPoolExecute(sql)

  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}
/**
 * `SELECT s.id, s.category_id, s.name, s.description FROM sub_category s WHERE s.id = ?`
 * @param sub_id 
 * @returns 
 */
export const sqlSelectOneSub = async (sub_id: string) => {
  let sql = `SELECT s.id, s.category_id, s.name, s.description FROM sub_category s WHERE s.id = ?`
  let insert = [sub_id]
  sql = mysql.format(sql, insert)

  const results = await sqlPoolExecute(sql)

  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}


/**
 * not in use
 * Left Joins category & sub_category
 * https://github.com/mysqljs/mysql#joins-with-overlapping-column-names
 *
 * @param categoryID string (Optional. If not provided, return all categories)
 * @returns array of categories with their subcategories
 */
export const sqlSelectLeftJoin = async (categoryID?: string) => {
  let sql: string, inserts: string[]

  if (categoryID) {
    // Inner join one category with all sub_category
    // Alias: c = category; s = subcategory
    sql = `SELECT c.id, c.name, s.id AS subcategory_id, s.name AS subcategory_name, s.description
    FROM ?? c, ?? s 
    WHERE c.id = s.category_id AND c.id = ?
    ORDER BY s.id`
    inserts = ['category', 'sub_category', categoryID]
  } else {
    // left join all category and sub_category
    sql = `SELECT c.id, c.name, s.id AS subcategory_id, s.name AS subcategory_name, s.description 
    FROM ?? c LEFT OUTER JOIN ?? s 
    ON c.id = s.category_id 
    ORDER BY c.id`
    inserts = ['category', 'sub_category']
  }

  sql = mysql.format(sql, inserts)
  const results = await sqlPoolExecute(sql)

  if (results instanceof Array && results) {
    interface Category {
      id: number
      name: string
      subcategories: Subcategory[]
    }

    interface Subcategory extends Omit<Category, 'subcategories'> {
      description: string
      category_id: number
    }

    let currentID = 0
    let modifiedResults: Category[] = new Array()
    let currentCategory: Category | null = null

    for (let i = 0; i < results.length; i++) {
      // create a new subcategory object
      let newSubcategory: Subcategory = {
        id: results[i]['subcategory_id'],
        name: results[i]['subcategory_name'],
        description: results[i]['description'],
        category_id: results[i]['id'],
      }

      if (results[i]['id'] !== currentID) {
        // results is sorted by id.
        // If result's id doesn't match currentID, currentCategory with currentID must already contain all its subcategories.
        // We can then create a new category to hold the next subcategory.

        currentID = results[i].id
        currentCategory = {
          id: currentID,
          name: results[i]['name'],
          subcategories: [],
        }

        modifiedResults.push(currentCategory)
      }

      // same category id, put newSubcategory into currentCategory
      if (newSubcategory.id) {
        currentCategory!.subcategories.push(newSubcategory)
      }
      // else we have a null subcategory.
      // leave the category with empty subcategories
    }

    return modifiedResults
  } else {
    throw new Error(`Mysql error`)
  }
}

/**
 * `INSERT INTO ?? SET ?`
 * @param table string of table's name
 * @param param object of the new entry
 * @returns results
 */
export const sqlInsert = async (table: string, param: any) => {
  let sql = `INSERT INTO ?? SET ?`
  const inserts = [table, param]
  sql = mysql.format(sql, inserts)

  const results = await sqlPoolExecute(sql)
  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}

/**
 * not in use
 * INSERT INTO ?? SET ?
 * @param table string of table's name
 * @param param object of the new entry
 * @returns results
 */
export const sqlInsertMultiple = async (category_id: string, items: any[]) => {
  let sql = `INSERT INTO subcategory(category_id, name, description) VALUES ?`
  const inserts = [
    items.map((item) => [category_id, item.name, item.description]),
  ]
  sql = mysql.format(sql, inserts)

  const results = await sqlPoolExecute(sql)

  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}

/**
 * `UPDATE ?? SET ? WHERE id = ?`
 * @param table string of table's name
 * @param content object of new data, `[key]: (value) == [field] : (value)`
 * @param id string
 * @returns
 */
export const sqlUpdate = async (
  table: string,
  content: Object,
  id: string,
  subId?: string
) => {
  let sql: string, inserts: any[]
  sql = `UPDATE ?? SET ? WHERE id = ?`
  inserts = [table, content, id]
  sql = mysql.format(sql, inserts)

  const results = await sqlPoolExecute(sql)

  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}

/**
 * DELETE FROM ?? WHERE id = ?
 * @param table string
 * @param id string
 * @returns
 */
export const sqlDelete = async (table: string, id: string) => {
  let sql = ''
  let inserts: string[]

  sql = `DELETE FROM ?? WHERE id = ?`
  inserts = [table, id]

  sql = mysql.format(sql, inserts)
  const results = await sqlPoolExecute(sql)

  if (!results) {
    throw new Error(`Mysql error`)
  }

  return results
}
