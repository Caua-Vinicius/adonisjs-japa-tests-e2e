import Dynamo from '../services/dynamo.js'
import { randomUUID } from 'node:crypto'
import { CreateProductRequest, ProductsModel } from '../models/products_model.js'
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { ReturnValue } from '@aws-sdk/client-dynamodb'
import env from '#start/env'

export class ProductsRepository {
  private tableName: string = env.get('TABLE_NAME')

  async create(product: CreateProductRequest): Promise<ProductsModel> {
    const id = randomUUID()
    const createProduct = { id, ...product }
    const params = {
      TableName: this.tableName,
      Item: createProduct,
    }

    await Dynamo.send(new PutCommand(params))

    return createProduct
  }

  async getAll(): Promise<ProductsModel[]> {
    const params = {
      TableName: this.tableName,
    }

    const result = await Dynamo.send(new ScanCommand(params))

    return result.Items as ProductsModel[]
  }

  async getById(id: string): Promise<ProductsModel | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    })
  
    const result = await Dynamo.send(command)
    return (result.Item as ProductsModel) || null
  }

  async update(id: string, product: Partial<CreateProductRequest>): Promise<ProductsModel | null> {
    const updateExpressions = Object.keys(product)
    if (updateExpressions.length === 0) return this.getById(id)

    const UpdateExpression = `SET ${updateExpressions
      .map((key, index) => `#${key} = :value${index}`)
      .join(', ')}`

    const ExpressionAttributeNames = updateExpressions.reduce(
      (acc, key) => {
        acc[`#${key}`] = key
        return acc
      },
      {} as Record<string, string>
    )

    const ExpressionAttributeValues = updateExpressions.reduce(
      (acc, key, index) => {
        acc[`:value${index}`] = product[key as keyof CreateProductRequest]
        return acc
      },
      {} as Record<string, any>
    )

    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW' as ReturnValue,
    }

    const result = await Dynamo.send(new UpdateCommand(params))
    return (result.Attributes as ProductsModel) || null
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    }

    await Dynamo.send(new DeleteCommand(params))
  }
}
