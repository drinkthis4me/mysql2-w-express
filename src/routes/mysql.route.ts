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
  listAllProducts,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
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

// product route
router.get('/products', listAllProducts) // get all
router.get('subcategories/:sub_id/products', listProducts) // get all under one subcategory
router.get('/products/:p_id', getProduct) // get one
router.post('/subcategories/:sub_id/products', createProduct)
router.put('/products/:p_id', updateProduct)
router.delete('/products/:p_id', deleteProduct)

export default router
