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
router.get('/categories', listCategories)
router.get('/categories/:id', getCategory)
router.post('/categories', createCategory)
router.put('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)

// sub_category route
router.get('/subcategories', listAllSubcategories)
router.get('/categories/:id/subcategories', listSubcategories)
router.get('/subcategories/:sub_id', getSubcategory)
router.post('/categories/:id/subcategories', createSubcategory)
router.put('/subcategories/:sub_id', updateSubcategory)
router.delete('/subcategories/:sub_id', deleteSubcategory)

export default router
