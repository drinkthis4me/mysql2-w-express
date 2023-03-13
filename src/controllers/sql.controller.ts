import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()
import {
  sqlInsert,
  sqlSelectOneRow,
  sqlUpdate,
  sqlDelete,
  sqlSelectLeftJoin,
  sqlSelectFromSubPartial,
  sqlSelectFromSubOneRow,
  sqlSelectFromSubAll,
} from '../models/mall.model'

export const mysqlTester = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    })
    connection.connect((err) => {
      if (err) {
        return next(new Error(err.code + ' ' + err.toString()))
      }
      console.log('>>> Connected as id ' + connection.threadId)
      res.status(200).json({ threadId: connection.threadId })
    })

    connection.end()
  } catch (error) {
    return next(new Error(error))
  }
}

// category controller
export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await sqlSelectLeftJoin()
      .then((response) => {
        if (!response.length) {
          return res.status(404).end()
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {
    return next(new Error(error))
  }
}

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id
  try {
    await sqlSelectOneRow('category', id)
      .then((response) => {
        if (!response.length) {
          return res.status(404).end()
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {
    return next(new Error(error))
  }
}

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) {
    return next(new Error(`>>> New category info not provided.`))
  }

  try {
    await sqlInsert('category', req.body)
      .then((response) => {
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {
    return next(new Error(error))
  }
}

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  if (!id || !req.body.name) {
    return next(new Error('>>> Id and/or new value not provided.'))
  }

  try {
    await sqlUpdate('category', req.body, id)
      .then((response) => {
        if (response.affectedRows <= 0) {
          res.status(404).json(response)
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {
    return next(new Error(error))
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  try {
    await sqlDelete('category', id)
      .then((response) => {
        if (response.affectedRows && response.affectedRows <= 0) {
          res.status(404).json(response)
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {
    return next(new Error(error))
  }
}
// end of category routes controllers

// start of subcategory routes controllers
export const listAllSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await sqlSelectFromSubAll()
      .then((response) => {
        if (!response.length) {
          return res.status(404).end()
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (err) {
    return next(new Error(err))
  }
}

export const listSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  try {
    await sqlSelectFromSubPartial(id)
      .then((response) => {
        if (!response.length) {
          return res.status(404).end()
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (err) {
    return next(new Error(err))
  }
}

export const getSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sub_id } = req.params

  try {
    await sqlSelectFromSubOneRow(sub_id)
      .then((response) => {
        if (!response.length) {
          return res.status(404).end()
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {
    return next(new Error(error))
  }
}

export const createSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body || !req.params.id) {
    return next(new Error(`>>> New subcategory info not provided.`))
  }

  // Add category id as foreign key to the new entry
  req.body.category_id = req.params.id

  try {
    await sqlInsert('sub_category', req.body)
      .then((response) => {
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {}
}

export const updateSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sub_id } = req.params

  if (!sub_id || !req.body) {
    return next(new Error('>>> Id and/or new value not provided.'))
  }

  try {
    await sqlUpdate('sub_category', req.body, sub_id)
      .then((response) => {
        if (response.affectedRows <= 0) {
          return res.status(404).json(response)
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {}
}

export const deleteSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sub_id } = req.params

  try {
    await sqlDelete('sub_category', sub_id)
      .then((response) => {
        if (response.affectedRows <= 0) {
          return res.status(404).json(response)
        }
        return res.status(200).json(response)
      })
      .catch((err) => {
        return next(new Error(err))
      })
  } catch (error) {
    return next(new Error(error))
  }
}
