import { CreateProductRequest } from '../models/products_model.js'
import { ProductsRepository } from '../repositories/products_repository.js'

export class ProductsService {
  private repository = new ProductsRepository()

  async create(product: CreateProductRequest) {
    const createdProduct = await this.repository.create(product)
    return createdProduct
  }

  async getAll() {
    const products = await this.repository.getAll()
    return products
  }
  async getById(id: string) {
    const product = await this.repository.getById(id)
    return product
  }

  async update(id: string, product: Partial<CreateProductRequest>) {
    const updatedProduct = await this.repository.update(id, product)
    return updatedProduct
  }

  async delete(id: string) {
    const deletedProduct = await this.repository.delete(id)
    return deletedProduct
  }
}
