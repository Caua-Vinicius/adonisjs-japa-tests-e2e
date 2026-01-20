import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ProductsService } from '#services/products_service'

@inject()
export default class ProductsController {
  constructor(private service: ProductsService) {}

  async create({ request, response }: HttpContext) {
    const product = request.only(['name', 'price', 'description'])

    const result = await this.service.create(product)

    return response.created(result)
  }
  async getAll({ response }: HttpContext) {
    const products = await this.service.getAll()

    return response.ok(products)
  }
  async getById({ params, response }: HttpContext) {
    const { id } = params

    const product = await this.service.getById(id)

    if (!product) {
      return response.status(404).send({ error: 'Product not found' })
    }

    return response.ok(product)
  }

  async update({ params, request, response }: HttpContext) {
    const { id } = params
    const product = request.only(['name', 'price', 'description'])

    const updatedProduct = await this.service.update(id, product)

    if (!updatedProduct) {
      return response.status(404).send({ error: 'Product not found' })
    }

    return response.ok(updatedProduct)
  }
  async delete({ params, response }: HttpContext) {
    const { id } = params

    const deletedProduct = await this.service.delete(id)

    if (!deletedProduct) {
      return response.status(404).send({ error: 'Product not found' })
    }

    return response.noContent()
  }
}
