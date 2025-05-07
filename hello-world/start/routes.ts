/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ProductsController = () => import('../app/controllers/products_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('/products', [ProductsController, 'create'])
router.get('/products', [ProductsController, 'getAll'])
router.get('/products/:id', [ProductsController, 'getById'])
router.put('/products/:id', [ProductsController, 'update'])
router.delete('/products/:id', [ProductsController, 'delete'])
