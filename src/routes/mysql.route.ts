import express from 'express'
import {
  mysqlTester,
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  listSubcategories,
  listAllSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../controllers/sql.controller'

const router = express.Router()

router.get('/', mysqlTester)

// category route
router.get('/categories', listCategories) // get all (without subcategories)
router.get('/categories/:id', getCategory) // get one
router.post('/categories', createCategory)
router.put('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)

// sub_category route
router.get('/subcategories', listAllSubcategories) //get all
router.get('/categories/:id/subcategories', listSubcategories) // get all under one category
router.get('/subcategories/:sub_id', getSubcategory) // get one
router.post('/categories/:id/subcategories', createSubcategory)
router.put('/subcategories/:sub_id', updateSubcategory)
router.delete('/subcategories/:sub_id', deleteSubcategory)

export default router
