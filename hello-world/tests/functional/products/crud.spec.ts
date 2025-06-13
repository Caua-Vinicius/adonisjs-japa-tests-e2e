import { test } from '@japa/runner'

import { ProductsRepository } from '../../../app/repositories/products_repository.js'
import { faker } from '@faker-js/faker'

const productsRepository = new ProductsRepository()

test.group('Product CRUD routes', () => {
  test('should create a new product', async ({ client, assert }) => {
    const payload = {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
    }

    const response = await client.post('/products').json(payload)

    response.assertStatus(201)
    response.assertBodyContains({ ...payload })

    const product = await productsRepository.getById(response.body().id)
    assert.exists(product)
    assert.equal(product?.description, payload.description)
    assert.equal(product?.name, payload.name)
    assert.equal(product?.price, payload.price)
  })

  test('should retrieve a product by ID', async ({ client, assert }) => {
    const product = await productsRepository.create({
      name: faker.commerce.productName(),
      price: faker.number.int(),
      description: faker.commerce.productDescription(),
    })

    const response = await client.get(`/products/${product.id}`)

    response.assertStatus(200)
    response.assertBodyContains({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
    })

    const retrievedProduct = await productsRepository.getById(product.id)
    assert.exists(retrievedProduct)
  })

  test('should update an existing product', async ({ client, assert }) => {
    const product = await productsRepository.create({
      name: faker.commerce.productName(),
      price: faker.number.int(),
      description: faker.commerce.productDescription(),
    })

    const updatedPayload = {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
    }

    const response = await client.put(`/products/${product.id}`).json(updatedPayload)

    response.assertStatus(200)
    response.assertBodyContains({ ...updatedPayload })

    const updatedProduct = await productsRepository.getById(product.id)
    assert.exists(updatedProduct)
    assert.equal(updatedProduct?.name, updatedPayload.name)
    assert.equal(updatedProduct?.price, updatedPayload.price)
    assert.equal(updatedProduct?.description, updatedPayload.description)
  })

  test('should delete a product', async ({ client, assert }) => {
    const product = await productsRepository.create({
      name: faker.commerce.productName(),
      price: faker.number.int(),
      description: faker.commerce.productDescription(),
    })

    const response = await client.delete(`/products/${product.id}`)

    response.assertStatus(204)

    const deletedProduct = await productsRepository.getById(product.id)
    assert.isNull(deletedProduct)
  })

  test('should return 404 when retrieving a non-existent product', async ({ client }) => {
    const response = await client.get('/products/999999')

    response.assertStatus(404)
    response.assertBodyContains({ error: 'Product not found' })
  })

  test('should return 404 when updating a non-existent product', async ({ client }) => {
    const updatedPayload = {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
    }

    const response = await client.put('/products/999999').json(updatedPayload)

    response.assertStatus(404)
    response.assertBodyContains({ error: 'Product not found' })
  })

  test('should return 404 when deleting a non-existent product', async ({ client }) => {
    const response = await client.delete('/products/999999')

    response.assertStatus(404)
    response.assertBodyContains({ error: 'Product not found' })
  })
})
