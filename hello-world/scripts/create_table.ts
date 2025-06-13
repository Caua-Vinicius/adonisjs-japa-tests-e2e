import {
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
  ScalarAttributeType,
  KeyType,
} from '@aws-sdk/client-dynamodb'

import client from '../app/services/dynamo.js'
import env from '#start/env'

const params = {
  TableName: env.get('TABLE_NAME'),
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: ScalarAttributeType.S,
    },
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: KeyType.HASH,
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
}

export async function createTable() {
  try {
    await client.send(new DescribeTableCommand({ TableName: params.TableName }))
    console.log(`Table "${params.TableName}" already exists. Skipping creation.`)
  } catch (err) {
    if (err instanceof ResourceNotFoundException) {
      try {
        const result = await client.send(new CreateTableCommand(params))
        console.log(`Table "${params.TableName}" created successfully:`, result)
      } catch (createErr) {
        console.error('Error while creating table:', createErr)
      }
    } else {
      console.error('Error while checking table existence:', err)
    }
  }
}
