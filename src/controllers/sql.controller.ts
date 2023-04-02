import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()
import {
  sqlSelectLeftJoin,
  sqlSelectOne,
  sqlInsert,
  sqlUpdate,
  sqlDelete,
  sqlSelectAllSub,
  sqlSelectSubByCate,
  sqlSelectOneSub,
  sqlSelectAllP,
  sqlSelectPBySub,
  sqlSelectOneP,
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
    connection.connect((error) => {
      if (error) {
        return next(error.code + ' ' + error.toString())
      }
      console.log('>>> Connected as id ' + connection.threadId)
      res.status(200).json({ threadId: connection.threadId })
    })

    connection.end()
  } catch (error) {
    return next(error)
  }
}

// category controller
export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await sqlSelectLeftJoin()
    if (!data.length) return res.status(404).end()
    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    if (id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const data = await sqlSelectOne(id)
    if (!data.length) return res.status(404).end()

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name) {
      throw new Error('New category info not provided.')
    }

    const status = await sqlInsert('category', req.body)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(500).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
  }
}

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.id || !req.body.name) {
      throw new Error('Id and/or new value not provided.')
    }
    const { id } = req.params

    if (id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const status = await sqlUpdate('category', req.body, id)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(404).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    if (id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const status = await sqlDelete('category', id)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(404).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
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
    const data = await sqlSelectAllSub()
    if (!data || !data.length) {
      return res.status(404).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export const listSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    if (id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const data = await sqlSelectSubByCate(id)
    if (!data || !data.length) {
      return res.status(404).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export const getSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sub_id } = req.params
    if (sub_id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const data = await sqlSelectOneSub(sub_id)
    if (!data || !data.length) {
      return res.status(404).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export const createSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name || !req.body.description || !req.params.id) {
      throw new Error('New subcategory info not provided')
    }
    if (req.params.id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    // Add category id as foreign key to the new entry
    req.body.category_id = req.params.id

    const status = await sqlInsert('sub_category', req.body)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(404).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
  }
}

export const updateSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.sub_id || !req.body) {
      throw new Error('Id and/or new value not provided.')
    }

    const { sub_id } = req.params

    if (sub_id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const status = await sqlUpdate('sub_category', req.body, sub_id)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(404).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
  }
}

export const deleteSubcategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sub_id } = req.params

    if (sub_id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const status = await sqlDelete('sub_category', sub_id)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(404).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
  }
}

// products
export const listAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get data
    const data = await sqlSelectAllP()
    if (!data || !data.length) {
      return res.status(404).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sub_id } = req.params
    if (sub_id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const data = await sqlSelectPBySub(sub_id)
    if (!data || !data.length) {
      return res.status(404).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { p_id } = req.params
    if (p_id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const data = await sqlSelectOneP(p_id)
    if (!data || !data.length) {
      return res.status(404).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.size ||
      !req.body.color ||
      !req.body.price ||
      !req.body.quantity
    ) {
      throw new Error('New product info not provided')
    }
    if (req.params.sub_id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    req.body.sub_category_id = req.params.sub_id

    const status = await sqlInsert('product', req.body)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(404).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
  }
}

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.p_id || !req.body) {
      throw new Error('Id and/or new value not provided.')
    }

    const { p_id } = req.params
    if (p_id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const status = await sqlUpdate('product', req.body, p_id)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(404).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
  }
}

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { p_id } = req.params
    if (p_id.match(/^\d+$/) == null) {
      throw new Error('Id not found')
    }

    const status = await sqlDelete('product', p_id)
    if (!status || !status.affectedRows || status.affectedRows <= 0) {
      return res.status(404).json(status)
    }

    return res.status(200).json(status)
  } catch (error) {
    return next(error)
  }
}